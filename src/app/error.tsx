"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Global error boundary — recovers gracefully instead of a blank screen. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="max-w-xs text-sm text-muted">An unexpected error occurred. You can try again.</p>
      <div className="flex gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Button href="/" variant="outline">Back to dashboard</Button>
      </div>
    </div>
  );
}
