"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus, Search, UserPlus, Globe, Mail, Phone, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import {
  LEAD_STATUSES, LEAD_STATUS_META, INDUSTRIES, INDUSTRY_META,
  NewLeadSchema, type Lead, type LeadStatus,
} from "@/lib/models";
import { NOW } from "@/data/seed";
import { formatMoney } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, Input, Select, Textarea, Label } from "@/components/ui/Field";

export function CrmView() {
  const [leads, setLeads] = useState<Lead[]>(() => db.leads());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      return `${l.company} ${l.contact} ${l.email} ${l.country}`.toLowerCase().includes(q);
    });
  }, [leads, query, statusFilter]);

  function updateStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  }

  function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = NewLeadSchema.safeParse({ ...data, value: Number(data.value) || 0 });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    const lead: Lead = { ...parsed.data, id: `l${Date.now()}`, createdAt: NOW };
    setLeads((prev) => [lead, ...prev]);
    setCreating(false);
    setFormError("");
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="CRM"
        description="Manage leads through the sales pipeline."
        actions={<Button size="sm" onClick={() => { setFormError(""); setCreating(true); }}><Plus className="h-4 w-4" /> New lead</Button>}
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, contact, email…" className="pl-9" aria-label="Search leads" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | LeadStatus)} className="sm:w-52" aria-label="Filter by status">
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_META[s].label}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={UserPlus} title="No leads found" hint="Try a different search or add a new lead." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Country</th>
                  <th className="px-5 py-3 font-medium">Value</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} onClick={() => setSelected(l)} className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-background-subtle">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={l.contact} />
                        <div>
                          <p className="font-medium">{l.company}</p>
                          <p className="text-xs text-muted">{INDUSTRY_META[l.industry].label}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p>{l.contact}</p>
                      <p className="text-xs text-muted">{l.email}</p>
                    </td>
                    <td className="px-5 py-3 text-muted">{l.country || "—"}</td>
                    <td className="px-5 py-3 font-mono text-xs">{l.value ? formatMoney(l.value) : "—"}</td>
                    <td className="px-5 py-3"><Badge tone={LEAD_STATUS_META[l.status].tone}>{LEAD_STATUS_META[l.status].label}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Lead detail */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.company ?? "Lead"}>
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Avatar name={selected.contact} className="h-11 w-11 text-sm" />
              <div>
                <p className="font-semibold">{selected.contact}</p>
                <p className="text-xs text-muted">{INDUSTRY_META[selected.industry].label} lead</p>
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value as LeadStatus)}>
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_META[s].label}</option>)}
              </Select>
            </div>

            <dl className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4 text-sm">
              <DetailRow icon={Mail} label="Email"><a href={`mailto:${selected.email}`} className="hover:text-accent">{selected.email}</a></DetailRow>
              {selected.phone && <DetailRow icon={Phone} label="Phone">{selected.phone}</DetailRow>}
              {selected.website && <DetailRow icon={Globe} label="Website">{selected.website}</DetailRow>}
              {selected.country && <DetailRow icon={MapPin} label="Country">{selected.country}</DetailRow>}
              <DetailRow icon={UserPlus} label="Value">{selected.value ? formatMoney(selected.value) : "—"}</DetailRow>
            </dl>

            {selected.notes && (
              <div>
                <Label>Notes</Label>
                <p className="rounded-lg border border-border bg-background p-4 text-sm text-muted">{selected.notes}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* New lead */}
      <Drawer open={creating} onClose={() => setCreating(false)} title="New lead">
        <form onSubmit={onCreate} className="flex flex-col gap-4">
          <Field label="Company" htmlFor="company"><Input id="company" name="company" required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Industry" htmlFor="industry">
              <Select id="industry" name="industry" defaultValue="restaurant">
                {INDUSTRIES.map((i) => <option key={i} value={i}>{INDUSTRY_META[i].label}</option>)}
              </Select>
            </Field>
            <Field label="Status" htmlFor="status">
              <Select id="status" name="status" defaultValue="new">
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_META[s].label}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Contact name" htmlFor="contact"><Input id="contact" name="contact" required /></Field>
          <Field label="Email" htmlFor="email"><Input id="email" name="email" type="email" required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone" htmlFor="phone"><Input id="phone" name="phone" /></Field>
            <Field label="Country" htmlFor="country"><Input id="country" name="country" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Website" htmlFor="website"><Input id="website" name="website" /></Field>
            <Field label="Est. value ($)" htmlFor="value"><Input id="value" name="value" type="number" min={0} defaultValue={0} /></Field>
          </div>
          <Field label="Notes" htmlFor="notes"><Textarea id="notes" name="notes" rows={3} /></Field>
          {formError && <p className="text-xs text-red-600">{formError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
            <Button type="submit">Add lead</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

function DetailRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-muted"><Icon className="h-4 w-4" /> {label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
