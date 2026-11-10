import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, Plus, Users, Wrench } from "lucide-react";
import { ALL_PRODUCTS } from "@/lib/products";
import { appUsersQuery, averageProgress, byName, customersQuery, toolsQuery } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { StatTiles, StatusChip, ProductChips, ProgressBar } from "@/components/master/bits";

export const Route = createFileRoute("/_authed/master/")({
  component: Overview,
  head: () => ({ meta: [{ title: "Sam — Master admin" }] }),
});

function Overview() {
  const { data: customers = [], isLoading } = useQuery(customersQuery);
  const { data: users = [] } = useQuery(appUsersQuery);
  const { data: tools = [] } = useQuery(toolsQuery);

  const list = [...customers].sort(byName);
  const active = list.filter((c) => c.status === "Active");

  return (
    <div className="space-y-4">
      <PageHeader title="Master admin" intro="Every customer, product, person and tool for the whole Sam system." />

      <Section>
        <StatTiles
          tiles={[
            { label: "Customers", value: list.length, to: "/master/customers" },
            { label: "Active", value: active.length, to: "/master/customers" },
            { label: "People with access", value: users.length, to: "/master/users" },
            { label: "Tools in repository", value: tools.length, to: "/master/tools" },
          ]}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/master/customers" className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gold px-4 text-[15px] font-semibold text-gold-foreground">
            <Plus className="h-5 w-5" /> New customer
          </Link>
          <Link to="/master/users" className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-secondary px-4 text-[15px] font-semibold">
            <Users className="h-5 w-5" /> Add people
          </Link>
          <Link to="/master/tools" className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-secondary px-4 text-[15px] font-semibold">
            <Wrench className="h-5 w-5" /> Tools
          </Link>
        </div>
      </Section>

      <Section
        title="Customers"
        action={
          <Link to="/master/customers" className="inline-flex items-center gap-1 text-[15px] font-semibold text-gold">
            All <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-xl bg-background/40" />
        ) : list.length ? (
          <ul className="space-y-2">
            {list.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link to="/master/customers/$customerId" params={{ customerId: c.id }} className="block rounded-xl bg-background/40 p-3 transition hover:ring-2 hover:ring-gold">
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold">
                        {c.name}
                        {c.code ? <span className="text-muted-foreground"> · {c.code}</span> : null}
                      </span>
                      <span className="mt-1 block">{<ProductChips keys={c.products || []} max={3} />}</span>
                    </span>
                    <StatusChip status={c.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyLine>
            No customers yet.{" "}
            <Link to="/master/customers" className="text-gold underline">
              Create the first one
            </Link>
            .
          </EmptyLine>
        )}
      </Section>

      <Section title="Programs across all customers" subtitle="On or off per customer, with average progress.">
        <div className="grid gap-2 sm:grid-cols-2">
          {ALL_PRODUCTS.map((p) => {
            const using = list.filter((c) => (c.products || []).includes(p.key));
            const avg = using.length
              ? Math.round(using.reduce((n, c) => n + (averageProgress(c, [p.key]) ?? 0), 0) / using.length)
              : null;
            return (
              <div key={p.key} className="rounded-xl bg-background/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[15px] font-semibold">{p.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[13px] ${p.status === "later" ? "bg-card text-muted-foreground" : "bg-gold text-gold-foreground"}`}>
                    {p.status === "later" ? "Later" : "Available"}
                  </span>
                </div>
                <p className="text-[14px] text-muted-foreground">{using.length} customers</p>
                {avg !== null ? (
                  <div className="mt-2">
                    <ProgressBar value={avg} label="Average progress" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Central tools" subtitle="Update a tool once and every course using it updates.">
        {tools.length ? (
          <ul className="space-y-2">
            {[...tools].slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center gap-2 rounded-xl bg-background/40 p-3">
                <Building2 className="h-4 w-4 shrink-0 text-gold" />
                <span className="min-w-0 flex-1 text-[15px]">{t.title}</span>
                <span className="text-[14px] text-muted-foreground">{(t.assigned_products || []).length} assigned</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyLine>No tools yet. Upload handbooks, agendas and coaching cards once, then assign them to courses.</EmptyLine>
        )}
      </Section>
    </div>
  );
}