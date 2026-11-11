import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/master")({
  component: MasterLayout,
});

const tabs = [
  { to: "/master", label: "Home" },
  { to: "/master/customers", label: "Customers" },
  { to: "/master/programs", label: "Program design" },
  { to: "/master/tools", label: "Core materials" },
];

function MasterLayout() {
  const { user } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });

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

  const isActive = (to) => (to === "/master" ? path === "/master" : path === to || path.startsWith(`${to}/`));

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2">
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className={`flex min-h-[48px] items-center justify-center rounded-xl px-2 text-center text-[15px] font-semibold leading-tight transition ${
              isActive(t.to) ? "bg-gold text-gold-foreground" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}