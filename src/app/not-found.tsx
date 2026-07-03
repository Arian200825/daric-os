import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-background-subtle text-muted">
        <FileQuestion className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-xs text-sm text-muted">This page doesn&apos;t exist or has moved.</p>
      <Button href="/">Back to dashboard</Button>
    </div>
  );
}
