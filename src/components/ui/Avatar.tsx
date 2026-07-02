import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Avatar — initials in a soft circle (deterministic, no image needed). */
export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent",
        className
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
