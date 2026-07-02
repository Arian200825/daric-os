"use client";

import { useState } from "react";
import { FileText, Receipt, HeartHandshake, Rocket, Check, ArrowRight, type LucideIcon } from "lucide-react";
import { BUSINESS_TEMPLATES, type BusinessTemplate } from "@/lib/templates";
import { formatMoney } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";

const META: Record<string, { icon: LucideIcon; kind: string }> = {
  proposal: { icon: FileText, kind: "Document" },
  invoice: { icon: Receipt, kind: "Document" },
  welcome: { icon: HeartHandshake, kind: "Checklist" },
  kickoff: { icon: Rocket, kind: "Checklist" },
};

export function TemplatesView() {
  const [selected, setSelected] = useState<BusinessTemplate | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Templates" description="Reusable documents and checklists for running the agency." />

      <div className="grid gap-5 sm:grid-cols-2">
        {BUSINESS_TEMPLATES.map((t) => {
          const Icon = META[t.key].icon;
          return (
            <Card key={t.key} className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <Badge tone="neutral">{META[t.key].kind}</Badge>
              </div>
              <div>
                <h2 className="font-display text-base font-semibold">{t.title}</h2>
                <p className="mt-1 text-sm text-muted">{t.description}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-auto self-start" onClick={() => setSelected(t)}>
                Preview <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          );
        })}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.title ?? "Template"}>
        {selected && <TemplatePreview template={selected} />}
      </Drawer>
    </div>
  );
}

function TemplatePreview({ template: t }: { template: BusinessTemplate }) {
  if (t.key === "proposal") {
    const total = t.defaultItems.reduce((s, i) => s + i.unitPrice, 0);
    return (
      <div className="flex flex-col gap-5 text-sm">
        <p className="leading-relaxed text-muted">{t.intro}</p>
        {t.sections.map((s) => (
          <div key={s.heading}>
            <h3 className="font-display font-semibold">{s.heading}</h3>
            <p className="mt-1 leading-relaxed text-muted">{s.body}</p>
          </div>
        ))}
        <ItemsTable items={t.defaultItems} total={total} />
        <Terms terms={t.terms} />
        <UseHint href="/proposals" label="Create a proposal from this" />
      </div>
    );
  }
  if (t.key === "invoice") {
    const total = t.defaultItems.reduce((s, i) => s + i.unitPrice, 0);
    return (
      <div className="flex flex-col gap-5 text-sm">
        <div>
          <h3 className="font-display font-semibold">Fields</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {t.fields.map((f) => <li key={f} className="rounded border border-border px-2 py-0.5 text-xs text-muted">{f}</li>)}
          </ul>
        </div>
        <ItemsTable items={t.defaultItems} total={total} />
        <Terms terms={t.terms} />
        <p className="rounded-lg border border-border bg-background p-3 text-xs text-muted">{t.notes}</p>
      </div>
    );
  }
  // checklist
  return (
    <div className="flex flex-col gap-4 text-sm">
      <p className="text-muted">{t.description}</p>
      <ul className="flex flex-col gap-2">
        {t.items.map((item) => (
          <li key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-transparent">
              <Check className="h-3 w-3" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ItemsTable({ items, total }: { items: { description: string; unitPrice: number }[]; total: number }) {
  return (
    <div className="rounded-lg border border-border">
      <table className="w-full text-sm">
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-2">{it.description}</td>
              <td className="px-4 py-2 text-right font-mono text-xs">{formatMoney(it.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-background-subtle">
            <td className="px-4 py-2 font-semibold">Total</td>
            <td className="px-4 py-2 text-right font-mono font-semibold">{formatMoney(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Terms({ terms }: { terms: string[] }) {
  return (
    <div>
      <h3 className="font-display font-semibold">Terms</h3>
      <ul className="mt-2 flex flex-col gap-1.5">
        {terms.map((term) => <li key={term} className="flex gap-2 text-xs text-muted"><span className="text-accent">·</span>{term}</li>)}
      </ul>
    </div>
  );
}

function UseHint({ href, label }: { href: string; label: string }) {
  return (
    <Button href={href} variant="outline" size="sm" className="self-start">
      {label} <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
