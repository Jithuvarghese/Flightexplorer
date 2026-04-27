# Flight Explorer

Flight Explorer is a React + Vite web app for browsing live flight data, filtering routes, and tracking flights in a personal watchlist.

## Features

- Live flight listing powered by Aviationstack
- Search by flight number, airline, origin, and destination
- Flight details modal with schedule and status data
- Watchlist with localStorage persistence
- Responsive UI with dark/light theme toggle

## Tech Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS
- Axios
- Vitest + Testing Library

## Requirements

- Node.js 20.19+ or 22.12+
- npm 10+

## Environment Setup

Create a local `.env` file and set your Aviationstack key.

```bash
touch .env
```

Add values to `.env`:

```env
VITE_API_BASE_URL=https://api.aviationstack.com
VITE_AVIATIONSTACK_API_KEY=your_api_key_here
```

If you deploy to Vercel, add the same `VITE_AVIATIONSTACK_API_KEY` value in the project Environment Variables settings and redeploy. Do not leave it blank in `vercel.json`, because Vite reads `VITE_*` values at build time.

## Run Locally

```bash
npm install
npm run dev
```

On Windows PowerShell, if execution policy blocks `npm`, use:

```powershell
npm.cmd run dev
```

App runs at http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm test
```

## API Notes

- Client API service: `src/api/flights.js`
- Dev proxy: `vite.config.ts`
- Deployment rewrites/env: `vercel.json`

The app requests `/api/v1/flights` and passes `access_key` and `limit` query params. Responses are normalized in the API layer for UI compatibility.
