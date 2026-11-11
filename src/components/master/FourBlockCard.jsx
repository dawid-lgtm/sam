import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid } from "lucide-react";
import { fourBlockCountsFor } from "@/lib/masterQueries";

export function FourBlockCard({ customerIds }) {
  const { data } = useQuery(fourBlockCountsFor(customerIds));
  const counts = data || { total: 0, supervisors: 0, superintendents: 0 };

  return (
    <Link to="/master/safety" className="sam-glass block p-2.5 transition hover:ring-2 hover:ring-gold">
      <div className="flex items-center gap-1.5">
        <LayoutGrid className="h-3.5 w-3.5 text-gold" />
        <p className="text-[12px] font-semibold">Four blocks · all sites</p>
      </div>
      <p className="mt-1 font-heading text-[18px] font-semibold leading-none">{counts.total}</p>
      <p className="text-[11px] font-semibold">Full shifts completed</p>
      <div className="mt-1.5 space-y-1">
        <div className="flex justify-between rounded bg-background/40 px-1.5 py-1 text-[11px]">
          <span>Supervisors</span>
          <span className="font-semibold">{counts.supervisors}</span>
        </div>
        <div className="flex justify-between rounded bg-background/40 px-1.5 py-1 text-[11px]">
          <span>Superintendents</span>
          <span className="font-semibold">{counts.superintendents}</span>
        </div>
      </div>
    </Link>
  );
}