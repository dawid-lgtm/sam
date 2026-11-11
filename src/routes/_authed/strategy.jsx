import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-kit/PageHeader";

export const Route = createFileRoute("/_authed/strategy")({
  component: StrategyLayout,
});

const tabs = [
  { to: "/strategy", label: "Goal and objectives" },
  { to: "/strategy/strategies", label: "Strategies" },
  { to: "/strategy/tracker", label: "Tracker" },
  { to: "/strategy/actions", label: "Action register" },
];

function StrategyLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const onTab = tabs.some((t) => t.to === path);

  if (!onTab) return <Outlet />;

  return (
    <div>
      <PageHeader
        title="The strategy"
        intro="One goal, at most five objectives, and the strategies that carry them."
      />
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tabs.map((t) => {
          const active = path === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex min-h-[48px] items-center justify-center rounded-xl px-2 py-2 text-center text-[15px] font-semibold leading-tight transition ${
                active ? "bg-gold text-gold-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}