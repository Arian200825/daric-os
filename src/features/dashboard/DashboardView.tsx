import { Users, FolderKanban, FileText, DollarSign, Activity } from "lucide-react";
import { db } from "@/lib/db";
import { NOW } from "@/data/seed";
import { LEAD_STATUS_META, PROPOSAL_STATUS_META, type LeadStatus, type Tone } from "@/lib/models";
import { formatMoney, relativeDay } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function DashboardView() {
  const leads = db.leads();
  const projects = db.projects();
  const proposals = db.proposals();
  const messages = db.inbox();

  const activeProjects = projects.filter((p) => p.status !== "launched");
  const pendingProposals = proposals.filter((p) => p.status === "draft" || p.status === "sent");
  const wonRevenue = leads.filter((l) => l.status === "won").reduce((s, l) => s + l.value, 0);
  const pipelineValue = leads
    .filter((l) => l.status !== "won" && l.status !== "lost")
    .reduce((s, l) => s + l.value, 0);
  const unread = messages.filter((m) => !m.read).length;

  // Merged recent-activity feed.
  const activity = [
    ...leads.map((l) => ({ date: l.createdAt, text: `New lead — ${l.company}`, badge: LEAD_STATUS_META[l.status].label, tone: LEAD_STATUS_META[l.status].tone })),
    ...messages.map((m) => ({ date: m.createdAt, text: `Message from ${m.name}`, badge: m.read ? "Read" : "New", tone: (m.read ? "neutral" : "blue") as Tone })),
    ...proposals.map((p) => ({ date: p.createdAt, text: `Proposal ${p.number} — ${p.client}`, badge: PROPOSAL_STATUS_META[p.status].label, tone: PROPOSAL_STATUS_META[p.status].tone })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  // Lead pipeline distribution.
  const pipeline = (Object.keys(LEAD_STATUS_META) as LeadStatus[]).map((s) => ({
    status: s,
    count: leads.filter((l) => l.status === s).length,
  }));
  const maxCount = Math.max(1, ...pipeline.map((p) => p.count));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Your agency at a glance."
        actions={<Button href="/crm" size="sm">Go to CRM</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads" value={String(leads.length)} icon={Users} delta={{ value: "+2", positive: true }} hint="this week" />
        <StatCard label="Active Projects" value={String(activeProjects.length)} icon={FolderKanban} hint="in flight" />
        <StatCard label="Pending Proposals" value={String(pendingProposals.length)} icon={FileText} hint={`${proposals.length} total`} />
        <StatCard label="Revenue (won)" value={formatMoney(wonRevenue)} icon={DollarSign} hint={`${formatMoney(pipelineValue)} in pipeline`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recent activity" action={<Activity className="h-4 w-4 text-muted" />} />
          <ul className="divide-y divide-border">
            {activity.map((a, i) => (
              <li key={i} className="flex items-center justify-between gap-4 px-5 py-3">
                <span className="min-w-0 truncate text-sm">{a.text}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <Badge tone={a.tone}>{a.badge}</Badge>
                  <span className="w-20 text-right text-xs text-muted">{relativeDay(a.date, NOW)}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Pipeline */}
        <Card>
          <CardHeader title="Lead pipeline" action={<span className="text-xs text-muted">{unread} unread</span>} />
          <ul className="flex flex-col gap-3 p-5">
            {pipeline.map((p) => (
              <li key={p.status} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs text-muted">{LEAD_STATUS_META[p.status].label}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                </span>
                <span className="w-5 text-right font-mono text-xs">{p.count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
