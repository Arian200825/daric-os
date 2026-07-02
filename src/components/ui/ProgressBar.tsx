import { cn } from "@/lib/utils";

/** ProgressBar — 0–100 completion, subtle track + accent fill. */
export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-foreground/[0.07]", className)} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn("h-full rounded-full transition-all", pct === 100 ? "bg-emerald-500" : "bg-accent")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
