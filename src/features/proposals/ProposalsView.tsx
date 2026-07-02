"use client";

import { useState } from "react";
import { Plus, Trash2, FileDown } from "lucide-react";
import { db } from "@/lib/db";
import {
  PROPOSAL_STATUSES, PROPOSAL_STATUS_META, proposalTotal,
  NewProposalSchema, type Proposal, type LineItem, type ProposalStatus,
} from "@/lib/models";
import { NOW } from "@/data/seed";
import { formatMoney, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Field, Input, Select, Label } from "@/components/ui/Field";

function nextNumber(proposals: Proposal[]): string {
  const max = proposals.reduce((m, p) => Math.max(m, Number(p.number.replace(/\D/g, "")) || 0), 0);
  return `PRO-${String(max + 1).padStart(4, "0")}`;
}

export function ProposalsView() {
  const [proposals, setProposals] = useState<Proposal[]>(() => db.proposals());
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [creating, setCreating] = useState(false);

  // Create-form state
  const [client, setClient] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<ProposalStatus>("draft");
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: 1, unitPrice: 0 }]);
  const [error, setError] = useState("");

  function resetForm() {
    setClient(""); setTitle(""); setStatus("draft"); setItems([{ description: "", quantity: 1, unitPrice: 0 }]); setError("");
  }

  function setItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function submit() {
    const parsed = NewProposalSchema.safeParse({ client, title, status, currency: "USD", items });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please complete the form.");
      return;
    }
    const proposal: Proposal = { ...parsed.data, id: `pr${Date.now()}`, number: nextNumber(proposals), createdAt: NOW };
    setProposals((prev) => [proposal, ...prev]);
    setCreating(false);
    resetForm();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Proposals"
        description="Draft and track client proposals."
        actions={<Button size="sm" onClick={() => { resetForm(); setCreating(true); }}><Plus className="h-4 w-4" /> New proposal</Button>}
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Number</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.id} onClick={() => setSelected(p)} className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-background-subtle">
                  <td className="px-5 py-3 font-mono text-xs">{p.number}</td>
                  <td className="px-5 py-3 font-medium">{p.client}</td>
                  <td className="px-5 py-3 text-muted">{p.title}</td>
                  <td className="px-5 py-3 font-mono text-xs">{formatMoney(proposalTotal(p), p.currency)}</td>
                  <td className="px-5 py-3"><Badge tone={PROPOSAL_STATUS_META[p.status].tone}>{PROPOSAL_STATUS_META[p.status].label}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Proposal document preview (PDF-ready structure) */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.number ?? "Proposal"}>
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-lg font-semibold">{selected.title}</p>
                <p className="text-sm text-muted">{selected.client}</p>
              </div>
              <Badge tone={PROPOSAL_STATUS_META[selected.status].tone}>{PROPOSAL_STATUS_META[selected.status].label}</Badge>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>{selected.number}</span>
              <span>{formatDate(selected.createdAt)}</span>
            </div>

            <div className="rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="px-4 py-2 font-medium">Item</th>
                    <th className="px-4 py-2 text-center font-medium">Qty</th>
                    <th className="px-4 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.items.map((it, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-2">{it.description}</td>
                      <td className="px-4 py-2 text-center font-mono text-xs">{it.quantity}</td>
                      <td className="px-4 py-2 text-right font-mono text-xs">{formatMoney(it.quantity * it.unitPrice, selected.currency)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-background-subtle">
                    <td className="px-4 py-2 font-semibold" colSpan={2}>Total</td>
                    <td className="px-4 py-2 text-right font-mono font-semibold">{formatMoney(proposalTotal(selected), selected.currency)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <Button variant="outline" title="PDF export is on the roadmap — line items + totals are structured for it" disabled>
              <FileDown className="h-4 w-4" /> Export PDF (coming soon)
            </Button>
          </div>
        )}
      </Drawer>

      {/* Create proposal */}
      <Drawer open={creating} onClose={() => setCreating(false)} title="New proposal">
        <div className="flex flex-col gap-4">
          <Field label="Client" htmlFor="p-client"><Input id="p-client" value={client} onChange={(e) => setClient(e.target.value)} /></Field>
          <Field label="Title" htmlFor="p-title"><Input id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Restaurant website" /></Field>
          <Field label="Status" htmlFor="p-status">
            <Select id="p-status" value={status} onChange={(e) => setStatus(e.target.value as ProposalStatus)}>
              {PROPOSAL_STATUSES.map((s) => <option key={s} value={s}>{PROPOSAL_STATUS_META[s].label}</option>)}
            </Select>
          </Field>

          <div>
            <Label>Line items</Label>
            <div className="flex flex-col gap-2">
              {items.map((it, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input aria-label="Description" value={it.description} onChange={(e) => setItem(i, { description: e.target.value })} placeholder="Description" className="flex-1" />
                  <Input aria-label="Quantity" type="number" min={1} value={it.quantity} onChange={(e) => setItem(i, { quantity: Number(e.target.value) || 1 })} className="w-16" />
                  <Input aria-label="Unit price" type="number" min={0} value={it.unitPrice} onChange={(e) => setItem(i, { unitPrice: Number(e.target.value) || 0 })} className="w-24" />
                  <button type="button" aria-label="Remove item" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))} className="text-muted hover:text-red-600" disabled={items.length === 1}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setItems((p) => [...p, { description: "", quantity: 1, unitPrice: 0 }])} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
              <Plus className="h-3.5 w-3.5" /> Add item
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted">Total</span>
            <span className="font-mono font-semibold">{formatMoney(proposalTotal({ items }), "USD")}</span>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
            <Button type="button" onClick={submit}>Create proposal</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
