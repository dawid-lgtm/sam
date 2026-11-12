import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PEOPLE, SCREENS } from "@/components/flow/userFlowScreens";
import { authScreens } from "@/components/flow/authScreens";

export function UserFlow() {
  const [who, setWho] = useState("vahid");
  const [step, setStep] = useState(0);
  const person = PEOPLE[who];
  const screens = [...authScreens(person), ...SCREENS[who]];
  const screen = screens[step];

  const pick = (key) => {
    setWho(key);
    setStep(0);
  };

  return (
    <div className="rounded-2xl bg-card p-4">
      <h3 className="font-heading text-[18px] font-semibold">What they physically see</h3>
      <p className="mt-0.5 text-[14px] text-muted-foreground">
        The same flow, screen by screen. Pick a person and walk it with Next.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(PEOPLE).map(([key, p]) => (
          <button
            key={key}
            onClick={() => pick(key)}
            className={`rounded-lg px-3 py-2 text-[14px] font-bold ${
              who === key ? "bg-gold text-gold-foreground" : "bg-secondary text-foreground"
            }`}
          >
            {p.name} · {p.role}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[14px] leading-snug">{person.blurb}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {screens.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setStep(i)}
            aria-label={s.title}
            className={`grid h-8 w-8 place-items-center rounded-lg text-[13px] font-bold ${
              i === step ? "bg-gold text-gold-foreground" : "bg-background/50 text-foreground"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {screen.view}
        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-gold">
            {step + 1} of {screens.length} · {screen.group || "In the app"} · {screen.where}
          </p>
          <p className="font-heading text-[18px] font-semibold leading-snug">{screen.title}</p>
          <p className="text-[15px] leading-relaxed">{screen.does}</p>
          <div className="mt-auto flex gap-2 pt-2">
            <button
              onClick={() => setStep((i) => Math.max(0, i - 1))}
              disabled={step === 0}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-[15px] font-semibold disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setStep((i) => Math.min(screens.length - 1, i + 1))}
              disabled={step === screens.length - 1}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-4 text-[15px] font-semibold text-gold-foreground disabled:opacity-40"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}