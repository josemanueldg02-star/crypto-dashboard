import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [criptomonedas, setCriptomonedas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatosDelBackend = async () => {
      try {
        // ¡LA CLAVE ESTÁ AQUÍ! 
        // El mensajero va al puerto 8080 (Java) y pide la ruta /api/carteras/usuario/1
        const respuesta = await fetch('http://localhost:8080/api/carteras/usuario/1');
        
        if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const datosReales = await respuesta.json();
        setCriptomonedas(datosReales);
        
      } catch (error) {
        console.error("[-] Fallo en la conexión con el Backend:", error);

        setCriptomonedas([
          { id: 1, nombre: 'Bitcoin (Plan B)', simbolo: 'BTC', cantidad: 0.45, precio: 62000 },
          { id: 2, nombre: 'Ethereum (Plan B)', simbolo: 'ETH', cantidad: 3.2, precio: 3100 }
        ]);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosDelBackend();
  }, []); 

  // Lógica matemática para el saldo dinámico
  const saldoTotal = criptomonedas.reduce((total, crypto) => total + (crypto.cantidad * crypto.precio), 0);

  // Pantalla de carga
  if (cargando) {
    return (
      <div className="dashboard-container">
        <h1 style={{textAlign: 'center', marginTop: '20%'}}>⏳ Conectando con los servidores seguros...</h1>
      </div>
    );
  }

  // Dashboard principal
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

      <main className="grid-criptomonedas">
        {criptomonedas.map((crypto) => (
          <div key={crypto.id} className="tarjeta-crypto">
            <div className="crypto-info">
              <h3>{crypto.nombre} <span className="simbolo">{crypto.simbolo}</span></h3>
              <p className="cantidad">{crypto.cantidad} {crypto.simbolo}</p>
            </div>
            <div className="crypto-valor">
              <p className="precio-unitario">Precio: ${crypto.precio ? crypto.precio.toLocaleString() : 0}</p>
              <p className="valor-total">
                ${(crypto.cantidad * crypto.precio) ? (crypto.cantidad * crypto.precio).toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

export default App