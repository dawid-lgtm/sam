import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Wrench } from "lucide-react";

const toolsButtonClass =
  "inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-4 text-[15px] font-semibold text-gold-foreground transition active:opacity-90";

/** One card per deployment step, each with a description, its tools and one tick box. */
export function DeploySteps({ plan, productKey = "strategy", onOpenTools }) {
  const storageKey = `sam-deploy-steps:${productKey}`;
  const [done, setDone] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    setDone(raw ? JSON.parse(raw) : []);
  }, [storageKey]);

  const toggle = (n) => {
    const next = done.includes(n) ? done.filter((x) => x !== n) : [...done, n];
    setDone(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  return (
    <div className="space-y-3">
      {plan.phases.map((p) => {
        const isDone = done.includes(p.n);
        return (
          <div
            key={p.n}
            className={`rounded-2xl p-4 ${isDone ? "bg-gold/15 ring-1 ring-gold/50" : "bg-background/40"}`}
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold font-heading text-[18px] font-semibold text-gold-foreground">
                {p.n}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-[19px] font-semibold leading-snug text-foreground">{p.name}</p>
                <p className="text-[14px] leading-snug text-muted-foreground">{p.status}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(p.n)}
                aria-pressed={isDone}
                title={isDone ? `Untick step ${p.n}` : `Tick step ${p.n} off as done`}
                className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl px-2 text-[15px] font-semibold text-foreground transition hover:bg-background/50"
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-md border-2 ${
                    isDone ? "border-gold bg-gold text-gold-foreground" : "border-muted-foreground/60"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : null}
                </span>
                Done
              </button>
            </div>

            <p className="mt-2 text-[15px] leading-snug text-foreground">{p.description}</p>

            <div className="mt-3">
              {onOpenTools ? (
                <button type="button" onClick={onOpenTools} title="Open the tools for this step" className={toolsButtonClass}>
                  <Wrench className="h-4 w-4" /> Tools needed
                </button>
              ) : (
                <Link to="/strategy/start" title="Open the tools for this step" className={toolsButtonClass}>
                  <Wrench className="h-4 w-4" /> Tools needed
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}