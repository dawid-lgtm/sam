import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Route as RouteIcon, PlayCircle, ChevronRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/PageHeader";

export const Route = createFileRoute("/_authed/strategy/")({
  component: ManagingStrategy,
  head: () => ({ meta: [{ title: "Sam — Managing strategy" }] }),
});

const entryPoints = [
  {
    to: "/strategy/deploy",
    icon: RouteIcon,
    title: "How the program is deployed",
    note: "The three steps, who attends each, and what has to be true before the next one starts.",
  },
  {
    to: "/strategy/rhythm",
    icon: Clock,
    title: "IN, IN, IN, ON rhythm explained",
    note: "Three meetings running the work, then one improving it — the meeting rhythm this program locks in.",
  },
  {
    to: "/strategy/gospa",
    icon: Compass,
    title: "GOSPA explained",
    note: "The one-page sheet: one goal, up to five objectives, strategies carrying each, then every site's tactics, plans and actions.",
  },
  {
    to: "/strategy/start",
    icon: PlayCircle,
    title: "Get started",
    note: "The program cards, in the step they belong to. Each step unlocks when the one before it is complete.",
  },
];

function ManagingStrategy() {
  return (
    <div>
      <PageHeader
        title="Managing strategy"
        intro="Goal, objectives, strategies — then every site's tactics, plans and actions. Start with how the program runs, then build it."
      />

      <div className="space-y-3">
        {entryPoints.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.to}
              to={p.to}
              className="sam-glass flex min-h-[92px] items-center gap-3.5 p-4 transition hover:ring-2 hover:ring-gold"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold text-gold-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-[19px] font-semibold leading-snug text-foreground">
                  {p.title}
                </span>
                <span className="mt-1 block text-[15px] leading-snug text-muted-foreground">{p.note}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      <p className="mt-4 rounded-xl bg-background/40 px-3.5 py-3 text-[15px] leading-snug text-foreground">
        One company goal, up to five objectives, a small number of strategies for each. A strategy with no tactics,
        plans or actions behind it does not get delivered — the Strategies screen says so on the card.
      </p>
    </div>
  );
}