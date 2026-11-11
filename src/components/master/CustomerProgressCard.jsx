import { Section } from "@/components/ui-kit/Section";

const CUSTOMERS = [
  {
    name: "Atlas Ridge",
    products: [
      ["Enterprise Fundamentals", 96],
      ["Managing Operations", 84],
      ["Managing Strategy", 72],
    ],
  },
  {
    name: "Kestrel Underground",
    products: [
      ["Enterprise Fundamentals", 88],
      ["Managing Operations", 61],
      ["Managing Maintenance", 45],
    ],
  },
  {
    name: "Ironbark North",
    products: [
      ["Enterprise Fundamentals", 74],
      ["Managing Strategy", 38],
      ["Frontline Manager Training", 22],
    ],
  },
  {
    name: "Red Mesa",
    products: [
      ["Enterprise Fundamentals", 52],
      ["Managing People and Risk", 26],
    ],
  },
  {
    name: "Callisto Creek",
    products: [["Enterprise Fundamentals", 19]],
  },
];

export function CustomerProgressCard() {
  return (
    <Section title="Customer completion" subtitle="Each customer, product by product. No averages.">
      <div className="grid gap-3 sm:grid-cols-2">
        {CUSTOMERS.map((c) => (
          <div key={c.name} className="rounded-xl bg-background/40 p-3">
            <p className="text-[16px] font-semibold">{c.name}</p>
            <div className="mt-2 space-y-2.5">
              {c.products.map(([product, done]) => (
                <div key={product}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <p className="truncate text-[14px] text-muted-foreground">{product}</p>
                    <p className="shrink-0 text-[14px] font-semibold text-gold">{done}%</p>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-card">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${done}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}