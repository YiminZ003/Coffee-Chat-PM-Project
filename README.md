# Coffee Chats ☕ — U of T networking prototype

A polished, end-to-end Next.js prototype that helps University of Toronto students and alumni figure out **who to reach out to and what to say**.

## What's inside

| Route | Feature |
| --- | --- |
| `/` | Responsive landing page, value proposition, how it works |
| `/login` | U of T email magic-link login (when Supabase is configured) + transparent demo |
| `/onboarding` | Profile setup: type, program, year, industry, role, interests, goal, visibility |
| `/people` | Profiles open to chats, search, industry/program/year filters, alumni/student tabs, class-year sort |
| `/people/[id]` | Profile details, match reason, message, four open-ended questions, copy button |
| `/me` | Edit your profile and the “open to coffee chats” toggle |
| `/api/generate` | Server-side OpenAI-compatible model call; deterministic labeled template without a configured key |
| `/auth/callback` | Auth code exchange and university email validation |

**Demo mode:** 18 fictional, labeled profiles. No LinkedIn scraping, no use of real people without consent, no pretend “live alumni” contacts. Demo profile stored **only in the browser**. AI in demo mode returns clearly labeled **template suggestions**, never pretends a model ran. Demo does not schedule or contact a person.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Click **Get started → Explore the interactive demo**. You can complete onboarding, explore profiles, filter, open details, and generate template messages without any external services.

> These source files are based on the current public GitHub repository's Next.js 16/React 19 stack. They are an **independent full-app package**, not an automatically merged pull request. Coordinate before replacing files teammates may have changed. If your team already made changes, merge specific components or create a new branch and pull request.

## Connect real Supabase authentication and data

1. In your team's existing Supabase project, run `supabase/schema.sql` in SQL Editor **after reviewing it**. This creates the profile table and row-level security (RLS) policies. If Cassie has already created a `profiles` table, **do not blindly run the SQL**. Compare schema and agree on one table definition first.
2. Optionally run `supabase/seed.sql` to add the 18 explicitly fictional sample profiles. These records do not claim to be real people and remain visible only to authenticated U of T accounts under the RLS rules.
3. Enable email OTP/magic links under **Supabase Authentication → Providers → Email**. Set Site URL to your deployed Vercel URL. Allow redirect URL `https://YOUR-APP.vercel.app/auth/callback` (and `http://localhost:3000/auth/callback` during development).
4. In `.env.local` locally and in Vercel project settings, set **only** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. These are public client-side parameters. Never put a service-role key in the frontend.
5. Set `NEXT_PUBLIC_ENABLE_DEMO=false` to disable the browser-only demo in your live authenticated release. For user interviews you may keep the demo enabled and explain the fictional data to interviewees.
6. Check that a valid `utoronto.ca` email can get a link; non-U of T emails are rejected by the server's email-check endpoint, callback checks, and RLS. **The final access-control boundary is RLS**; the email-check endpoint alone is not a security boundary.

## Enable real AI messages

Set `LLM_API_KEY` in `.env.local` and **server-only** Vercel environment variables. `LLM_API_BASE_URL` defaults to `https://api.openai.com/v1`, and `LLM_MODEL` defaults to `gpt-4o-mini` (update according to the selected provider's current supported model). **Never prefix the key with `NEXT_PUBLIC_`**. The API request uses only the two profiles' relevant fields and no email addresses. With no key configured in real account mode, the server sends a transparent `mode: "template"` response; the UI labels this accordingly. In demo mode it always uses template output to avoid accidental external AI charges and sending fictional data to a provider.

For user interviews, tell participants when a model provider is being used and avoid entering sensitive information. If the model provider is incompatible with OpenAI Chat Completions JSON mode, adapt `lib/ai.ts` for that provider.

## QA and deploy

```bash
npm run lint
npm run typecheck
npm run build
```

Then push a **feature branch**, open a pull request, and have Mariana review it before merging. The team's existing Vercel connection should then deploy the new `main` branch automatically if configured for that repository.

**Manual test checklist:**

- Homepage loads on desktop and mobile.
- Demo: onboarding persists after refresh; `/me` can change visibility and interests.
- Demo `/people` lists only fictional **open** profiles, with visible notice.
- Search matches name, role and interests; each filter, student/alumni tabs, class-year sort, reset/empty state work.
- Profile links open correctly and the Generate button shows a match reason, message and questions.
- Copy button copies the message; API error states are handled.
- Real: unauthenticated visitors cannot browse real records; non-U of T accounts can't read or write profiles.
- Real: profile owner can edit their record and toggle visibility; no one can modify anyone else's record.
- Run an interview with a real participant and record real findings.

## Team responsibilities from project plan

- Mariana: repository/deployment, authentication, submission.
- Cassie: profile schema, onboarding, edit profile, RLS; interviews with Eason.
- Eason: discovery and profile detail interface; interviews with Cassie.
- Sam: LLM API route/prompts and prompt testing.
- Jack: 15–20 fictional profiles, end-to-end testing, human-written LinkedIn post.

This package combines these features into an integrated prototype, but actual Supabase configuration, API credentials, live deployment, and real interviews still require the team's work. It is **not** automatically published to your GitHub/Vercel project.

## Source instructions

The scope comes from the team PDF: profile fields, restricted login, 15–20 fictional sample profiles, filters, class-year sorting, AI-generated match reasons/messages/questions, visibility security and interviews. The course deliverables are **a live app, interview findings, and a human-written LinkedIn article** due November 13, 2026. See `docs/interview-guide.md` for the user research template (no invented interview results).
