import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ClipboardCheck, Target, Mountain, CalendarDays } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/assess", label: "Assess", icon: ClipboardCheck },
  { to: "/strategy", label: "Strategy", icon: Target },
  { to: "/site", label: "Site", icon: Mountain },
  { to: "/meetings", label: "Meetings", icon: CalendarDays },
];

export function AppNav({ variant = "bottom" }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to) => (to === "/" ? path === "/" : path === to || path.startsWith(`${to}/`));

  if (variant === "top") {
    return (
      <nav className="flex gap-1 pb-2">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive(to) ? "bg-navy text-white" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="safe-bottom border-t border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-stretch">
        {items.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center gap-1 pb-2 pt-3 transition ${
                active ? "text-navy" : "text-muted-foreground"
              }`}
            >
              <span className={`grid h-9 w-14 place-items-center rounded-full transition ${active ? "bg-accent" : ""}`}>
                <Icon className="h-[21px] w-[21px]" strokeWidth={2} />
              </span>
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}