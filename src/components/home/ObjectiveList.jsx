import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function ObjectiveList({ objectives }) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-navy">The objectives</h2>
        <Link to="/strategy" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
          See strategy
        </Link>
      </div>
      <div className="space-y-3">
        {objectives.map((o) => (
          <Link
            key={o.code}
            to="/strategy"
            className="block rounded-2xl border border-border bg-white p-4 transition hover:border-navy/20 hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-[13px] font-bold text-[#7a6114]">
                {o.code}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium leading-snug text-navy">{o.statement}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${o.progress}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold tabular-nums text-navy">{o.progress}%</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {o.metric} · {o.exec_owner}
                </p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}