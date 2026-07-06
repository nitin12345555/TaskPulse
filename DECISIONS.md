# Design Decisions

## Routing and architecture
- Used Next.js App Router because the workspace already contains `app/layout.tsx` and `app/page.tsx`, which fits the requested frontend structure.
- Kept the entire UI client-side (`use client`) for live WebSocket and SSE behavior.

## State management
- Used Zustand instead of Redux to satisfy the user requirement and keep state logic minimal and easy to follow.
- Centralized task data, filters, pagination, selected task, and summary state in `lib/store.ts`.

## Data normalization
- Added `lib/normalize.ts` to safely convert untrusted backend fields into typed `Task` values.
- Normalized strings, numeric fields, dates, and assignee objects to prevent malformed backend payloads from corrupting client state.

## Live updates and real-time feed
- Implemented `hooks/useTaskFeed.ts` to subscribe to backend WebSocket task events and update the store incrementally.
- Added exponential backoff reconnect logic to make the live feed more robust without overwhelming the backend.
- Used `useTaskStore.getState()` inside event handlers when reading current state from a callback to avoid stale closure behavior.

## Summary streaming
- Implemented `hooks/useSummaryStream.ts` to consume SSE from `/api/tasks/:id/summary`.
- Added a `finishedRef` guard so clean stream closure after the final "Done" message does not incorrectly trigger an error state.

## Markdown sanitization
- Rendered AI-generated summary markdown with `react-markdown`, `remark-gfm`, and `rehype-sanitize` to sanitize untrusted HTML.
- Added `skipHtml` to prevent inline raw HTML from being rendered at all.
- This makes the summary renderer safe against injected HTML, script tags, and malicious markup.

## Caching and stale state
- Used `localforage` in `lib/cache.ts` to persist the last fetched task page in IndexedDB.
- On load, the UI can show cached data immediately and mark it as stale until fresh backend data arrives.

## Submission artifacts
- Added `buggy/TaskTicker.tsx` as a required artifact representing the task feed ticker component.
- Added `DECISIONS.md` to document the main implementation choices, security reasoning, and state design.
