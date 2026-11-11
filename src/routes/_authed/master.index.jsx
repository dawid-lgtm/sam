import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Building2, Users } from "lucide-react";
import { appUsersQuery, customersQuery } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section } from "@/components/ui-kit/Section";
import { KeyDates } from "@/components/master/KeyDates";
import { SafetyTasksCard } from "@/components/master/SafetyTasksCard";
import { FourBlockCard } from "@/components/master/FourBlockCard";
import { CustomerProgressCard } from "@/components/master/CustomerProgressCard";

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
    <div className="space-y-2.5">
      <PageHeader
        title={`Hello${name ? `, ${name}` : ""}`}
        intro="Master admin · the customers, the people and the dates that matter."
        brand
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/master/customers" className="sam-glass p-3 transition hover:ring-2 hover:ring-gold">
          <Building2 className="h-3.5 w-3.5 text-gold" />
          <p className="mt-1 font-heading text-[18px] font-semibold leading-none">{isLoading ? "—" : activeCustomers.length}</p>
          <p className="mt-1 text-[12px] font-semibold">Active customers</p>
          <p className="text-[11px] text-muted-foreground">{customers.length} in total · open customers</p>
        </Link>

        <Link to="/master/customers" className="sam-glass p-3 transition hover:ring-2 hover:ring-gold">
          <Users className="h-3.5 w-3.5 text-gold" />
          <p className="mt-1 font-heading text-[18px] font-semibold leading-none">{participants}</p>
          <p className="mt-1 text-[12px] font-semibold">Active participants</p>
          <p className="text-[11px] text-muted-foreground">People with access to an active customer</p>
        </Link>
      </div>

      <Link
        to="/master/raptortech"
        title="See the Raptortech team's own dashboard"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gold px-4 text-[15px] font-semibold text-gold-foreground transition active:opacity-90"
      >
        <Briefcase className="h-4 w-4" />
        Raptortech master page
      </Link>

      <div className="grid gap-2.5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Key dates" subtitle="Customer start dates, month by month.">
            <KeyDates dates={keyDates} />
          </Section>
        </div>
        <div className="space-y-2.5">
          <SafetyTasksCard />
          <FourBlockCard />
        </div>
      </div>

      <CustomerProgressCard />
    </div>
  );
}