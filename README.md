This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

- **NEXT_PUBLIC_SUPABASE_URL** / **NEXT_PUBLIC_SUPABASE_ANON_KEY** — from [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api). Required for auth and data (profiles, applications, saved jobs).
- **ONEWAVE_API_URL** (optional) — base URL of the Onewave FastAPI service (e.g. `http://localhost:8000`). Used by Next API routes `POST /api/resume/analyze` and `POST /api/coffee-chat` to proxy resume analysis and coffee-chat generation. Omit if you don’t use those features.

### Supabase database

Run the initial schema once. See [supabase/README.md](supabase/README.md): open Supabase Dashboard → SQL Editor, run `supabase/migrations/20260207000001_initial_schema.sql`.

### Running with Onewave (optional)

To use resume analysis and coffee-chat from Careermap:

1. From repo root, start the Onewave backend: `cd onewave-hackathon && pip install -r requirements.txt && python main.py` (or `uvicorn main:app --reload --port 8000`). Set `GEMINI_API_KEY` and `SERPAPI_KEY` in `onewave-hackathon/.env`.
2. In Careermap `.env.local`, set `ONEWAVE_API_URL=http://localhost:8000`.
3. Start Careermap: `cd careermap && npm run dev`. The app will call `/api/resume/analyze` and `/api/coffee-chat`, which proxy to Onewave.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Production backend (Onewave on Render)

If your frontend is deployed on Vercel (e.g. **https://jobru.vercel.app**) and the Onewave API is on Render (**https://onewave-hackathon.onrender.com**):

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your project (e.g. jobru).
2. Go to **Settings** → **Environment Variables**.
3. Add:
   - **Name:** `ONEWAVE_API_URL`
   - **Value:** `https://onewave-hackathon.onrender.com`
   - **Environment:** Production (and Preview if you want preview deploys to use it too).
4. Save and **redeploy** the project (Deployments → ⋮ on latest → Redeploy) so the new variable is picked up.

After redeploy, the app will use the production backend for auth, resume analysis, and coffee-chat.
