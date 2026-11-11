import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { customersQuery, safetyTasksQuery, byName } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine, Pill } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { PrimaryButton, GhostButton, TextField, SelectField, TextAreaField } from "@/components/ui-kit/controls";

export const Route = createFileRoute("/_authed/master/safety")({
  component: SafetyTasksPage,
  head: () => ({ meta: [{ title: "Sam — Safety tasks" }] }),
});

const EMPTY = { title: "", customer_id: "", site_name: "", owner: "", due_date: "", status: "Open", notes: "" };

function SafetyTasksPage() {
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading } = useQuery(safetyTasksQuery);
  const { data: customers = [] } = useQuery(customersQuery);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const customerOptions = [...customers].sort(byName).map((c) => ({ value: c.id, label: c.name }));

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["safety-tasks"] }).then(() => queryClient.invalidateQueries({ queryKey: ["safety-counts"] }));

  const save = async () => {
    if (!form?.title?.trim()) return;
    setSaving(true);
    try {
      const customer = customers.find((c) => c.id === form.customer_id);
      const payload = {
        title: form.title.trim(),
        customer_id: form.customer_id || "",
        customer_name: customer?.name || "",
        site_name: form.site_name || "",
        owner: form.owner || "",
        due_date: form.due_date || "",
        status: form.status || "Open",
        notes: form.notes || "",
      };
      if (form.id) await base44.entities.SafetyTask.update(form.id, payload);
      else await base44.entities.SafetyTask.create(payload);
      setForm(null);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (task) => {
    await base44.entities.SafetyTask.update(task.id, { status: task.status === "Done" ? "Open" : "Done" });
    await refresh();
  };

  const remove = async (task) => {
    await base44.entities.SafetyTask.delete(task.id);
    await refresh();
  };

  const open = tasks
    .filter((t) => t.status !== "Done")
    .sort((a, b) => String(a.due_date || "9999").localeCompare(String(b.due_date || "9999")));

  const groups = [...customers].sort(byName).map((c) => ({ name: c.name, tasks: open.filter((t) => t.customer_id === c.id) }));
  const unassigned = open.filter((t) => !customers.some((c) => c.id === t.customer_id));

  return (
    <div className="space-y-3">
      <PageHeader title="Safety tasks" intro="Every open safety task across every customer site, in one list." />

      <Section
        action={
          <PrimaryButton onClick={() => setForm({ ...EMPTY })}>
            <Plus className="h-5 w-5" /> New
          </PrimaryButton>
        }
      >
        <p className="text-[13px] text-muted-foreground">
          {open.length} open · {open.filter((t) => t.due_date && t.due_date < today).length} overdue
        </p>
      </Section>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-background/40" />
      ) : open.length ? (
        <div className="space-y-2.5">
          {[...groups, ...(unassigned.length ? [{ name: "No customer", tasks: unassigned }] : [])]
            .filter((g) => g.tasks.length)
            .map((group) => (
              <div key={group.name} className="sam-glass p-2.5">
                <p className="text-[13px] font-semibold">{group.name}</p>
                <div className="mt-1.5 space-y-1">
                  {group.tasks.map((task) => {
                    const overdue = task.due_date && task.due_date < today;
                    return (
                      <div key={task.id} className="rounded-lg bg-background/40 px-2 py-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold leading-snug">{task.title}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {[task.site_name, task.owner, task.due_date ? `due ${format(new Date(`${task.due_date.slice(0, 10)}T00:00:00`), "d MMM")}` : ""]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            {overdue ? <Pill tone="gold">Overdue</Pill> : <Pill>{task.status}</Pill>}
                            <button onClick={() => toggle(task)} className="rounded-lg bg-secondary px-2 py-1 text-[11px] font-semibold">
                              Done
                            </button>
                            <button onClick={() => remove(task)} aria-label="Delete task" className="rounded-lg bg-secondary p-1.5">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <Section>
          <EmptyLine>No open safety tasks. Add the first one.</EmptyLine>
        </Section>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit safety task" : "New safety task"}>
        {form ? (
          <div className="space-y-3">
            <TextField label="Task" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs doing" />
            <SelectField
              label="Customer"
              placeholder="Choose a customer"
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              options={customerOptions}
            />
            <TextField label="Site" value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} placeholder="Site name" />
            <TextField label="Owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="Who owns it" />
            <TextField label="Due" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            <TextAreaField label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="flex gap-2">
              <PrimaryButton onClick={save} disabled={saving || !form.title.trim()}>
                {saving ? "Saving…" : "Save task"}
              </PrimaryButton>
              <GhostButton onClick={() => setForm(null)}>Cancel</GhostButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}