import { useState } from "react";
import { ChevronRight, Flag } from "lucide-react";
import { RAPTORTECH_URL } from "@/components/RaptortechCredit";

/** A simple three-step flow: tap a step to highlight it and read what happens in it below. */
export function DeployFlow({ phases }) {
  const [active, setActive] = useState(phases[0]?.n ?? 1);
  const phase = phases.find((p) => p.n === active) || phases[0];

  return (
    <div>
      <div className="flex items-stretch gap-1">
        {phases.map((p, i) => (
          <div key={p.n} className="flex flex-1 items-center gap-1">
            <button
              type="button"
              onClick={() => setActive(p.n)}
              title={`Show what happens in step ${p.n}`}
              aria-pressed={active === p.n}
              className={`min-h-[76px] flex-1 rounded-xl px-2.5 py-2 text-left transition ${
                active === p.n
                  ? "bg-gold text-gold-foreground ring-2 ring-gold"
                  : "bg-background/40 text-foreground hover:bg-background/60"
              }`}
            >
              <span className={`block text-[14px] font-semibold ${active === p.n ? "opacity-80" : "text-muted-foreground"}`}>
                Step {p.n}
              </span>
              <span className="mt-0.5 block text-[15px] font-semibold leading-tight">{p.name}</span>
            </button>
            {i < phases.length - 1 ? <ChevronRight className="h-5 w-5 shrink-0 text-gold" /> : null}
          </div>
        ))}
      </div>

      {phase ? (
        <div className="mt-3 rounded-2xl bg-background/40 p-4">
          <p className="font-heading text-[20px] font-semibold leading-snug text-foreground">
            Step {phase.n} · {phase.name}
          </p>
          <p className="text-[15px] leading-snug text-muted-foreground">{phase.status}</p>
          <p className="mt-2 text-[15px] leading-snug text-foreground">{phase.description}</p>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {phase.blocks.map((b) => (
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
              {phase.gate.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>

          {phase.note ? (
            <p className="mt-2 rounded-xl border border-gold/40 bg-card/60 p-3 text-[15px] leading-snug text-foreground">
              {phase.note.before}
              <a
                href={RAPTORTECH_URL}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-gold underline decoration-gold underline-offset-2"
              >
                {phase.note.link}
              </a>
              {phase.note.after}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}