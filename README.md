# Sabill VidGen (Hailuo Studio - Vercel-ready)

This repository is a Vercel-ready Next.js app that lets you generate videos via Hailuo AI.
It is configured with a simple password protection (see `.env.example` for `APP_PASSWORD`).

## Quick start (local)
1. Copy `.env.example` to `.env.local` and fill `HAILUO_API_KEY` (and optionally HAILUO_ENDPOINT).
2. `npm install`
3. `npm run dev`
4. Visit http://localhost:3000

## Deploy to Vercel
1. Push this repository to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. In Vercel Project Settings -> Environment Variables, add:
   - `HAILUO_API_KEY` = your Hailuo API key
   - `HAILUO_ENDPOINT` = https://api.hailuoai.video/v1
   - `APP_PASSWORD` = amimah00
4. Deploy.

## Notes
- The app proxies Hailuo requests through server-side API routes so the API key is never exposed to the browser.
- If Hailuo's API field names differ, adjust `pages/api/hailuo/*` accordingly.
"# sabill-vidgen" 
