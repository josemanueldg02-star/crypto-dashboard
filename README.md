# Crypto Exchange — Dashboard

React frontend for the [crypto-api](https://github.com/josemanueldg02-star/crypto-api) 
exchange backend. Displays real-time portfolio value, live crypto prices from 
Binance, and lets users simulate buy/sell orders with instant balance updates.

[![React](https://img.shields.io/badge/React-latest-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-latest-purple)](https://vitejs.dev/)
[![Binance API](https://img.shields.io/badge/Binance-live%20prices-F0B90B)](https://binance-docs.github.io/apidocs/)

---

## Features

- **Live Binance prices** polling every few seconds without page reload
- **Real-time portfolio value** calculated by crossing database balances 
with current market prices
- **Buy/sell simulation** via PUT requests that update balances instantly
- Dark mode UI with anti-layout-shift CSS (`tabular-nums`, `text-overflow`) 
to handle volatile number updates cleanly

---

## Running Locally

**Prerequisites:** Node.js LTS, and [crypto-api](https://github.com/josemanueldg02-star/crypto-api) 
running on port 8080.

```bash
git clone https://github.com/josemanueldg02-star/crypto-dashboard.git
cd crypto-dashboard
npm install
npm run dev
```

---

## Author

**José Manuel Domínguez García** · [@josemanueldg02-star](https://github.com/josemanueldg02-star)
