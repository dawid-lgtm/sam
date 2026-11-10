import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles } from "lucide-react";
import { getAdminSummary } from "@/lib/master-fns";
import { ALL_PRODUCTS, CUSTOMER_STATUSES } from "@/lib/products";
import { appUsersQuery, averageProgress, byName, customersQuery, toolsQuery } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { PrimaryButton } from "@/components/ui-kit/controls";
import { StatTiles, StatusChip } from "@/components/master/bits";

export const Route = createFileRoute("/_authed/master/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Sam — Reports and stats" }] }),
});

const GOLD = "#e2ad2f";
const PALE = "#8fa2bd";
const NAVY = "#22344f";
const STATUS_COLORS = [PALE, GOLD, "#3f8f5f", NAVY];

function ReportsPage() {
  const { data: customers = [] } = useQuery(customersQuery);
  const { data: users = [] } = useQuery(appUsersQuery);
  const { data: tools = [] } = useQuery(toolsQuery);
  const runSummary = useServerFn(getAdminSummary);
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);

  const list = [...customers].sort(byName);
  const active = list.filter((c) => c.status === "Active");
  const adoption = ALL_PRODUCTS.map((p) => ({
    name: p.name,
    customers: list.filter((c) => (c.products || []).includes(p.key)).length,
  }));
  const statuses = CUSTOMER_STATUSES.map((s) => ({ name: s, count: list.filter((c) => c.status === s).length }));

  const summarise = async () => {
    setBusy(true);
    try {
      const text = await runSummary({
        data: {
          customers: list.length,
          activeCustomers: active.length,
          users: users.length,
          tools: tools.length,
          products: ALL_PRODUCTS.map((p) => {
            const using = list.filter((c) => (c.products || []).includes(p.key));
            const avg = using.length
              ? using.reduce((n, c) => n + (averageProgress(c, [p.key]) ?? 0), 0) / using.length
              : 0;
            return { name: p.name, customers: using.length, progress: avg };
          }),
          statuses,
        },
      });
      setSummary(String(text || ""));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Reports and stats" intro="The whole customer base at a glance, down to each customer and program." />

      <Section>
        <StatTiles
          tiles={[
            { label: "Customers", value: list.length },
            { label: "Active customers", value: active.length },
            { label: "People with access", value: users.length },
            { label: "Tools in use", value: tools.length },
          ]}
        />
      </Section>

      <Section title="AI summary" subtitle="A short read-out of where the business stands.">
        {summary ? (
          <div className="whitespace-pre-wrap rounded-xl bg-background/40 p-3 text-[15px] leading-relaxed">{summary}</div>
        ) : (
          <EmptyLine>Ask for a summary of customers, adoption and progress.</EmptyLine>
        )}
        <PrimaryButton className="mt-3 w-full" onClick={summarise} disabled={busy || !list.length}>
          <Sparkles className="h-5 w-5" />
          {busy ? "Reading the numbers…" : "Write the summary"}
        </PrimaryButton>
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Customers by status">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statuses} dataKey="count" nameKey="name" outerRadius={80} label={(d) => `${d.name} ${d.count}`}>
                  {statuses.map((entry, index) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: NAVY, border: "none", borderRadius: 12, color: "#eef2f8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Product adoption" subtitle="How many customers have each product on.">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adoption} layout="vertical" margin={{ left: 0, right: 12 }}>
                <XAxis type="number" allowDecimals={false} stroke="#c9d3e3" fontSize={13} />
                <YAxis type="category" dataKey="name" width={110} stroke="#c9d3e3" fontSize={12} />
                <Tooltip contentStyle={{ background: NAVY, border: "none", borderRadius: 12, color: "#eef2f8" }} />
                <Bar dataKey="customers" fill={GOLD} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <Section title="Every customer" subtitle="Drill into a customer for its people, products and tools.">
        {list.length ? (
          <div className="space-y-2">
            {list.map((c) => (
              <div key={c.id} className="rounded-xl bg-background/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <Link to="/master/customers/$customerId" params={{ customerId: c.id }} className="min-w-0 truncate text-[15px] font-semibold">
                    {c.name}
                  </Link>
                  <StatusChip status={c.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-muted-foreground">
                  <span>{(c.products || []).length} products</span>
                  <span>{users.filter((u) => u.customer_id === c.id).length} people</span>
                  <span>
                    {tools.filter((t) => (t.assigned_products || []).some((k) => (c.products || []).includes(k))).length} tools available
                  </span>
                  <span>average progress {averageProgress(c, c.products || []) ?? 0}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyLine>No customers yet, so there is nothing to report.</EmptyLine>
        )}
      </Section>
    </div>
  );
}