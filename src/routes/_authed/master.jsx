import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/master")({
  component: MasterLayout,
});

function MasterLayout() {
  const { user } = Route.useRouteContext();

  if (user && user.role !== "admin") {
    return (
      <p className="rounded-2xl bg-card p-4 text-[15px]">
        This area is for the super admin.{" "}
        <Link to="/" className="text-gold underline">
          Back home
        </Link>
      </p>
    );
  }

  return <Outlet />;
}