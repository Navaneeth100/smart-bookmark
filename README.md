Smart Bookmark App 🔖

A simple bookmark manager built with Next.js + Supabase.

Users can log in with Google, add bookmarks, and see updates instantly across tabs.

Features

- Google OAuth login

- Add & delete bookmarks

- Private per user (RLS security)

- Realtime updates (no refresh)

- Protected dashboard

Tech Stack

Next.js · React · Supabase Auth · Postgres · Realtime · Tailwind · Vercel

Run Locally

Create .env.local

NEXT_PUBLIC_SUPABASE_URL=(https://vggvzyxlnljvcmkqerlv.supabase.co)

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ3Z6eXhsbmxqdmNta3Flcmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjQ2MjAsImV4cCI6MjA4NjgwMDYyMH0.oOFl-tBison0IdkaGSIJLT0NbRMcf_pLHbKEcAD_GmM

Install & run:

npm install
npm run dev


Author

Navaneeth K P