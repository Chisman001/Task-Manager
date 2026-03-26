# Task Manager

A full-stack task management web app built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Authentication** — Secure login via Supabase Auth with middleware-protected routes
- **Dashboard** — Personalised greeting, live task counts, upcoming reminders (within 24h), and a recent tasks strip
- **Task Management** — Create, edit, delete, and move tasks between statuses
- **Status Views** — Dedicated pages for To-Do, In Progress, and Done tasks
- **Search** — Client-side search across all tasks from the dashboard
- **Reminders** — Optional reminder date/time per task, surfaced on the dashboard when due within 24h
- **Due Dates** — Optional due date per task
- **Settings** — Update display name and avatar

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, React Server Components) |
| Language | TypeScript |
| Database & Auth | Supabase (PostgreSQL + Supabase Auth) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui, Radix UI, Base UI |
| Icons | Lucide React |
| Deployment | Vercel (recommended) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

1. Clone the repo and install dependencies:

   ```bash
   cd task-manager-app
   npm install
   ```

2. Create a `.env.local` file in `task-manager-app/`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
task-manager-app/
├── app/
│   ├── (auth)/login/        # Login page
│   └── (dashboard)/         # Protected dashboard routes
│       ├── page.tsx          # Dashboard home
│       ├── tasks/            # All tasks
│       ├── todo/             # To-Do tasks
│       ├── progress/         # In-Progress tasks
│       ├── done/             # Completed tasks
│       └── settings/         # User settings
├── components/               # Reusable UI components
├── lib/
│   ├── actions/              # Server actions (tasks, auth, profile)
│   └── supabase/             # Supabase client helpers
└── middleware.ts             # Auth route protection
```
