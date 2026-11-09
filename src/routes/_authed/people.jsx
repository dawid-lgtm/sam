import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useSamData } from "@/lib/useSamData";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { PersonRow } from "@/components/people/PersonRow";

export const Route = createFileRoute("/_authed/people")({
  component: People,
  head: () => ({ meta: [{ title: "Sam — People and access" }] }),
});

function People() {
  const { user } = Route.useRouteContext();
  const { data } = useSamData();
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["app-users"],
    queryFn: () => base44.entities.User.list(),
    enabled: user?.role === "admin",
  });

  if (user?.role !== "admin") {
    return <EmptyLine>Only an app administrator can set people's access.</EmptyLine>;
  }

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader eyebrow="Access" title="People" intro="Everyone signed in sees the strategy. Access decides who can change what." />
      <Section title="App users" subtitle="Site roles can only change their own site's tactics, plans, actions and tracker.">
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-xl bg-secondary" />
        ) : users?.length ? (
          <div className="space-y-2.5">
            {users.map((person) => (
              <PersonRow key={person.id} person={person} sites={data?.sites || []} onSaved={refetch} />
            ))}
          </div>
        ) : (
          <EmptyLine>No one else has joined yet. Invite them from App Users in the dashboard.</EmptyLine>
        )}
      </Section>
    </div>
  );
}