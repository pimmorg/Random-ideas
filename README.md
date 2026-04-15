# SkySchool — Student Pilot Study Platform

A structured, gamified study platform for student pilots across multiple certifications and ratings. Think Duolingo meets ground school, covering Private Pilot through ATP.

## Features

- **Progressive disclosure** — students only see content relevant to their current training stage
- **Multi-track course structure** — PPL, Instrument Rating, Commercial, Multi-Engine, CFI, ATP
- **AI Tutor** — streaming chat powered by Claude (claude-sonnet-4-5), context-aware, aviation-accurate
- **Gamified progress** — XP, streaks, bronze/silver/gold mastery, achievements
- **Quiz bank** — FAA-style multiple choice with spaced repetition
- **Journey map** — visual roadmap of the full pilot certification path
- **Dark mode** — full dark/light support

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Prisma ORM + SQLite (local) / PostgreSQL (production)
- **Auth:** NextAuth v5 (Credentials + Google OAuth)
- **AI:** Anthropic Claude API (`claude-sonnet-4-5`) via streaming SSE
- **Animation:** Framer Motion

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### 1. Clone and install

```bash
git clone <repo>
cd skyschool
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, from Google Cloud Console

### 3. Set up the database

```bash
# Run migrations
npx prisma migrate dev

# Seed with course content (tracks, lessons, questions, achievements)
npm run db:seed
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Commands

```bash
npx prisma migrate dev        # Run migrations
npx prisma generate           # Regenerate client
npx prisma studio             # Open DB GUI
npm run db:seed               # Seed course content
```

## Project Structure

```
app/
  (auth)/         # Login + Register pages
  (app)/          # Protected app pages (dashboard, lesson, quiz, etc.)
  (onboarding)/   # Onboarding wizard
  api/            # Route handlers (auth, chat, quiz, lessons, etc.)
components/
  app/            # AppNav
  chat/           # AI tutor chat panel
  dashboard/      # Dashboard + skill tree
  lesson/         # Lesson view
  quiz/           # Quiz interface
  onboarding/     # Onboarding wizard
  journey/        # Journey map
  progress/       # Progress stats
  achievements/   # Achievements gallery
  profile/        # Profile & settings
  ui/             # shadcn/ui components
lib/
  db.ts           # Prisma singleton
  actions/        # Server actions
  types.ts        # Shared TypeScript types
  generated/      # Prisma generated client
prisma/
  schema.prisma   # Database schema
  seed.ts         # Course content seed
```

## Onboarding Flow

1. **Stage selection** — "Where are you in your training?" (PPL / IR / CPL / etc.)
2. **Follow-up** — 1–2 context questions based on stage
3. **Daily goal** — 5 / 10 / 15 / 30 minutes per day
4. **Launch** — dropped directly into first lesson

## Progressive Disclosure

Features unlock as the student progresses:

| Trigger | Unlocks |
|---------|---------|
| First lesson completed | Bookmarks, Progress stats |
| 5 lessons completed | Achievements page |
| 50% of track | Weak areas review |
| 75% of track | Next track preview |
| Track completed | Multi-track UI, Journey map |

## Disclaimer

SkySchool is a study aid only. It does **not** satisfy FAA training requirements and does **not** replace a certified flight instructor (CFI/CFII). Always train with a qualified instructor for actual flight operations.

## Production Deployment

For production, switch to PostgreSQL:

1. Update `.env`: `DATABASE_URL="postgresql://user:password@host:5432/skyschool"`
2. Update `prisma/schema.prisma` datasource provider to `"postgresql"`
3. Run `npx prisma migrate deploy && npm run db:seed`
4. Run `npm run build && npm start`
