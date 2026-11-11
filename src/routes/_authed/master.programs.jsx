import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { ALL_PRODUCTS, PRODUCT_GROUPS } from "@/lib/products";
import { appUsersQuery, averageProgress, byName, customersQuery, toolsQuery } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { ProgressBar, StatusChip } from "@/components/master/bits";

export const Route = createFileRoute("/_authed/master/programs")({
  component: ProgramsPage,
  head: () => ({ meta: [{ title: "Sam — Products" }] }),
});

function ProgramsPage() {
  const queryClient = useQueryClient();
  const { data: customers = [] } = useQuery(customersQuery);
  const { data: users = [] } = useQuery(appUsersQuery);
  const { data: tools = [] } = useQuery(toolsQuery);
  const [selected, setSelected] = useState(null);

  const list = [...customers].sort(byName);
  const program = ALL_PRODUCTS.find((p) => p.key === selected) || null;

  const setProducts = async (customer, next) => {
    await base44.entities.Customer.update(customer.id, { products: next });
    await queryClient.invalidateQueries({ queryKey: ["customers"] });
  };

  const toggle = (customer, key) => {
    const current = customer.products || [];
    setProducts(customer, current.includes(key) ? current.filter((k) => k !== key) : [...current, key]);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Products" intro="Turn a product on or off per customer, and see how each one is tracking across the country." />

      {PRODUCT_GROUPS.map((group) => (
        <Section key={group.id} title={group.name}>
          <div className="grid gap-2 sm:grid-cols-2">
            {group.items.map((p) => {
              const product = ALL_PRODUCTS.find((x) => x.key === p.key);
              const using = list.filter((c) => (c.products || []).includes(p.key));
              const avg = using.length
                ? Math.round(using.reduce((n, c) => n + (averageProgress(c, [p.key]) ?? 0), 0) / using.length)
                : null;
              const toolCount = tools.filter((t) => (t.assigned_products || []).includes(p.key)).length;
              return (
                <button
                  key={p.key}
                  onClick={() => setSelected(selected === p.key ? null : p.key)}
                  className={`rounded-xl p-3 text-left transition ${
                    selected === p.key ? "bg-gold text-gold-foreground" : "bg-background/40 hover:ring-2 hover:ring-gold"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[15px] font-semibold">{p.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[13px] ${product.status === "later" ? "bg-card text-muted-foreground" : "border border-current"}`}>
                      {product.status === "later" ? "Later" : "Available"}
                    </span>
                  </div>
                  <span className="mt-1 block text-[14px] opacity-90">{p.description}</span>
                  <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[14px] opacity-90">
                    <span>{using.length} customers</span>
                    <span>{toolCount} tools</span>
                    <span>{avg === null ? "no progress data" : `avg ${avg}%`}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Section>
      ))}

      {program ? (
        <Section
          title={`${program.name} — collated data`}
          subtitle={`${list.filter((c) => (c.products || []).includes(program.key)).length} customers have this product on.`}
          action={
            <button onClick={() => setSelected(null)} className="text-[15px] font-semibold text-gold">
              Close
            </button>
          }
        >
          {list.filter((c) => (c.products || []).includes(program.key)).length ? (
            <div className="space-y-2">
              {list
                .filter((c) => (c.products || []).includes(program.key))
                .map((c) => {
                  const people = users.filter((u) => u.customer_id === c.id).length;
                  const progress = averageProgress(c, [program.key]);
                  return (
                    <div key={c.id} className="rounded-xl bg-background/40 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link to="/master/customers/$customerId" params={{ customerId: c.id }} className="block truncate text-[15px] font-semibold">
                            {c.name}
                          </Link>
                          <p className="text-[14px] text-muted-foreground">
                            {people} people · {c.region || "no region"}
                          </p>
                        </div>
                        <StatusChip status={c.status} />
                      </div>
                      {progress !== null ? (
                        <div className="mt-2"><ProgressBar value={progress} label="Progress" /></div>
                      ) : (
                        <p className="mt-1 text-[14px] text-muted-foreground">No progress recorded for this product yet.</p>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <EmptyLine>No customer has this product on yet. Turn it on below.</EmptyLine>
          )}
        </Section>
      ) : null}

      <Section title="Products on or off per customer" subtitle="Tap a product to switch it for that customer.">
        {list.length ? (
          <div className="space-y-3">
            {list.map((c) => (
              <div key={c.id} className="rounded-xl bg-background/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <Link to="/master/customers/$customerId" params={{ customerId: c.id }} className="min-w-0 truncate text-[15px] font-semibold">
                    {c.name}
                  </Link>
                  <span className="flex items-center gap-1 text-[14px] text-gold">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ALL_PRODUCTS.map((p) => {
                    const on = (c.products || []).includes(p.key);
                    return (
                      <button
                        key={p.key}
                        onClick={() => toggle(c, p.key)}
                        aria-pressed={on}
                        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 text-[14px] font-medium transition ${
                          on ? "bg-gold text-gold-foreground" : "bg-card text-muted-foreground"
                        }`}
                      >
                        {on ? <Check className="h-4 w-4" /> : null}
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyLine>No customers yet.</EmptyLine>
        )}
      </Section>
    </div>
  );
}