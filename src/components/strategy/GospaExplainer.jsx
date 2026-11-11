import { useState } from "react";
import { GOSPA_LAYERS } from "@/lib/gospaContent";
import { GospaFlow, GospaDetail } from "@/components/strategy/GospaFlow";

const steps = [
  {
    n: "1",
    title: "The executive session",
    body: "The Goal and up to five Objectives. Each gets an ELT owner, a success metric, a value and a deliver date.",
  },
  {
    n: "2",
    title: "The leadership workshop",
    body: "Strategies are designed together, with an owner from the wider leadership team, a success metric, a value and a deliver date.",
  },
  {
    n: "3",
    title: "Back at site",
    body: "Each site turns its share into Tactics, Plans and Actions. The Goal, Objectives and Strategies are already there.",
  },
];

export function GospaExplainer() {
  const [activeKey, setActiveKey] = useState("g");
  const active = GOSPA_LAYERS.find((l) => l.key === activeKey) || GOSPA_LAYERS[0];

  return (
    <section className="sam-glass p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-heading text-[19px] font-semibold text-foreground">How the model works</h2>
        <span className="rounded-full bg-gold px-2.5 py-1 text-[14px] font-semibold text-gold-foreground">GOSPA</span>
      </div>
      <p className="mt-2 text-[15px] leading-snug text-foreground">
        One Goal, a small number of Objectives, and a Strategy for each. Below that, every site's Plans and Actions.
        Nothing skips a level: an Action with no Strategy behind it is work, not progress.
      </p>

      <div className="mt-3">
        <GospaFlow activeKey={activeKey} onSelect={setActiveKey} />
        <GospaDetail layer={active} />
      </div>

      <h3 className="mt-4 font-heading text-[17px] font-semibold text-foreground">How it runs</h3>
      <div className="mt-2 space-y-2">
        {steps.map((s) => (
          <div key={s.n} className="flex items-start gap-3 rounded-xl bg-background/40 p-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-[15px] font-semibold text-gold-foreground">
              {s.n}
            </span>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-foreground">{s.title}</p>
              <p className="mt-0.5 text-[15px] leading-snug text-muted-foreground">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}