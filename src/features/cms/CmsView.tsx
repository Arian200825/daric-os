import { Database, Layers, Globe, Sparkles } from "lucide-react";
import { CMS_REGISTRY } from "@/lib/models";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/**
 * CmsView — surfaces the CMS foundation (src/lib/models/cms.ts). No editors yet;
 * this shows the scalable, typed content model that editors will be generated
 * from. Adding an industry to the registry makes it appear here automatically.
 */
export function CmsView() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="CMS" description="The content model powering every Daric template." />

      <Card className="flex items-start gap-3 p-5">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Sparkles className="h-[18px] w-[18px]" />
        </span>
        <div className="text-sm">
          <p className="font-medium">Foundation, not editors — yet.</p>
          <p className="mt-1 text-muted">
            This is the typed content model that future visual editors will be generated from. Each industry
            declares its collections and fields once; the OS (and, later, per-industry editors) read from this
            single registry — so adding an industry never means bespoke CMS code.
          </p>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        {CMS_REGISTRY.map((ind) => (
          <Card key={ind.industry} className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-2">
              <Database className="h-[18px] w-[18px] text-accent" />
              <h2 className="font-display text-base font-semibold">{ind.label}</h2>
            </div>
            <p className="text-xs text-muted">{ind.description}</p>

            <ul className="flex flex-col gap-3">
              {ind.collections.map((c) => (
                <li key={c.key} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <Layers className="h-3.5 w-3.5 text-muted" /> {c.label}
                    </span>
                    {c.singleton ? <Badge tone="neutral">Singleton</Badge> : <span className="text-xs text-muted">{c.fields.length} fields</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.fields.map((f) => (
                      <span key={f.key} className="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">
                        {f.label}
                        {f.localized && <Globe className="h-2.5 w-2.5" aria-label="localized" />}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted">
        + Future industries (automotive, legal, real-estate…) plug into the same registry.
      </p>
    </div>
  );
}
