import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { appUsersQuery, customersQuery } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { UserRow } from "@/components/master/UserRow";
import { InviteUser } from "@/components/master/InviteUser";
import { BulkUserUpload } from "@/components/master/BulkUserUpload";

export const Route = createFileRoute("/_authed/master/users")({
  component: UsersPage,
  head: () => ({ meta: [{ title: "Sam — Users and roles" }] }),
});

const field = "w-full rounded-xl border border-input bg-background px-3 py-3 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none";

function UsersPage() {
  const { data: users = [], isLoading, refetch } = useQuery(appUsersQuery);
  const { data: customers = [] } = useQuery(customersQuery);
  const [customerFilter, setCustomerFilter] = useState("");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("one");

  const list = users
    .filter((u) => (customerFilter ? u.customer_id === customerFilter : true))
    .filter((u) => `${u.full_name || ""} ${u.email || ""}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <PageHeader title="Users and roles" intro="Invite people, assign them to a customer, and decide who is a super admin." />

      <Section title="Add people">
        <div className="mb-3 grid grid-cols-2 gap-2">
          {[
            { id: "one", label: "One person" },
            { id: "bulk", label: "Bulk upload" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`min-h-[48px] rounded-xl px-3 text-[15px] font-semibold transition ${
                mode === t.id ? "bg-gold text-gold-foreground" : "bg-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {mode === "one" ? (
          <InviteUser customers={customers} onDone={() => refetch()} />
        ) : (
          <BulkUserUpload customers={customers} onDone={() => refetch()} />
        )}
      </Section>

      <Section title={`All people (${users.length})`}>
        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          <select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)} className={field}>
            <option value="">Every customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" className={field} />
        </div>
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-xl bg-background/40" />
        ) : list.length ? (
          <div className="space-y-2">
            {list.map((person) => (
              <UserRow key={person.id} person={person} customers={customers} onSaved={() => refetch()} />
            ))}
          </div>
        ) : (
          <EmptyLine>{users.length ? "No one matches that filter." : "No one has a login yet."}</EmptyLine>
        )}
      </Section>
    </div>
  );
}