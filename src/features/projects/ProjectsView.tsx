import { CalendarDays, CheckCircle2, Circle } from "lucide-react";
import { db } from "@/lib/db";
import { PROJECT_STATUS_META, INDUSTRY_META } from "@/lib/models";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function ProjectsView() {
  const projects = db.projects();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Projects" description="Track delivery from kickoff to launch." />

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => {
          const done = p.tasks.filter((t) => t.done).length;
          return (
            <Card key={p.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-semibold">{p.name}</h2>
                  <p className="text-xs text-muted">{p.client} · {INDUSTRY_META[p.industry].label}</p>
                </div>
                <Badge tone={PROJECT_STATUS_META[p.status].tone}>{PROJECT_STATUS_META[p.status].label}</Badge>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted">Progress</span>
                  <span className="font-mono font-medium">{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} />
              </div>

              <ul className="flex flex-col gap-1.5">
                {p.tasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    {t.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-muted/50" />}
                    <span className={t.done ? "text-muted line-through" : ""}>{t.title}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Due {formatDate(p.deadline)}</span>
                <span>{done}/{p.tasks.length} tasks</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
