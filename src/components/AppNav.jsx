import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { authQuery } from "@/lib/AuthContext";
import { Home, ClipboardCheck, Target, Mountain, CalendarDays, Settings, Workflow, Users, Package, Library, GraduationCap } from "lucide-react";

const home = { to: "/", label: "Home", icon: Home };

const baseItems = [
  home,
  { to: "/assess", label: "Assess", icon: ClipboardCheck },
  { to: "/strategy", label: "Strategy", icon: Target },
  { to: "/site", label: "Site", icon: Mountain },
  { to: "/meetings", label: "Meetings", icon: CalendarDays },
];

const adminItems = [
  { to: "/master/customers", label: "Customers", icon: Users },
  { to: "/master/products", label: "Products", icon: Package },
  { to: "/master/tools", label: "Core materials", icon: Library },
  {
    to: "/master/products/$productKey",
    params: { productKey: "raptortech_training" },
    match: "/master/products/raptortech_training",
    label: "Raptortech training",
    icon: GraduationCap,
  },
];

export function AppNav({ variant = "bottom" }) {
  const { data: auth } = useQuery(authQuery);
  const isAdmin = auth?.user?.role === "admin";
  // Desktop keeps the master tabs and the site tabs on one line, Home first.
  const items = isAdmin
    ? variant === "top"
      ? [
          home,
          ...adminItems,
          { to: "/site", label: "Site", icon: Mountain },
          { to: "/meetings", label: "Meetings", icon: CalendarDays },
          { to: "/admin", label: "Admin", icon: Settings },
          { to: "/flow", label: "Test flow", icon: Workflow },
        ]
      : [...baseItems, { to: "/master", label: "Master", icon: Users }, { to: "/admin", label: "Admin", icon: Settings }]
    : variant === "top"
      ? [home, ...baseItems.slice(3)]
      : baseItems;
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to) => (to === "/" ? path === "/" : path === to || path.startsWith(`${to}/`));

  if (variant === "top") {
    return (
      <nav className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-3">
        {items.map(({ to, params, match, label, icon: Icon }) => {
          const active = isActive(match || to);
          return (
            <Link
              key={label}
              to={to}
              params={params}
              className={`flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-[15px] font-medium transition ${
                active ? "bg-card text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-gold" : ""}`} />
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