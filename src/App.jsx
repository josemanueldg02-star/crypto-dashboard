import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. ESTADOS
  const [criptomonedas, setCriptomonedas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevaMoneda, setNuevaMoneda] = useState('');
  const [enviando, setEnviando] = useState(false);
  
  //Estado para almacenar los precios en vivo desde Binance
  const [precios, setPrecios] = useState({});

  // 2. CONEXIÓN CON MI BACKEND (JAVA)
  const obtenerDatosDelBackend = async () => {
    try {
      const respuesta = await fetch('http://localhost:8080/api/carteras/usuario/1');
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
      
      const datosReales = await respuesta.json();
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
    // Si no tenemos monedas en la cartera, no hay nada que buscar
    if (criptomonedas.length === 0) return;

    const obtenerPreciosDeBinance = async () => {
      const nuevosPrecios = {};
      
      for (const crypto of criptomonedas) {
        try {
          const par = `${crypto.simboloMoneda}USDT`;
          const respuesta = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${par}`);
          
          if (respuesta.ok) {
            const datos = await respuesta.json();
            // Guardamos el precio convertido a número decimal
            nuevosPrecios[crypto.simboloMoneda] = parseFloat(datos.price);
          }
        } catch (error) {
          console.error(`[-] Error buscando precio de ${crypto.simboloMoneda} en Binance:`, error);
        }
      }
      
      // Actualizamos la memoria de React con los precios frescos
      setPrecios(nuevosPrecios);
    };

    // Buscamos los precios inmediatamente...
    obtenerPreciosDeBinance();

    // ...Y configuramos un temporizador para buscar precios frescos cada 10 segundos
    const intervalo = setInterval(obtenerPreciosDeBinance, 10000);
    
    // Limpiamos el temporizador si el componente se cierra
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

  // 5. CÁLCULO DINÁMICO DEL PATRIMONIO
  const saldoTotal = criptomonedas.reduce((total, crypto) => {
    const precioActual = precios[crypto.simboloMoneda] || 0;
    return total + ((crypto.saldo || 0) * precioActual);
  }, 0);


  // 6. RENDERIZADO VISUAL
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
          {}
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
            // Extraemos el precio en vivo de esta moneda (o mostramos 0 si aún está cargando)
            const precioActual = precios[crypto.simboloMoneda] || 0;
            const valorTotalMoneda = (crypto.saldo || 0) * precioActual;

            return (
              <div key={crypto.id} className="tarjeta-crypto">
                <div className="crypto-info">
                  <h3>{crypto.simboloMoneda}</h3>
                  <p className="cantidad">{crypto.saldo} {crypto.simboloMoneda}</p>
                </div>
                <div className="crypto-valor">
                  {}
                  <p className="precio-unitario">
                    Precio: {precioActual > 0 ? `$${precioActual.toLocaleString('en-US', {minimumFractionDigits: 2})}` : 'Buscando precio...'}
                  </p>
                  <p className="valor-total">
                    ${valorTotalMoneda.toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </p>
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