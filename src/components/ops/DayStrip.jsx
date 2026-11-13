import { Link } from "@tanstack/react-router";

const tone = {
  Done: "bg-gold text-gold-foreground",
  Due: "bg-foreground text-background",
  Late: "bg-foreground/15 text-foreground ring-1 ring-foreground/40",
  Missed: "bg-foreground/15 text-foreground",
  "Not started": "bg-background/50 text-muted-foreground",
};

/** Handover · Pre-start · B1 · B2 · B3 · B4, one tap each. */
export function DayStrip({ steps, statuses }) {
  const shown = steps.filter((s) => s.id !== "report" && s.id !== "handover_out");
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {shown.map((step) => {
        const status = statuses[step.id] || "Not started";
        return (
          <Link
            key={step.id}
            to="/operations/step/$stepId"
            params={{ stepId: step.id }}
            className="flex min-h-[64px] min-w-[74px] flex-col justify-between rounded-xl bg-card px-2 py-1.5"
          >
            <span className="text-[14px] font-semibold text-foreground">{step.short}</span>
            <span className="text-[13px] text-muted-foreground">{step.start}</span>
            <span className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[12px] font-medium ${tone[status] || tone["Not started"]}`}>
              {status}
            </span>
          </Link>
        );
      })}
    </div>
  );
}