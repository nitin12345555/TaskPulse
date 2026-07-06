# TaskPulse Frontend

## Setup

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment

This app reads the live backend URL from `.env.local`:

```env
NEXT_PUBLIC_API_BASE=https://internal-hr-dashboard-sevices-production.up.railway.app
```

## What it does

- Fetches tasks from `/api/tasks` with pagination
- Normalizes messy backend fields into typed task data
- Subscribes to WebSocket updates for live task changes
- Streams task summaries from `/api/tasks/:id/summary`
- Renders streamed markdown safely with `react-markdown` and `rehype-sanitize`
- Caches the latest task page in IndexedDB using `localforage`

## Notes

- The app uses Zustand instead of Redux as requested.
- The summary stream is treated as untrusted and sanitized before rendering.
- Task filters, paging, and selection are handled in client state.

## Scripts

- `npm run dev` — start the frontend
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
- `npm run test` — run Jest tests
