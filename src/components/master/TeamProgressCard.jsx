import { Section } from "@/components/ui-kit/Section";
import { useProducts } from "@/lib/catalog";

export function TeamProgressCard({ customers = [] }) {
  const catalog = useProducts();

  return (
    <Section title="Customer completion" subtitle="Each customer, product by product. No averages.">
      {customers.length ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => {
            const rows = (c.products || [])
              .map((key) => catalog.find((p) => p.key === key))
              .filter((p) => p?.progress_field);
            return (
              <div key={c.id} className="rounded-lg bg-background/40 p-2">
                <p className="text-[12px] font-semibold">{c.name}</p>
                <div className="mt-1 space-y-1">
                  {rows.length ? (
                    rows.map((p) => {
                      const done = Math.max(0, Math.min(100, Math.round(Number(c[p.progress_field]) || 0)));
                      return (
                        <div key={p.key}>
                          <div className="flex items-baseline justify-between gap-1.5">
                            <p className="truncate text-[10px] text-muted-foreground">{p.name}</p>
                            <p className="shrink-0 text-[10px] font-semibold text-gold">{done}%</p>
                          </div>
                          <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-card">
                            <div className="h-full rounded-full bg-gold" style={{ width: `${done}%` }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[10px] text-muted-foreground">No products assigned yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl bg-background/40 px-3 py-4 text-[15px] text-muted-foreground">
          No customers tagged to the Raptortech team yet.
        </p>
      )}
    </Section>
  );
}