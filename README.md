# 🚀 CryptoPortfolio Dashboard

Interfaz moderna construida con React para gestionar y visualizar una cartera de criptomonedas. Este proyecto está diseñado para conectarse de forma fluida a una API robusta en Java (Spring Boot) y reflejar los datos y cotizaciones del mercado en tiempo real.

## ✨ Características Principales

1. **Arquitectura Full-Stack:** Conectado directamente a un backend transaccional en Spring Boot y a una base de datos PostgreSQL alojada mediante contenedores Docker.
2. **Cotizaciones en Vivo (Binance API):** Consumo asíncrono de la API pública de Binance para actualizar los precios de los activos cada pocos segundos sin recargar la página.
3. **Motor Transaccional Dinámico:** Botones de simulación de compra/venta que se comunican vía peticiones `PUT` con la base de datos para actualizar los saldos al instante.
4. **Cálculo de Patrimonio en Tiempo Real:** Algoritmo que cruza los saldos locales de la base de datos con los precios del mercado global para calcular el valor total del portfolio con precisión.
5. **UI/UX Blindada (Anti-Layout Shift):** Diseño robusto utilizando CSS avanzado (`tabular-nums`, `text-overflow`, `white-space: nowrap`) para garantizar que la cuadrícula no sufra desajustes visuales ante la volatilidad de los números.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React (Vite).
* **Estilos:** CSS3 nativo con diseño Dark Mode moderno y reglas tipográficas estrictas.
* **Integración HTTP:** Peticiones asíncronas (`fetch`) con resolución bidireccional y manejo de estados de ciclo de vida (`useState`, `useEffect`).

## 🚀 Próximos Pasos (Roadmap)
* [ ] Integrar una librería de gráficos (ej. Chart.js) para visualizar visualmente la distribución del portfolio.
* [ ] Desarrollar un historial de transacciones (libro mayor) para registrar la fecha y hora de cada compra y venta.
* [ ] Añadir selector de divisas fiduciarias para ver el patrimonio en EUR, GBP, etc.

---
*Desarrollado con arquitectura sólida para escalabilidad financiera.*