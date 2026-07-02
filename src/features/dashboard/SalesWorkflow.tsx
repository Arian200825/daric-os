import { UserPlus, MessagesSquare, FileText, FolderKanban, Rocket, ChevronRight, type LucideIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardHeader } from "@/components/ui/Card";

interface Stage {
  label: string;
  icon: LucideIcon;
  count: number;
}

/**
 * SalesWorkflow — the agency funnel, computed from live CRM + project data:
 * Lead → Discovery → Proposal → Project → Launch. Verifies the pipeline is
 * wired end to end.
 */
export function SalesWorkflow() {
  const leads = db.leads();
  const projects = db.projects();
  const by = (...s: string[]) => leads.filter((l) => s.includes(l.status)).length;

  const stages: Stage[] = [
    { label: "Lead", icon: UserPlus, count: by("new", "contacted") },
    { label: "Discovery", icon: MessagesSquare, count: by("discovery") },
    { label: "Proposal", icon: FileText, count: by("proposal_sent", "negotiating") },
    { label: "Project", icon: FolderKanban, count: by("won") },
    { label: "Launch", icon: Rocket, count: projects.filter((p) => p.status === "launched").length },
  ];

  return (
    <Card>
      <CardHeader title="Sales workflow" action={<span className="text-xs text-muted">Lead → Launch</span>} />
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-stretch">
        {stages.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3 sm:flex-1">
            <div className="flex flex-1 flex-col items-center gap-2 rounded-lg border border-border bg-background px-3 py-4 text-center">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                <s.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="font-mono text-xl font-semibold">{s.count}</span>
              <span className="text-xs text-muted">{s.label}</span>
            </div>
            {i < stages.length - 1 && <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted/50 sm:block" />}
          </div>
        ))}
      </div>
    </Card>
  );
}
