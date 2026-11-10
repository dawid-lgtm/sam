import { createFileRoute } from "@tanstack/react-router";
import { SuperAdmin } from "@/components/super/SuperAdmin";
// TEMPORARY: screenshot only, removed straight after.
export const Route = createFileRoute("/shot-super")({ ssr: false, component: () => (
  <div className="min-h-screen bg-background p-4 text-foreground"><div className="mx-auto max-w-3xl"><SuperAdmin /></div></div>
) });
