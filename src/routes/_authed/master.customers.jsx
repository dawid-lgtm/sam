import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Pencil, Plus, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { customersQuery, byName, averageProgress } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { PrimaryButton } from "@/components/ui-kit/controls";
import { CustomerForm } from "@/components/master/CustomerForm";
import { StatusChip, ProductChips } from "@/components/master/bits";

export const Route = createFileRoute("/_authed/master/customers")({
  component: CustomersPage,
  head: () => ({ meta: [{ title: "Sam — Customers" }] }),
});

function CustomersPage() {
  const queryClient = useQueryClient();
  const { data: customers = [], isLoading } = useQuery(customersQuery);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const list = [...customers]
    .sort(byName)
    .filter((c) => `${c.name} ${c.code || ""} ${c.contact_name || ""} ${c.region || ""}`.toLowerCase().includes(search.toLowerCase()));

  const save = async (payload) => {
    setSaving(true);
    try {
      if (editing?.id) await base44.entities.Customer.update(editing.id, payload);
      else await base44.entities.Customer.create(payload);
      setEditing(null);
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Customers" intro="Create a customer, set their status, and choose the products they get." />

      <Section
        action={
          <PrimaryButton onClick={() => setEditing({})}>
            <Plus className="h-5 w-5" /> New
          </PrimaryButton>
        }
      >
        <label className="block">
          <span className="sr-only">Search customers</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers"
              className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-3 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
          </span>
        </label>
      </Section>

      {isLoading ? (
        <div className="h-32 animate-pulse rounded-2xl bg-background/40" />
      ) : list.length ? (
        <div className="space-y-2">
          {list.map((c) => {
            const avg = averageProgress(c, c.products || []);
            return (
              <div key={c.id} className="rounded-2xl bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <Link to="/master/customers/$customerId" params={{ customerId: c.id }} className="min-w-0">
                    <span className="block truncate font-heading text-[18px] font-semibold">
                      {c.name}
                      {c.code ? <span className="text-muted-foreground"> · {c.code}</span> : null}
                    </span>
                    <span className="mt-0.5 block truncate text-[14px] text-muted-foreground">
                      {[c.region, c.contact_name, c.contact_email].filter(Boolean).join(" · ") || "No contact yet"}
                    </span>
                  </Link>
                  <StatusChip status={c.status} />
                </div>
                <div className="mt-2"><ProductChips keys={c.products || []} max={6} /></div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[14px] text-muted-foreground">
                    {c.delivered_by || "No team assigned"} · {avg === null ? "No program progress yet" : `Average progress ${avg}%`}
                  </span>
                  <span className="flex gap-1.5">
                    <button aria-label={`Edit ${c.name}`} onClick={() => setEditing(c)} className="grid h-11 w-11 place-items-center rounded-xl bg-secondary transition hover:ring-2 hover:ring-gold">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <Link
                      to="/master/customers/$customerId"
                      params={{ customerId: c.id }}
                      aria-label={`Open ${c.name}`}
                      className="grid h-11 w-11 place-items-center rounded-xl bg-secondary transition hover:ring-2 hover:ring-gold"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Section>
          <EmptyLine>{search ? "No customer matches that search." : "No customers yet. Create the first one."}</EmptyLine>
        </Section>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit ${editing.name}` : "New customer"}
      >
        <CustomerForm
          customer={editing?.id ? editing : null}
          saving={saving}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <p className="px-1 text-[14px] text-muted-foreground">Saving a customer updates them everywhere in the system.</p>
    </div>
  );
}