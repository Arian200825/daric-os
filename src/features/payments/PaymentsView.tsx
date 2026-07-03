"use client";

import { useState } from "react";
import { Check, CreditCard, Wallet, Percent, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

/** Deposit workflow — how a won proposal becomes a paid, started project. */
const DEPOSIT_FLOW = [
  { step: "1", title: "Proposal accepted", body: "Client approves scope and price in a proposal." },
  { step: "2", title: "Deposit invoice", body: "A deposit invoice is issued for the configured percentage." },
  { step: "3", title: "Deposit paid", body: "Client pays via Stripe, PayPal, or a Wise transfer." },
  { step: "4", title: "Project starts", body: "Payment confirmed → the project moves to In Progress." },
];

const PROVIDERS = [
  {
    name: "Stripe",
    blurb: "Cards, subscriptions, and hosted invoices. Best for automated deposits.",
    field: { label: "Publishable key", id: "pk-stripe", placeholder: "pk_live_…" },
    secret: "STRIPE_SECRET_KEY",
  },
  {
    name: "PayPal",
    blurb: "Familiar, fast checkout your clients already trust.",
    field: { label: "Client ID", id: "pp-client", placeholder: "AXx…" },
    secret: "PAYPAL_SECRET",
  },
  {
    name: "Wise",
    blurb: "Low-fee international transfers — ideal for cross-border clients.",
    field: { label: "Payment link", id: "wise-link", placeholder: "https://wise.com/pay/…" },
    secret: "WISE_API_TOKEN",
  },
];

export function PaymentsView() {
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payments"
        description="Configure deposits and payment providers. Architecture only — no payments are processed yet."
        actions={
          <Button size="sm" onClick={save}>
            {saved ? (<><Check className="h-4 w-4" /> Saved</>) : "Save changes"}
          </Button>
        }
      />

      {/* Deposit settings */}
      <Card>
        <CardHeader
          title={<span className="flex items-center gap-2"><Percent className="h-4 w-4 text-accent" /> Deposit settings</span>}
          action={<Badge tone="neutral">Not processing yet</Badge>}
        />
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <Field label="Default deposit (%)" htmlFor="dep-pct"><Input id="dep-pct" type="number" defaultValue="50" /></Field>
          <Field label="Minimum deposit" htmlFor="dep-min"><Input id="dep-min" defaultValue="500" /></Field>
          <Field label="Currency" htmlFor="dep-cur"><Input id="dep-cur" defaultValue="USD" /></Field>
        </div>
        <div className="border-t border-border px-5 py-4">
          <p className="text-xs text-muted">
            The deposit is collected before a project starts; the remaining balance is invoiced on delivery.
            Change these defaults per proposal.
          </p>
        </div>
      </Card>

      {/* Deposit workflow */}
      <Card>
        <CardHeader title={<span className="flex items-center gap-2"><Wallet className="h-4 w-4 text-accent" /> Deposit workflow</span>} />
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEPOSIT_FLOW.map((s) => (
            <div key={s.step} className="rounded-lg border border-border bg-background p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">{s.step}</span>
              <p className="mt-3 text-sm font-semibold">{s.title}</p>
              <p className="mt-1 text-xs text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Providers */}
      <Card>
        <CardHeader
          title={<span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-accent" /> Payment providers</span>}
          action={<Badge tone="neutral">Architecture ready</Badge>}
        />
        <div className="flex flex-col gap-5 p-5">
          <p className="text-sm text-muted">
            Enable one or more providers. Publishable identifiers live here; secret keys are read from
            server-side environment variables only and never stored in the app.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {PROVIDERS.map((p) => (
              <div key={p.name} className="rounded-lg border border-border bg-background p-4">
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="mt-1 text-xs text-muted">{p.blurb}</p>
                <div className="mt-3 flex flex-col gap-3">
                  <Field label={p.field.label} htmlFor={p.field.id}><Input id={p.field.id} placeholder={p.field.placeholder} /></Field>
                  <p className="text-[11px] text-muted">Secret via <code>{p.secret}</code> (server).</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-border bg-background px-4 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-xs text-muted">
              No card data ever touches Daric OS — providers host their own secure checkout. This screen
              configures the connection only.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
