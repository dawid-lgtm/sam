import { ArrowRight } from "lucide-react";

export function FlowDiagram({ steps, active = -1 }) {
  return (
    <div className="rounded-2xl bg-card p-4">
      <h3 className="mb-3 font-heading text-[18px] font-semibold">The flow</h3>
      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap">
        {steps.map((step, i) => {
          const done = active > -1 && i < active;
          const now = i === active;
          return (
            <div key={step.label} className="flex items-center gap-2 lg:flex-1 lg:basis-[150px]">
              <div
                className={`w-full rounded-xl border-2 px-3 py-2 ${
                  now
                    ? "border-gold bg-gold/15"
                    : done
                      ? "border-gold/40 bg-background/60"
                      : "border-foreground/15 bg-background/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                      now || done ? "bg-gold text-gold-foreground" : "bg-background text-foreground"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="text-[14px] font-semibold leading-tight">{step.label}</span>
                </div>
                <p className="mt-1 pl-8 text-[13px] leading-snug text-muted-foreground">{step.who}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-gold lg:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}