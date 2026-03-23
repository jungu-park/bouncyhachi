# Punishment Lesson: Hardcoding Local URLs

## Mistake
Generating image absolute URLs using `workerOrigin` or hardcoding `127.0.0.1:8787` in backend/worker scripts.

## Consequence
Blog post images break on the live environment because they attempt to fetch from the local structure instead of the proper public CDN or R2 URLs.

## Prevention Task
When setting absolute URLs for uploaded assets:
1. **Never** hardcode local development ports.
2. Prioritize lookup of `env.PUBLIC_URL` or `env.R2_PUBLIC_URL`.
3. Provide descriptive fallbacks but do not propagate local paths for production data.
