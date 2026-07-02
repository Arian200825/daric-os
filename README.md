# Daric OS

The internal operating system for the Daric agency — the foundation that manages
**leads, clients, projects, proposals, content, forms**, and business operations.

Production-quality MVP with **scalable, feature-based architecture**. Runs on
seed data out of the box (no setup) and is wired to swap to Supabase/PostgreSQL
with a single file change.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Zod ·
Supabase (data layer).

## Pages

| Route | Feature | What it does |
| ----- | ------- | ------------ |
| `/` | **Dashboard** | Metrics (leads, active projects, pending proposals, revenue), recent-activity feed, lead pipeline |
| `/crm` | **CRM** | Lead management — table, search, status filter, add-lead + detail drawers, pipeline statuses |
| `/projects` | **Projects** | Project cards with client, progress, deadline, status, tasks |
| `/proposals` | **Proposals** | Proposal records + create form with line items; document preview (PDF-export-ready model) |
| `/inbox` | **Inbox** | Unified enquiry feed — agency, restaurant, hotel & medical forms all land here |
| `/cms` | **CMS** | The typed content-model registry that future editors will be generated from (no editors yet) |
| `/settings` | **Settings** | Business info, brand, integrations, preferences |

## Architecture

**Feature-based** — each area owns its UI + logic; shared primitives live in
`components/`.

```
src/
  app/                 # thin route pages → feature views
  features/
    dashboard/  crm/  projects/  proposals/  inbox/  cms/  settings/
  components/
    ui/                # Button, Card, Badge, StatCard, Field, Drawer, ProgressBar…
    layout/            # AppShell (rail + mobile drawer), Sidebar
  lib/
    models/            # ⭐ Zod schemas + enums + CMS registry (typed data model)
    db.ts              # ⭐ the ONLY data-access point (seed today, Supabase tomorrow)
    supabase.ts        # client (graceful — null without keys)
    utils.ts  nav.ts
  data/seed.ts         # realistic placeholder records
```

### Typed models (Zod)
Every entity (`Lead`, `Project`, `Proposal`, `InboxMessage`) is a Zod schema in
`lib/models`; types are **inferred** from the schemas (single source of truth),
and the same schemas validate form input. Statuses, industries, and form sources
are enums with display labels + badge tones.

### Data layer — swap seed → Supabase in one file
The app only reads data through `lib/db.ts`, which returns seed data today. To go
live: run `supabase/schema.sql`, add `NEXT_PUBLIC_SUPABASE_*` to `.env.local`, and
implement each `db.*` method against Supabase (the client is ready in
`lib/supabase.ts`). Nothing else in the app changes.

### CMS foundation (architecture, not editors)
`lib/models/cms.ts` declares each industry's content collections + typed fields.
The `/cms` page renders this registry. Future visual editors are generated from
these field definitions — adding an industry never means bespoke CMS code.

### Proposals → PDF (future-ready)
Proposals store structured line items + totals (`proposalTotal()`), so a PDF
export is a rendering step over existing data — no schema changes needed.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export (seed data) → out/
```

## Notes
- The deployed demo is a **static export on seed data** (no auth, no DB) — a
  showcase. A real internal deployment would add Supabase (data + auth) and run
  as a server app.
- Responsive (desktop rail + mobile drawer), accessible (labels, focus rings,
  dialog semantics), and fast.
