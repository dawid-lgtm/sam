import { Section } from "@/components/ui-kit/Section";

const CUSTOMERS = [
  { name: "Atlas Ridge", done: 86 },
  { name: "Kestrel Underground", done: 71 },
  { name: "Ironbark North", done: 54 },
  { name: "Red Mesa", done: 38 },
  { name: "Callisto Creek", done: 19 },
];

export function CustomerProgressCard() {
  return (
    <Section title="Customer completion" subtitle="How far each customer is through the programs they run.">
      <div className="space-y-3">
        {CUSTOMERS.map((c) => (
          <div key={c.name}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <p className="truncate text-[15px] font-medium">{c.name}</p>
              <p className="shrink-0 text-[14px] font-semibold text-gold">{c.done}%</p>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-background/50">
              <div className="h-full rounded-full bg-gold" style={{ width: `${c.done}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}