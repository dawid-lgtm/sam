import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section } from "@/components/ui-kit/Section";
import { StatTiles } from "@/components/master/bits";
import { RaptortechCustomerCard } from "@/components/master/RaptortechCustomerCard";
import { RaptortechSessions } from "@/components/master/RaptortechSessions";
import { RAPTORTECH_CUSTOMERS, RAPTORTECH_SESSIONS } from "@/lib/raptortechData";

export const Route = createFileRoute("/_authed/master/raptortech")({
  component: RaptortechTeam,
  head: () => ({ meta: [{ title: "Sam — Raptortech team" }] }),
});

function RaptortechTeam() {
  const active = RAPTORTECH_CUSTOMERS.filter((c) => c.status === "Active");
  const people = RAPTORTECH_CUSTOMERS.reduce((sum, c) => sum + c.people, 0);
  const completion = Math.round(
    RAPTORTECH_CUSTOMERS.reduce((sum, c) => sum + c.progress, 0) / RAPTORTECH_CUSTOMERS.length,
  );

  const tiles = [
    { value: RAPTORTECH_CUSTOMERS.length, label: "Raptortech customers", hint: `${active.length} active` },
    { value: people, label: "People in training", hint: "Across every site" },
    { value: `${completion}%`, label: "Average completion", hint: "Program progress" },
    { value: RAPTORTECH_SESSIONS.length, label: "Sessions booked", hint: "Next four weeks" },
  ];

  return (
    <div className="space-y-2.5">
      <PageHeader
        title="Hello, Jean"
        intro="Raptortech team · the customers your team owns and where each one is up to."
        brand
      />

      <Section title="Portfolio" subtitle="Raptortech customers only.">
        <StatTiles tiles={tiles} />
      </Section>

      <div className="grid gap-2.5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Customers" subtitle="Program, people and the next session at each site.">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {RAPTORTECH_CUSTOMERS.map((customer) => (
                <RaptortechCustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          </Section>
        </div>

        <Section title="Coming up" subtitle="Delivery booked for the weeks ahead.">
          <RaptortechSessions sessions={RAPTORTECH_SESSIONS} />
        </Section>
      </div>
    </div>
  );
}