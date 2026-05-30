import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. ESTADOS
  const [criptomonedas, setCriptomonedas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevaMoneda, setNuevaMoneda] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [precios, setPrecios] = useState({});

  // 2. CONEXIÓN CON MI BACKEND (JAVA)
  const obtenerDatosDelBackend = async () => {
    try {
      const respuesta = await fetch('http://localhost:8080/api/carteras/usuario/1');
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
      
      const datosReales = await respuesta.json();

      // 🚀 BLINDAJE 1 (El orden): 
      // Obligamos a la lista a ordenarse siempre por ID para evitar los saltos de PostgreSQL
      datosReales.sort((a, b) => a.id - b.id);

      setCriptomonedas(datosReales);
    } catch (error) {
      console.error("[-] Fallo en la conexión con Java:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerDatosDelBackend();
  }, []); 

  // 3. CONEXIÓN CON BINANCE
  useEffect(() => {
    if (criptomonedas.length === 0) return;

    const obtenerPreciosDeBinance = async () => {
      const nuevosPrecios = {};
      
      for (const crypto of criptomonedas) {
        try {
          const par = `${crypto.simboloMoneda}USDT`;
          const respuesta = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${par}`);
          
          if (respuesta.ok) {
            const datos = await respuesta.json();
            nuevosPrecios[crypto.simboloMoneda] = parseFloat(datos.price);
          }
        } catch (error) {
          console.error(`[-] Error buscando precio de ${crypto.simboloMoneda} en Binance:`, error);
        }
      }
      
      setPrecios(nuevosPrecios);
    };

    obtenerPreciosDeBinance();
    const intervalo = setInterval(obtenerPreciosDeBinance, 10000);
    return () => clearInterval(intervalo);
    
  }, [criptomonedas]); 

  // 4. LÓGICA DE FORMULARIO (Mandar datos a Java)
  const agregarCriptomoneda = async (e) => {
    e.preventDefault();
    if (!nuevaMoneda) return;

    setEnviando(true);
    try {
      const urlExacta = `http://localhost:8080/api/carteras/usuario/1?simboloMoneda=${nuevaMoneda.toUpperCase()}`;
      const respuesta = await fetch(urlExacta, { method: 'POST' });

      if (!respuesta.ok) throw new Error('Fallo al crear la cartera');

      await obtenerDatosDelBackend();
      setNuevaMoneda('');
    } catch (error) {
      console.error("Error al añadir moneda:", error);
      alert("Hubo un error al añadir la moneda. Revisa la consola.");
    } finally {
      setEnviando(false);
    }
  };

  // 5. LÓGICA DE OPERACIONES (Modificar Saldo)
  const modificarSaldo = async (simbolo, cantidad) => {
    try {
      const urlExacta = `http://localhost:8080/api/carteras/usuario/1/modificar?simboloMoneda=${simbolo}&monto=${cantidad}`;

      const respuesta = await fetch(urlExacta, {
        method: 'PUT'
      });

      if (!respuesta.ok) throw new Error('Fallo al modificar el saldo');

      await obtenerDatosDelBackend();
    } catch (error) {
      // Corrección de las comillas invertidas aplicada aquí:
      console.error(`Error al operar con ${simbolo}:`, error);
      alert("Hubo un error al realizar la operación.");
    }
  };

  // 6. CÁLCULO DINÁMICO DEL PATRIMONIO
  const saldoTotal = criptomonedas.reduce((total, crypto) => {
    const precioActual = precios[crypto.simboloMoneda] || 0;
    return total + ((crypto.saldo || 0) * precioActual);
  }, 0);


  // 7. RENDERIZADO VISUAL
  if (cargando) {
    return (
      <div className="dashboard-container">
        <h1 style={{textAlign: 'center', marginTop: '20%'}}>⏳ Conectando con los servidores seguros...</h1>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="titulo">
          <h1>🚀 CryptoPortfolio</h1>
          <p>Conectado a Base de Datos y Binance API</p>
        </div>
        <div className="saldo-total">
          <p>Patrimonio Real</p>
          <h2>${saldoTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
        </div>
      </header>

      <section className="seccion-formulario">
        <form onSubmit={agregarCriptomoneda} className="formulario-crypto">
          <input 
            type="text" 
            placeholder="Añadir símbolo (Ej. BTC, ETH, SOL...)" 
            value={nuevaMoneda}
            onChange={(e) => setNuevaMoneda(e.target.value)}
            maxLength={10}
            required
          />
          <button type="submit" disabled={enviando}>
            {enviando ? '⏳ Añadiendo...' : '➕ Añadir a la Cartera'}
          </button>
        </form>
      </section>

      <main className="grid-criptomonedas">
        {criptomonedas.length === 0 ? (
          <p className="mensaje-vacio">No tienes activos en tu cartera. ¡Añade tu primera criptomoneda arriba!</p>
        ) : (
          criptomonedas.map((crypto) => {
            const precioActual = precios[crypto.simboloMoneda] || 0;
            const valorTotalMoneda = (crypto.saldo || 0) * precioActual;

            return (
              <div key={crypto.id} className="tarjeta-crypto" style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}>
                <div className="crypto-info" style={{ width: '100%' }}>
                  <h3>{crypto.simboloMoneda}</h3>
                  <p className="cantidad" style={{
                    fontVariantNumeric: 'tabular-nums', // 🪄 MAGIA 1: Todos los números miden lo mismo
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    width: '100%' // 🪄 MAGIA 2: Prohíbe ensanchar la tarjeta
                  }}>
                    {Number(crypto.saldo).toLocaleString('en-US', { maximumFractionDigits: 4 })} {crypto.simboloMoneda}
                  </p>
                </div>
                
                <div className="crypto-valor" style={{ width: '100%', flexGrow: 1 }}>
                  <p className="precio-unitario" style={{
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    width: '100%'
                  }}>
                    Precio: {precioActual > 0 ? `$${precioActual.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'Calculando...'}
                  </p>
                  <p className="valor-total" style={{
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    width: '100%'
                  }}>
                    ${valorTotalMoneda.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </p>
                </div>

                {/* PANEL DE OPERACIONES */}
                <div className="crypto-operaciones" style={{ display: 'flex', gap: '10px', marginTop: 'auto', width: '100%' }}>
                  <button 
                    onClick={() => modificarSaldo(crypto.simboloMoneda, -0.1)}
                    disabled={crypto.saldo <= 0.0001} 
                    style={{ flex: 1, backgroundColor: '#ff4d4d', minWidth: 0, padding: '10px 5px', whiteSpace: 'nowrap' }}
                  >
                    Vender 0.1
                  </button>
                  <button 
                    onClick={() => modificarSaldo(crypto.simboloMoneda, 0.1)}
                    style={{ flex: 1, backgroundColor: '#4caf50', minWidth: 0, padding: '10px 5px', whiteSpace: 'nowrap' }}
                  >
                    Comprar 0.1
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  )
}

export default App