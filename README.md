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
| `/payments` | **Payments** | Deposit settings + provider config (Stripe, PayPal, Wise) + the deposit workflow — architecture only, no processing |
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

## Connecting the public sites (forms → CRM)

Every Daric site (agency, restaurant, hotel, medical) feeds enquiries into the
**unified Inbox**. Each site's form posts a source-tagged payload:

```json
{ "source": "restaurant", "name": "…", "email": "…", "subject": "…", "message": "…" }
```

- The demo forms already POST to a configurable endpoint (`config.*.endpoint`) and
  now tag their `source` (agency · restaurant · hotel · medical).
- Point each site's endpoint (set per source in **Settings → Integrations**) at the
  OS inbox (a Supabase `inbox_messages` insert or a serverless function) and every
  enquiry lands in the Inbox automatically.
- From there the workflow is: **Inbox → convert to Lead → Discovery → Proposal →
  Project → Launch** — visualized on the Dashboard (Sales workflow).

The `InboxMessage` model + `FormSource` enum in `lib/models` are the shared
contract both ends agree on.

## Payment setup (deposits)

The **Payments** page configures how clients pay a deposit before a project
starts. The architecture is prepared but **no payments are processed** until you
connect a provider:

- **Deposit settings** — default deposit %, minimum, and currency (per-proposal
  override).
- **Providers** — Stripe (cards/invoices), PayPal (checkout), Wise (transfers).
  Publishable identifiers live in the UI; **secret keys are read from server-side
  env vars only** (`STRIPE_SECRET_KEY`, `PAYPAL_SECRET`, `WISE_API_TOKEN`).
- **Deposit workflow** — proposal accepted → deposit invoice → deposit paid →
  project moves to *In Progress*.

No card data ever touches Daric OS — providers host their own secure checkout.

## Email setup

Transactional templates + a Resend sender live in `src/lib/email.ts` (proposal
sent, project started, project completed). Set `RESEND_API_KEY` and, optionally,
`EMAIL_FROM` / `CONTACT_EMAIL` (the from-address defaults to
`daricone.web@gmail.com`). Runs server-side; safely no-ops until a key is set.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export (seed data) → out/
```

## Environment variables

All optional — the OS runs on seed data with none set. See `.env.example`.

| Variable | Scope | Purpose |
| -------- | ----- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | public | Data layer (leads, projects, proposals, inbox) |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Privileged reads/writes in route handlers |
| `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_EMAIL` | server | Transactional email (`src/lib/email.ts`) |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | mixed | Stripe (Payments page) |
| `PAYPAL_SECRET`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | mixed | PayPal |
| `WISE_API_TOKEN` | server | Wise |
| `NEXT_PUBLIC_BASE_PATH` | build | GitHub Pages project path (e.g. `/daric-os`) |

**Security:** secret keys (`*_SECRET`, `RESEND_API_KEY`, service role) are used
**server-side only** — never prefixed `NEXT_PUBLIC_`, never shipped to the client.
Supabase tables use Row Level Security (`supabase/schema.sql`): anon may INSERT
enquiries; staff read/manage via authenticated policies. Rate limiting belongs at
the ingestion edge (serverless function / Supabase Edge Function) — see the inbox
integration notes.

## Deployment

- **Demo (current):** static export on seed data → GitHub Pages.
  `NEXT_PUBLIC_BASE_PATH=/daric-os npm run build`, publish `out/` to `gh-pages`.
- **Real internal tool:** deploy as a **server app** (Vercel/Node) with Supabase
  (data + auth) and the email/payment envs set. Add authentication before exposing
  real client data — the OS is an internal tool.

## Notes
- The deployed demo is a **static export on seed data** (no auth, no DB) — a
  showcase. A real internal deployment would add Supabase (data + auth) and run
  as a server app.
- Responsive (desktop rail + mobile drawer), accessible (labels, focus rings,
  dialog semantics), and fast.
