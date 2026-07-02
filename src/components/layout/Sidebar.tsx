"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Sidebar — brand + primary nav. Used in the desktop rail and the mobile drawer. */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5 px-5 py-5">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
          <span className="h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">Daric OS</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Primary">
        {NAV.map((item) => {
          const norm = (p: string) => p.replace(/\/+$/, "") || "/";
          const here = norm(pathname);
          const target = norm(item.href);
          const active = here === target || (target !== "/" && here.startsWith(`${target}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-foreground text-background" : "text-muted hover:bg-background-subtle hover:text-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-5 py-4">
        <p className="text-xs text-muted">Signed in as</p>
        <p className="text-sm font-medium">Daric Team</p>
      </div>
    </div>
  );
}
