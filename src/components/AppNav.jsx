import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { authQuery } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Home, ClipboardCheck, Target, Mountain, CalendarDays, Settings, Workflow, Users, Package, Library, GraduationCap, Briefcase, HardHat } from "lucide-react";

const home = { to: "/", label: "Home", icon: Home };

const baseItems = [
  home,
  { to: "/assess", label: "Assess", icon: ClipboardCheck },
  { to: "/strategy", label: "Strategy", icon: Target },
  { to: "/site", label: "Site", icon: Mountain },
  { to: "/meetings", label: "Meetings", icon: CalendarDays },
];

const adminItems = [
  { to: "/master/raptortech", label: "Raptortech team", icon: Briefcase },
  { to: "/master/customers", label: "Customers", icon: Users },
  { to: "/master/products", label: "Products + training design", icon: Package },
  { to: "/master/tools", label: "Core materials", icon: Library },
  {
    to: "/master/products/$productKey",
    params: { productKey: "raptortech_training" },
    match: "/master/products/raptortech_training",
    label: "Raptortech training",
    icon: GraduationCap,
  },
];

// What each tab is for, shown when a pointer rests on it.
const hints = {
  "/": "Your overview",
  "/operations": "Today: handover, pre-start, the four blocks and the Shift Report",
  "/assess": "Assess a leader against the maturity staircase",
  "/strategy": "The goal, objectives, strategies and tracker",
  "/site": "Site tactics, plans, actions and asks",
  "/meetings": "The meeting calendar and the rules for each meeting",
  "/master": "Master admin overview",
  "/master/raptortech": "The Raptortech team's own customers and delivery calendar",
  "/master/customers": "Customers, their sites, products and progress",
  "/master/products": "Products + training design: cards, rollout plans and downloads",
  "/master/tools": "Core materials: handbooks, agendas and workbooks",
  "/master/products/raptortech_training": "The Raptortech training card chain",
  "/admin": "Admin settings",
  "/flow": "Test the card flow",
};

export function AppNav({ variant = "bottom" }) {
  const { data: auth } = useQuery(authQuery);
  const user = auth?.user;
  const isAdmin = user?.role === "admin";

  // The Operations tab is for anyone in an Ops program, and for the people who run one.
  const { data: opsEnrolled } = useQuery({
    queryKey: ["ops-enrolled", user?.id],
    enabled: !!user?.id,
    staleTime: 60000,
    queryFn: async () => (await base44.entities.OpsEnrolment.filter({ user_id: user.id })).length > 0,
  });
  const showOps = !!opsEnrolled || ["superintendent", "facilitator"].includes(user?.access) || isAdmin;
  const opsItem = { to: "/operations", label: "Operations", icon: HardHat };
  const mainItems = showOps ? [home, opsItem, ...baseItems.slice(1)] : baseItems;

  // Desktop keeps the master tabs and the site tabs on one line, Home first.
  const items = isAdmin
    ? variant === "top"
      ? [
          home,
          ...(showOps ? [opsItem] : []),
          ...adminItems,
          { to: "/site", label: "Site", icon: Mountain },
          { to: "/meetings", label: "Meetings", icon: CalendarDays },
          { to: "/admin", label: "Admin", icon: Settings },
          { to: "/flow", label: "Test flow", icon: Workflow },
        ]
      : [...mainItems, { to: "/master", label: "Master", icon: Users }, { to: "/admin", label: "Admin", icon: Settings }]
    : mainItems;
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to) => (to === "/" ? path === "/" : path === to || path.startsWith(`${to}/`));

  if (variant === "top") {
    return (
      <nav className="flex flex-nowrap items-center gap-1 overflow-x-auto pb-2">
        {items.map(({ to, params, match, label, icon: Icon }) => {
          const active = isActive(match || to);
          return (
            <Link
              key={label}
              to={to}
              params={params}
              title={hints[match || to] || `Open ${label}`}
              className={`flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-[13px] font-medium transition ${
                active ? "bg-card text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-gold" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="safe-bottom bg-background">
      <div className="mx-auto flex max-w-3xl items-stretch">
        {items.map(({ to, params, match, label, icon: Icon }) => {
          const active = isActive(match || to);
          return (
            <Link
              key={label}
              to={to}
              params={params}
              title={hints[match || to] || `Open ${label}`}
              className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              <Icon className={`h-6 w-6 ${active ? "text-gold" : "text-muted-foreground"}`} strokeWidth={2} />
              <span
                className={`text-[15px] leading-tight ${
                  active ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}