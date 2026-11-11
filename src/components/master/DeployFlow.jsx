import { Flag } from "lucide-react";

/** The three deployment steps as a connected flow, with what happens in each. */
export function DeployFlow({ phases }) {
  return (
    <div>
      {phases.map((p, i) => (
        <div key={p.n}>
          <div className="rounded-2xl bg-background/40 p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold font-heading text-[19px] font-semibold text-gold-foreground">
                {p.n}
              </span>
              <div className="min-w-0">
                <p className="font-heading text-[20px] font-semibold leading-snug text-foreground">{p.name}</p>
                <p className="text-[15px] leading-snug text-muted-foreground">{p.status}</p>
              </div>
            </div>

            <p className="mt-2 text-[15px] leading-snug text-foreground">{p.description}</p>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {p.blocks.map((b) => (
                <div key={b.h} className="rounded-xl bg-card/70 p-3">
                  <p className="text-[15px] font-semibold leading-snug text-gold">{b.h}</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-[15px] leading-snug text-foreground">
                    {b.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-2 rounded-xl bg-card p-3">
              <p className="flex items-center gap-1.5 text-[15px] font-semibold text-foreground">
                <Flag className="h-4 w-4 text-gold" /> Done when
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-[15px] leading-snug text-foreground">
                {p.gate.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          {i < phases.length - 1 ? (
            <div className="flex justify-center py-1">
              <span className="h-7 w-0.5 rounded-full bg-gold/60" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}