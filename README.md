# StockSense

A stock analysis web app: watchlists, price alerts and AI summaries.
Frontend: Next.js (TypeScript), Tailwind CSS, Redux Toolkit + RTK Query, Recharts. Backend lives in a separate repo (added later).

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Folder guide
- `app/` : pages (each folder is a URL; `page.tsx` is the page, `layout.tsx` wraps all pages)
- `app/globals.css` : Tailwind plus the shared `.card` and `.btn-gold` styles
- `tailwind.config.ts` : theme colors (black, gold, up/down colors) and font

## What I learned
(Write this in your own words after each step.)

## Data layer
All data comes from `lib/mockData.ts` through RTK Query (`store/api.ts`).
When the backend is ready, only `store/api.ts` changes (fakeBaseQuery -> fetchBaseQuery).

## About the project (plain English)
StockSense helps people follow stocks. A user saves stocks to a watchlist, sees an AI-style
signal for each one, and gets alerts when the price or signal changes.
The signal and prices are demo data for now and are not financial advice.

## Glossary
- **Stock**: a small share of a company. Its price moves up and down during the day.
- **Bullish**: the price is more likely to go up.
- **Bearish**: the price is more likely to go down.
- **Neutral**: no clear direction.
- **Confidence**: how strong the signal is (higher is stronger).
- **Watchlist**: the stocks a user wants to keep an eye on.
- **Alert**: a notice when a price or signal changes.
- **Support / Resistance**: a price floor / ceiling the stock has trouble crossing.
- **Volume**: how many shares were traded in a day.
