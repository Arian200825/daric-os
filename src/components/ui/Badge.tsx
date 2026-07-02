import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/models";

const tones: Record<Tone, string> = {
  neutral: "bg-foreground/[0.06] text-muted",
  blue: "bg-blue-500/12 text-blue-600",
  amber: "bg-amber-500/15 text-amber-700",
  violet: "bg-violet-500/12 text-violet-600",
  green: "bg-emerald-500/12 text-emerald-600",
  red: "bg-red-500/12 text-red-600",
};

/** Badge — status/label pill, colored by semantic tone. */
export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "neutral" ? "bg-muted" : "bg-current opacity-70")} aria-hidden />
      {children}
    </span>
  );
}
