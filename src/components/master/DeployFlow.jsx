import { useState } from "react";
import { ChevronRight, Flag } from "lucide-react";

function PhaseDetail({ phase }) {
  return (
    <div className="mt-2 rounded-lg bg-background/40 p-2.5">
      <div className="mt-1 grid gap-2 sm:grid-cols-3">
        {phase.blocks.map((b) => (
          <div key={b.h}>
            <p className="text-[14px] font-semibold leading-snug text-gold">{b.h}</p>
            <ul className="mt-0.5 list-disc space-y-0 pl-4 text-[14px] leading-snug">
              {b.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-md bg-card p-2">
        <p className="flex items-center gap-1.5 text-[14px] font-semibold">
          <Flag className="h-3.5 w-3.5 text-gold" /> Done when
        </p>
        <ul className="mt-0.5 list-disc space-y-0 pl-4 text-[14px] leading-snug">
          {phase.gate.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DeployFlow({ phases }) {
  const [open, setOpen] = useState(phases[0]?.n ?? null);
  const phase = phases.find((p) => p.n === open);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5">
        {phases.map((p, i) => (
          <div key={p.n} className="flex items-center gap-1">
            <button
              onClick={() => setOpen(open === p.n ? null : p.n)}
              title={`Show the detail for phase ${p.n}`}
              className={`w-[140px] rounded-lg px-2 py-1.5 text-left transition ${
                open === p.n ? "bg-gold text-gold-foreground" : "bg-background/40 hover:ring-2 hover:ring-gold"
              }`}
            >
              <span className={`text-[12px] font-semibold ${open === p.n ? "opacity-80" : "text-muted-foreground"}`}>
                Step {p.n} · {p.status}
              </span>
              <span className="mt-0.5 block text-[14px] font-semibold leading-tight">{p.name}</span>
            </button>
            {i < phases.length - 1 ? <ChevronRight className="h-4 w-4 shrink-0 text-gold" /> : null}
          </div>
        ))}
      </div>
      {phase ? <PhaseDetail phase={phase} /> : null}
    </div>
  );
}