import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { fourBlockDaysQuery, byName } from "@/lib/masterQueries";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { PrimaryButton, GhostButton, TextField, SelectField } from "@/components/ui-kit/controls";

const ROLES = [
  { value: "Supervisor", label: "Supervisor" },
  { value: "Superintendent", label: "Superintendent" },
];

export function FourBlockLog({ customers = [] }) {
  const queryClient = useQueryClient();
  const { data: days = [] } = useQuery(fourBlockDaysQuery);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["four-block-days"] }).then(() => queryClient.invalidateQueries({ queryKey: ["four-block-counts"] }));

  const save = async () => {
    if (!form?.person_name?.trim()) return;
    setSaving(true);
    try {
      const customer = customers.find((c) => c.id === form.customer_id);
      await base44.entities.FourBlockDay.create({
        person_name: form.person_name.trim(),
        role: form.role || "Supervisor",
        customer_id: form.customer_id || "",
        customer_name: customer?.name || "",
        site_name: form.site_name || "",
        date: form.date || format(new Date(), "yyyy-MM-dd"),
        blocks: 4,
      });
      setForm(null);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (day) => {
    await base44.entities.FourBlockDay.delete(day.id);
    await refresh();
  };

  const customerOptions = [...customers].sort(byName).map((c) => ({ value: c.id, label: c.name }));
  const recent = [...days].sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 25);

  return (
    <Section
      title="Four-block days"
      subtitle="One full shift worked in four blocks counts as one. Supervisors and superintendents logged separately."
      action={
        <PrimaryButton onClick={() => setForm({ person_name: "", role: "Supervisor", customer_id: "", site_name: "", date: format(new Date(), "yyyy-MM-dd") })}>
          <Plus className="h-5 w-5" /> Log
        </PrimaryButton>
      }
    >
      {recent.length ? (
        <div className="space-y-1">
          {recent.map((day) => (
            <div key={day.id} className="flex items-center justify-between gap-2 rounded-lg bg-background/40 px-2 py-1.5">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{day.person_name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {[day.role, day.customer_name, day.site_name, day.date ? format(new Date(`${String(day.date).slice(0, 10)}T00:00:00`), "d MMM") : ""]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <button onClick={() => remove(day)} aria-label="Delete day" className="shrink-0 rounded-lg bg-secondary p-1.5">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyLine>No completed four-block days yet. Log the first one.</EmptyLine>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title="Log a four-block day">
        {form ? (
          <div className="space-y-3">
            <TextField label="Person" value={form.person_name} onChange={(e) => setForm({ ...form, person_name: e.target.value })} placeholder="Name" />
            <SelectField label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} options={ROLES} />
            <SelectField
              label="Customer"
              placeholder="Choose a customer"
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              options={customerOptions}
            />
            <TextField label="Site" value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} placeholder="Site name" />
            <TextField label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <div className="flex gap-2">
              <PrimaryButton onClick={save} disabled={saving || !form.person_name.trim()}>
                {saving ? "Saving…" : "Log day"}
              </PrimaryButton>
              <GhostButton onClick={() => setForm(null)}>Cancel</GhostButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}