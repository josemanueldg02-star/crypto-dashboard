import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [criptomonedas, setCriptomonedas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ESTADOS PARA EL FORMULARIO.
  const [nuevaMoneda, setNuevaMoneda] = useState(''); // Guardamos lo que escribimos en tiempo real.
  const [enviando, setEnviando] = useState(false); // Bloquea el botón para evitar un doble clic.

  const obtenerDatosDelBackend = async () => {
    try {
      const respuesta = await fetch('http://localhost:8080/api/carteras/usuario/1');
      if (!respuesta.ok) throw new Error('Error HTTP: ${respuesta.status}');

      const datosReales = await respuesta.json();
      setCriptomonedas(datosReales);
    } catch (error) {
      console.error("[-] Fallo en la conexión con el Backend:", error);
    } finally {
      setCargando(false);
    }
  };

  // Ejecutar automáticamente al abrir la página.
  useEffect(() => {
    obtenerDatosDelBackend();
  }, []);

  // LÓGICA PARA ENVIAR DATOS A JAVA.
  const agregarCriptomoneda = async (e) => {
    e.preventDefault();
    if (!nuevaMoneda) return;

    setEnviando(true);
    try {
      const urlExacta = `http://localhost:8080/api/carteras/usuario/1?simboloMoneda=${nuevaMoneda.toUpperCase()}`;
      
      const respuesta = await fetch(urlExacta, {
        method: 'POST'
      });

      if (!respuesta.ok) throw new Error('Fallo al crear la cartera');

      // Si hay éxito, recargamos la lista
      await obtenerDatosDelBackend();
      setNuevaMoneda('');
    } catch (error) {
      console.error("Error al añadir moneda:", error);
      alert("Hubo un error al añadir la moneda. Revisa la consola.");
    } finally {
      setEnviando(false);
    }
  };

  // Por el momento, pondremos un precio temporal de 0€ hasta que conecte la API.
  const saldoTotal = criptomonedas.reduce((total, crypto) => total + ((crypto.saldo || 0) * 0), 0);

  if (cargando) {
    return (
      <div className="dashboard-container">
        <h1 style={{textAlign: 'center', marginTop: '20%'}}> Conectando con los servidores...</h1>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="titulo">
          <h1>🚀 CryptoPortfolio</h1>
          <p>Conectado a la Base de Datos Local</p>
        </div>
        <div className="saldo-total">
          <p>Saldo Total Estimado</p>
          <h2>${saldoTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
        </div>
      </header>

      {/* 3. NUESTRO FORMULARIO INTERACTIVO */}
      <section className="seccion-formulario">
        <form onSubmit={agregarCriptomoneda} className="formulario-crypto">
          <input 
            type="text" 
            placeholder="Añadir símbolo (Ej. BTC, ETH...)" 
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
        {/* Si el array está vacío, mostramos un mensaje amigable */}
        {criptomonedas.length === 0 ? (
          <p className="mensaje-vacio">No tienes activos en tu cartera. ¡Añade tu primera criptomoneda arriba!</p>
        ) : (
          criptomonedas.map((crypto) => (
            <div key={crypto.id} className="tarjeta-crypto">
              <div className="crypto-info">
                <h3>{crypto.simboloMoneda}</h3>
                <p className="cantidad">{crypto.saldo} {crypto.simboloMoneda}</p>
              </div>
              <div className="crypto-valor">
                <p className="precio-unitario">Activo registrado</p>
                <p className="valor-total">
                  {/* Cuando integres precios reales, multiplicaremos aquí */}
                  Buscando valor...
                </p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}

export default App