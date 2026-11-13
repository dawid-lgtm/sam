import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { FlowTest } from "@/components/flow/FlowTest";

export const Route = createFileRoute("/_authed/flow")({
  component: Page,
  head: () => ({ meta: [{ title: "Sam — Test the MMS set-up" }] }),
});

function Page() {
  const { user } = Route.useRouteContext();
  if (user?.role !== "admin") {
    return <p className="rounded-2xl bg-card p-4 text-[15px]">This page is for the super admin. <Link to="/" className="text-gold underline">Back home</Link></p>;
  }
  return (
    <div className="space-y-3">
      <Link
        to="/review-brief"
        className="flex min-h-[48px] items-center justify-between gap-3 rounded-xl bg-gold px-4 text-[15px] font-semibold text-gold-foreground"
      >
        Open the review brief for Grok
        <Download className="h-5 w-5" />
      </Link>
      <FlowTest />
    </div>
  );
}