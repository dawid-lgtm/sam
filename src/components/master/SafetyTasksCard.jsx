import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { safetyCountsQuery } from "@/lib/masterQueries";

export function SafetyTasksCard() {
  const { data } = useQuery(safetyCountsQuery);
  const counts = data || { active: 0, dueThisWeek: 0, overdue: 0 };

  return (
    <Link to="/master/safety" className="sam-glass block p-2.5 transition hover:ring-2 hover:ring-gold">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-gold" />
        <p className="text-[12px] font-semibold">Safety tasks · all sites</p>
      </div>
      <p className="mt-1 font-heading text-[18px] font-semibold leading-none">{counts.active}</p>
      <p className="text-[11px] font-semibold">Active</p>
      <div className="mt-1.5 space-y-1">
        <div className="flex justify-between rounded bg-background/40 px-1.5 py-1 text-[11px]">
          <span>Due this week</span>
          <span className="font-semibold">{counts.dueThisWeek}</span>
        </div>
        <div className="flex justify-between rounded bg-background/40 px-1.5 py-1 text-[11px]">
          <span>Overdue</span>
          <span className="font-semibold text-gold">{counts.overdue}</span>
        </div>
      </div>
    </Link>
  );
}