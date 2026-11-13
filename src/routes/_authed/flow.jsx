import { createFileRoute, Link } from "@tanstack/react-router";
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
  return <FlowTest />;
}