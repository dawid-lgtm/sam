import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function ObjectiveList({ objectives }) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-heading text-[21px] font-semibold text-foreground">The objectives</h2>
        <Link to="/strategy/gospa" className="text-[15px] font-medium text-foreground underline-offset-4 hover:underline">
          See strategy
        </Link>
      </div>
      <div className="space-y-3">
        {objectives.map((o) => (
          <Link key={o.code} to="/strategy/gospa" className="block rounded-2xl bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold text-[15px] font-semibold text-gold-foreground">
                {o.code}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-medium leading-snug text-foreground">{o.statement}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-background/60">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${o.progress}%` }} />
                  </div>
                  <span className="w-12 text-right text-[15px] font-semibold tabular-nums text-foreground">
                    {o.progress}%
                  </span>
                </div>
                <p className="mt-2 text-[15px] leading-snug text-muted-foreground">
                  {o.metric || "No measure yet"} · {o.exec_owner || "no owner"}
                </p>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}