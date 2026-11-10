import { createFileRoute, Link } from "@tanstack/react-router";
import { SuperAdmin } from "@/components/super/SuperAdmin";

export const Route = createFileRoute("/_authed/super")({
  component: Page,
  head: () => ({ meta: [{ title: "Sam — Super admin" }] }),
});

function Page() {
  const { user } = Route.useRouteContext();
  if (user?.role !== "admin") {
    return <p className="rounded-2xl bg-card p-4 text-[15px]">This page is for the super admin. <Link to="/" className="text-gold underline">Back home</Link></p>;
  }
  return <SuperAdmin />;
}
