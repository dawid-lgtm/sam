import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "./_authed/admin";
// TEMPORARY: screenshot only, test data, removed straight after.
export const Route = createFileRoute("/shot-admin")({ ssr: false, component: () => (
  <div className="min-h-screen bg-background p-4 text-foreground"><div className="mx-auto max-w-3xl"><AdminDashboard /></div></div>
) });
