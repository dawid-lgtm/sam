import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-kit/PageHeader";

export const Route = createFileRoute("/_authed/strategy")({
  component: StrategyLayout,
});

const tabs = [
  { to: "/strategy", label: "Goal & objectives" },
  { to: "/strategy/strategies", label: "Strategies" },
  { to: "/strategy/tracker", label: "Tracker" },
  { to: "/strategy/changelog", label: "Change log" },
];

function StrategyLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="">
      <PageHeader eyebrow="Tool 2" title="The strategy" intro="One goal, at most five objectives, and the strategies that carry them." />
      <div className="-mx-4 mb-5 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          {tabs.map((t) => {
            const active = path === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex min-h-[44px] items-center rounded-full px-4 text-sm font-medium transition ${
                  active ? "bg-navy text-white" : "bg-white text-muted-foreground hover:text-navy"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}