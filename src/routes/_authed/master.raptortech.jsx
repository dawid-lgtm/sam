import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users } from "lucide-react";
import { appUsersQuery, customersQuery } from "@/lib/masterQueries";
import { isRaptortech } from "@/lib/teams";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section } from "@/components/ui-kit/Section";
import { KeyDates } from "@/components/master/KeyDates";
import { SafetyTasksCard } from "@/components/master/SafetyTasksCard";
import { FourBlockCard } from "@/components/master/FourBlockCard";
import { TeamProgressCard } from "@/components/master/TeamProgressCard";

export const Route = createFileRoute("/_authed/master/raptortech")({
  component: RaptortechTeam,
  head: () => ({ meta: [{ title: "Sam — Raptortech team" }] }),
});

function RaptortechTeam() {
  const { user } = Route.useRouteContext();
  const { data: customers = [], isLoading } = useQuery(customersQuery);
  const { data: users = [] } = useQuery(appUsersQuery);

  const mine = customers.filter(isRaptortech);
  const activeCustomers = mine.filter((c) => c.status === "Active");
  const activeIds = new Set(activeCustomers.map((c) => c.id));
  const participants = users.filter((u) => u.customer_id && activeIds.has(u.customer_id)).length;

  const keyDates = mine
    .filter((c) => c.start_date)
    .map((c) => ({ id: c.id, date: c.start_date, label: `${c.name} starts` }));

  const customerIds = mine.map((c) => c.id);
  const name = user?.full_name?.trim().split(" ")[0] || user?.email?.split("@")[0] || "";

  return (
    <div className="space-y-2.5">
      <PageHeader
        title={`Hello${name ? `, ${name}` : ""}`}
        intro="Raptortech team · the customers your team delivers and the dates that matter."
        brand
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/master/customers" className="sam-glass p-3 transition hover:ring-2 hover:ring-gold">
          <Building2 className="h-3.5 w-3.5 text-gold" />
          <p className="mt-1 font-heading text-[18px] font-semibold leading-none">{isLoading ? "—" : activeCustomers.length}</p>
          <p className="mt-1 text-[12px] font-semibold">Active customers</p>
          <p className="text-[11px] text-muted-foreground">{mine.length} in total · your team's customers</p>
        </Link>

        <Link to="/master/customers" className="sam-glass p-3 transition hover:ring-2 hover:ring-gold">
          <Users className="h-3.5 w-3.5 text-gold" />
          <p className="mt-1 font-heading text-[18px] font-semibold leading-none">{participants}</p>
          <p className="mt-1 text-[12px] font-semibold">Active participants</p>
          <p className="text-[11px] text-muted-foreground">People with access to an active customer</p>
        </Link>
      </div>

      <div className="grid gap-2.5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Key dates" subtitle="Customer start dates, month by month.">
            <KeyDates dates={keyDates} />
          </Section>
        </div>
        <div className="space-y-2.5">
          <SafetyTasksCard customerIds={customerIds} />
          <FourBlockCard customerIds={customerIds} />
        </div>
      </div>

      <TeamProgressCard customers={mine} />
    </div>
  );
}