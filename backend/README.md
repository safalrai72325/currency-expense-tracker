# Currency & Expense Snapshot

A small full-stack app for logging expenses in different currencies and
viewing them converted into a single "home currency," with a running total.

- **Backend:** Node.js + Express (in-memory storage)
- **Frontend:** React (Vite) + plain CSS
- **Exchange rates:** [Frankfurter](https://www.frankfurter.app/) (free, no API key)

## Setup & run

Requires Node.js 18+.

### Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:4000`. Health check: `GET /health`.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000` and proxies `/expenses` and `/convert`
requests to the backend (see `vite.config.js`), so no extra configuration
is needed. Open `http://localhost:3000` in your browser.

## Exchange rate API

Uses [**Frankfurter**](https://www.frankfurter.app/docs/) — free, no API
key or signup required. The backend calls it server-side, inside
`backend/routes/convert.js`; the React frontend never calls the external
API directly — it only ever talks to this app's own `/convert` endpoint.

If a different provider that requires an API key were used instead, the
key would go in a `.env` file inside `backend/`, loaded via
`process.env.SOME_KEY_NAME` — but no key or `.env` file is needed for
Frankfurter.

## API reference

 Method  Route             Description                                   
 GET     `/expenses`       List all expenses                              
 POST    `/expenses`       Add an expense (`title`, `amount`, `currency`, optional `date`) 
 DELETE  `/expenses/:id`   Delete an expense                              
 GET     `/convert`        `?from=USD&to=EUR&amount=100`                  
 GET     `/health`         Liveness check                                

Validation errors return `400` with a JSON error message. Conversion
failures (the external API being slow, down, or returning something
unexpected) return `502`/`504` with a clear JSON error instead of
crashing the server — the frontend shows "conversion unavailable" for
that specific expense when this happens, without blocking the rest of
the list.

## Assumptions & notes

- **NPR** is included as a currency option (per the assignment's own
  example list), but Frankfurter's free feed doesn't actually carry NPR
  rates. Conversions involving NPR will return a clear `502` error rather
  than fail silently or crash.
- The running total only sums expenses that converted successfully; if
  any are still loading or failed, that's shown next to the total instead
  of silently showing a wrong number.
- Delete is optimistic in the UI (removed immediately) and rolls back if
  the backend call fails.
- No database — expenses are stored in memory in the Express server and
  reset when the server restarts, per the assignment's rules.

## What I'd improve with more time

- Automated tests (currently verified manually end-to-end).
- Editing an existing expense (currently add/delete only).
- Persisting data so it survives a server restart.
