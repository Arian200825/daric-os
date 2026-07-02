"use client";

import { useMemo, useState } from "react";
import { Inbox as InboxIcon, Mail, Reply } from "lucide-react";
import { db } from "@/lib/db";
import { FORM_SOURCES, FORM_SOURCE_META, type FormSource, type InboxMessage } from "@/lib/models";
import { NOW } from "@/data/seed";
import { relativeDay, cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";

export function InboxView() {
  const [messages, setMessages] = useState<InboxMessage[]>(() => db.inbox());
  const [source, setSource] = useState<"all" | FormSource>("all");
  const [selected, setSelected] = useState<InboxMessage | null>(null);

  const filtered = useMemo(
    () => messages.filter((m) => source === "all" || m.source === source),
    [messages, source]
  );

  function open(m: InboxMessage) {
    setSelected(m);
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
  }

  const unreadFor = (s: FormSource) => messages.filter((m) => m.source === s && !m.read).length;
  const totalUnread = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inbox"
        description="Every enquiry from every Daric site — agency, restaurant, hotel, and medical — in one feed."
      />

      {/* Source tabs */}
      <div className="flex flex-wrap gap-2">
        <SourceTab active={source === "all"} onClick={() => setSource("all")} label="All" count={totalUnread} />
        {FORM_SOURCES.map((s) => (
          <SourceTab key={s} active={source === s} onClick={() => setSource(s)} label={FORM_SOURCE_META[s].label} count={unreadFor(s)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={InboxIcon} title="No messages" hint="Enquiries from your live sites will appear here." />
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          {filtered.map((m) => (
            <button key={m.id} onClick={() => open(m)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-background-subtle">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", m.read ? "bg-transparent" : "bg-accent")} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className={cn("truncate text-sm", m.read ? "font-normal" : "font-semibold")}>{m.name}</span>
                  <Badge tone={FORM_SOURCE_META[m.source].tone}>{FORM_SOURCE_META[m.source].label}</Badge>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted">{m.subject ? `${m.subject} — ` : ""}{m.message}</span>
              </span>
              <span className="shrink-0 text-xs text-muted">{relativeDay(m.createdAt, NOW)}</span>
            </button>
          ))}
        </Card>
      )}

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.subject || "Message"}>
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{selected.name}</p>
                <p className="text-xs text-muted">{selected.email}</p>
              </div>
              <Badge tone={FORM_SOURCE_META[selected.source].tone}>{FORM_SOURCE_META[selected.source].label}</Badge>
            </div>
            <p className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed">{selected.message}</p>
            <div className="flex gap-2">
              <Button href={`mailto:${selected.email}`}><Reply className="h-4 w-4" /> Reply</Button>
              <Button variant="outline" href="/crm"><Mail className="h-4 w-4" /> Add to CRM</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function SourceTab({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
        active ? "border-foreground bg-foreground text-background" : "border-border bg-surface text-muted hover:text-foreground"
      )}
    >
      {label}
      {count > 0 && <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", active ? "bg-background/20" : "bg-accent-soft text-accent")}>{count}</span>}
    </button>
  );
}
