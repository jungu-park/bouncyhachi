# Directive 00: API & Security Standards

## 1. Goal
Define strict protocols for calling external APIs, handling sensitive data, and managing errors gracefully without crashing the app.

## 2. Security First
- **Environment Variables:** ALL API keys, secret tokens, and database credentials MUST be read from the `.env` file or secure environment variables. Never hardcode keys in `.js` or `.py` files.
- **CORS & Proxy:** If encountering CORS errors on the frontend, handle requests via a backend proxy or serverless function (e.g., Cloudflare Workers).

## 3. Error Handling & Rate Limiting
- **Try-Catch:** Wrap every asynchronous API call in a `try-catch` block.
- **Graceful Degradation:** If an external API fails (e.g., 404 or 500 error), do NOT show a blank screen or raw error text to the user. Show a friendly fallback UI (e.g., "Data temporarily unavailable").
- **Retry Logic:** For rate limits (HTTP 429), implement an exponential backoff retry system before throwing a final error.