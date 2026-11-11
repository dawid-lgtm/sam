import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { byName, customersQuery } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { StatusChip } from "@/components/master/bits";
import { ProgramDesigner } from "@/components/master/ProgramDesigner";

export const Route = createFileRoute("/_authed/master/programs")({
  component: ProgramDesign,
  head: () => ({ meta: [{ title: "Sam — Program design" }] }),
});

function ProgramDesign() {
  const queryClient = useQueryClient();
  const { data: customers = [], isLoading } = useQuery(customersQuery);
  const [selectedId, setSelectedId] = useState("");
  const [saving, setSaving] = useState(false);

  const list = [...customers].sort(byName);
  const customer = list.find((c) => c.id === selectedId) || list[0] || null;

  const save = async (products) => {
    if (!customer) return;
    setSaving(true);
    try {
      await base44.entities.Customer.update(customer.id, { products });
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Program design"
        intro="Drag program cards onto a customer to design what they run, and in what order."
      />

      <Section title="Designing for" subtitle="Pick the customer, then drag their cards into place.">
        {isLoading ? (
          <div className="h-16 animate-pulse rounded-xl bg-background/40" />
        ) : list.length ? (
          <div className="flex flex-wrap gap-2">
            {list.map((c) => {
              const on = customer?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  aria-pressed={on}
                  className={`inline-flex min-h-[48px] items-center gap-2 rounded-xl px-3 text-[15px] font-semibold transition ${
                    on ? "bg-gold text-gold-foreground" : "bg-background/40"
                  }`}
                >
                  {c.name}
                  <StatusChip status={c.status} />
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyLine>No customers yet. Create a customer first, then design their program.</EmptyLine>
        )}
      </Section>

      {list.length ? (
        <Section>
          <ProgramDesigner customer={customer} saving={saving} onSave={save} />
        </Section>
      ) : null}
    </div>
  );
}