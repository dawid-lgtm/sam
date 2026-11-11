import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users } from "lucide-react";
import { appUsersQuery, customersQuery } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section } from "@/components/ui-kit/Section";
import { KeyDates } from "@/components/master/KeyDates";

export const Route = createFileRoute("/_authed/master/")({
  component: MasterHome,
  head: () => ({ meta: [{ title: "Sam — Master admin" }] }),
});

function MasterHome() {
  const { user } = Route.useRouteContext();
  const { data: customers = [], isLoading } = useQuery(customersQuery);
  const { data: users = [] } = useQuery(appUsersQuery);

  const activeCustomers = customers.filter((c) => c.status === "Active");
  const activeIds = new Set(activeCustomers.map((c) => c.id));
  const participants = users.filter((u) => u.customer_id && activeIds.has(u.customer_id)).length;

  const keyDates = customers
    .filter((c) => c.start_date)
    .map((c) => ({ id: c.id, date: c.start_date, label: `${c.name} starts` }));

  const name = user?.full_name?.trim().split(" ")[0] || user?.email?.split("@")[0] || "";

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Hello${name ? `, ${name}` : ""}`}
        intro="Master admin · the customers, the people and the dates that matter."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/master/customers" className="rounded-2xl bg-card p-5 transition hover:ring-2 hover:ring-gold">
          <Building2 className="h-6 w-6 text-gold" />
          <p className="mt-3 font-heading text-[40px] font-semibold leading-none">{isLoading ? "—" : activeCustomers.length}</p>
          <p className="mt-2 text-[16px] font-semibold">Active customers</p>
          <p className="mt-1 text-[14px] text-muted-foreground">{customers.length} in total · open customers</p>
        </Link>

        <Link to="/master/customers" className="rounded-2xl bg-card p-5 transition hover:ring-2 hover:ring-gold">
          <Users className="h-6 w-6 text-gold" />
          <p className="mt-3 font-heading text-[40px] font-semibold leading-none">{participants}</p>
          <p className="mt-2 text-[16px] font-semibold">Active participants</p>
          <p className="mt-1 text-[14px] text-muted-foreground">People with access to an active customer</p>
        </Link>
      </div>

      <Section title="Key dates" subtitle="Customer start dates, month by month.">
        <KeyDates dates={keyDates} />
      </Section>

      <Section title="Go to">
        <div className="grid gap-2 sm:grid-cols-3">
          <Link to="/master/customers" className="rounded-xl bg-background/40 p-3 text-[15px] font-semibold transition hover:ring-2 hover:ring-gold">
            Customers
          </Link>
          <Link to="/master/products" className="rounded-xl bg-background/40 p-3 text-[15px] font-semibold transition hover:ring-2 hover:ring-gold">
            Products
          </Link>
          <Link to="/master/tools" className="rounded-xl bg-background/40 p-3 text-[15px] font-semibold transition hover:ring-2 hover:ring-gold">
            Core materials
          </Link>
        </div>
      </Section>
    </div>
  );
}