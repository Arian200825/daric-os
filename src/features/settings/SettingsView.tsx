"use client";

import { useState } from "react";
import { Check, Building2, Palette, Plug, SlidersHorizontal, CreditCard } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { FORM_SOURCES, FORM_SOURCE_META } from "@/lib/models";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export function SettingsView() {
  const [saved, setSaved] = useState(false);
  const supabase = isSupabaseConfigured();

  function save() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Business information, brand, and integrations."
        actions={<Button size="sm" onClick={save}>{saved ? (<><Check className="h-4 w-4" /> Saved</>) : "Save changes"}</Button>}
      />

      {/* Business */}
      <Card>
        <CardHeader title={<span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-accent" /> Business information</span>} />
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Agency name" htmlFor="s-name"><Input id="s-name" defaultValue="Daric" /></Field>
          <Field label="Contact email" htmlFor="s-email"><Input id="s-email" type="email" defaultValue="hello@daric.agency" /></Field>
          <Field label="Phone" htmlFor="s-phone"><Input id="s-phone" defaultValue="+1 (415) 555-0100" /></Field>
          <Field label="Default currency" htmlFor="s-currency"><Input id="s-currency" defaultValue="USD" /></Field>
        </div>
      </Card>

      {/* Brand */}
      <Card>
        <CardHeader title={<span className="flex items-center gap-2"><Palette className="h-4 w-4 text-accent" /> Brand</span>} />
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Brand name" htmlFor="s-brand"><Input id="s-brand" defaultValue="Daric" /></Field>
          <Field label="Accent color" htmlFor="s-accent">
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 shrink-0 rounded-lg border border-border bg-accent" aria-hidden />
              <Input id="s-accent" defaultValue="#a17c22" />
            </div>
          </Field>
        </div>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader
          title={<span className="flex items-center gap-2"><Plug className="h-4 w-4 text-accent" /> Integrations</span>}
          action={<Badge tone={supabase ? "green" : "neutral"}>{supabase ? "Supabase connected" : "Supabase: seed mode"}</Badge>}
        />
        <div className="flex flex-col gap-4 p-5">
          <p className="text-sm text-muted">
            Connect a Supabase project (env keys) to persist data. Point each site&apos;s contact/booking form at the
            inbox endpoint so every enquiry lands here automatically.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {FORM_SOURCES.map((s) => (
              <Field key={s} label={`${FORM_SOURCE_META[s].label} form endpoint`} htmlFor={`ep-${s}`}>
                <Input id={`ep-${s}`} placeholder="https://…/api/inbox" />
              </Field>
            ))}
          </div>
        </div>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader
          title={<span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-accent" /> Payments</span>}
          action={<Badge tone="neutral">Not processing yet</Badge>}
        />
        <div className="flex flex-col gap-5 p-5">
          <p className="text-sm text-muted">
            Configure how clients pay. Architecture is prepared for Stripe, PayPal, and Wise — no payments are
            processed until keys are added and processing is enabled. Secret keys are stored server-side only.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-semibold">Stripe</p>
              <p className="mt-1 text-xs text-muted">Cards, subscriptions, invoices.</p>
              <div className="mt-3 flex flex-col gap-3">
                <Field label="Publishable key" htmlFor="pk-stripe"><Input id="pk-stripe" placeholder="pk_live_…" /></Field>
                <p className="text-[11px] text-muted">Secret key via <code>STRIPE_SECRET_KEY</code> (server).</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-semibold">PayPal</p>
              <p className="mt-1 text-xs text-muted">Familiar, fast checkout.</p>
              <div className="mt-3 flex flex-col gap-3">
                <Field label="Client ID" htmlFor="pp-client"><Input id="pp-client" placeholder="AXx…" /></Field>
                <p className="text-[11px] text-muted">Secret via <code>PAYPAL_SECRET</code> (server).</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-semibold">Wise</p>
              <p className="mt-1 text-xs text-muted">Low-fee international transfers.</p>
              <div className="mt-3 flex flex-col gap-3">
                <Field label="Payment link" htmlFor="wise-link"><Input id="wise-link" placeholder="https://wise.com/pay/…" /></Field>
                <p className="text-[11px] text-muted">API token via <code>WISE_API_TOKEN</code> (server).</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader title={<span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-accent" /> Preferences</span>} />
        <div className="flex flex-col gap-3 p-5">
          {[
            { id: "pref-lead", label: "Email me when a new lead arrives", on: true },
            { id: "pref-weekly", label: "Weekly pipeline summary", on: true },
            { id: "pref-proposal", label: "Notify when a proposal is viewed", on: false },
          ].map((p) => (
            <label key={p.id} htmlFor={p.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3 text-sm">
              {p.label}
              <input id={p.id} type="checkbox" defaultChecked={p.on} className="h-4 w-4 accent-[var(--color-accent)]" />
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
