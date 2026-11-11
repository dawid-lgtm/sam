import { Section } from "@/components/ui-kit/Section";
import { GospaDiagram } from "@/components/strategy/GospaDiagram";

const LEVELS = [
  { letter: "G", name: "Goal", ask: "Where we are going, in one line." },
  { letter: "O", name: "Objectives", ask: "The five things that have to be true for the Goal to be achieved." },
  { letter: "S", name: "Strategies", ask: "The strategies that will deliver the Objectives." },
  { letter: "P", name: "Plans", ask: "Who does what, and where, to deliver the Strategies." },
  { letter: "A", name: "Actions", ask: "Who does what, with names and dates." },
];

export function GospaSheet() {
  return (
    <Section
      title="GOSPA explained"
      subtitle="Five levels, one line of sight. Read it top to bottom: the goal splits into the objectives, each objective into strategies, each strategy into site plans, and every plan into actions."
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {LEVELS.map((l) => (
          <div key={l.letter} className="rounded-xl bg-background/40 px-2.5 py-2.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold font-heading text-[16px] font-semibold text-gold-foreground">
                {l.letter}
              </span>
              <span className="text-[15px] font-semibold text-foreground">{l.name}</span>
            </div>
            <p className="mt-1.5 text-[15px] leading-snug text-muted-foreground">{l.ask}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 rounded-xl bg-background/50 px-3 py-2.5 text-[15px] leading-snug text-foreground">
        The rule is simple: nothing sits at a level unless it serves the level above it. If an action cannot name the plan
        it serves, it does not belong on the sheet.
      </p>

      <div className="mt-4 rounded-2xl bg-background/20 p-3 sm:p-4">
        <p className="mb-3 text-[14px] font-semibold uppercase tracking-wide text-gold">The flow, one worked example</p>
        <GospaDiagram />
      </div>
    </Section>
  );
}