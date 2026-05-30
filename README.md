# 🚀 CryptoPortfolio Dashboard

Interfaz moderna construida con React para gestionar y visualizar una cartera de criptomonedas. Este proyecto está diseñado para conectarse de forma fluida a una API robusta en Java (Spring Boot) y reflejar los datos en tiempo real.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React (Vite)
* **Estilos:** CSS3 nativo con diseño Dark Mode moderno y paleta de colores profesional.
* **Integración HTTP:** Peticiones asíncronas (`fetch`) con resolución bidireccional y manejo de estados de carga (`useState`, `useEffect`).

## ✨ Características Principales

1. **Arquitectura Full-Stack:** Conectado directamente a un backend en Spring Boot y a una base de datos PostgreSQL alojada en contenedores Docker.
2. **Two-Way Data Binding:** Formularios interactivos que envían datos (POST) y actualizan el panel visual instantáneamente sin recargar la página.
3. **Manejo de Errores Profesional:** Bloques `try/catch` para atrapar respuestas de servidor fallidas y evitar caídas de la interfaz.
4. **Estrategia de Seguridad CORS:** Intercambio de peticiones estructuradas mediante Query Parameters para sortear filtros estrictos de Spring Security y prevenir pérdidas de "Body".

## 🚀 Próximos Pasos (Roadmap)
* [ ] Integrar consumo de APIs públicas (CoinGecko / Binance) para mostrar precios en vivo.
* [ ] Calcular el patrimonio real multiplicando saldos por la cotización en tiempo real.
* [ ] Desarrollar botones operativos de simulación de compra/venta.

---
*Desarrollado con arquitectura sólida para escalabilidad financiera.*