import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { safetyCountsFor } from "@/lib/masterQueries";

export function SafetyTasksCard({ customerIds }) {
  const { data } = useQuery(safetyCountsFor(customerIds));
  const counts = data || { designed: 0, implemented: 0 };

  return (
    <Link to="/master/safety" className="sam-glass block p-2.5 transition hover:ring-2 hover:ring-gold">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-gold" />
        <p className="text-[12px] font-semibold">Safety tasks · all sites</p>
      </div>
      <div className="mt-1.5 space-y-1">
        <div className="flex justify-between rounded bg-background/40 px-1.5 py-1 text-[11px]">
          <span>Designed</span>
          <span className="font-semibold">{counts.designed}</span>
        </div>
        <div className="flex justify-between rounded bg-background/40 px-1.5 py-1 text-[11px]">
          <span>Implemented</span>
          <span className="font-semibold text-gold">{counts.implemented}</span>
        </div>
      </div>
    </Link>
  );
}