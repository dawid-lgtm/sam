import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useRefreshSam } from "@/lib/useSamData";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { TextField, TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

const blank = { what: "", delivers_tactic: "", who: "", where: "", when: "" };

export function PlanSection({ site, plans, tactics, canEdit }) {
  const refresh = useRefreshSam();
  const [editor, setEditor] = useState(null);
  const atLimit = plans.length >= 6;

  const save = async () => {
    if (!editor.what?.trim()) return toast.error("Write the plan first");
    const payload = {
      what: editor.what.trim(),
      delivers_tactic: editor.delivers_tactic || "",
      who: editor.who || "",
      where: editor.where || "",
      when: editor.when || "",
    };
    if (editor.id) await base44.entities.Plan.update(editor.id, payload);
    else
      await base44.entities.Plan.create({
        ...payload,
        code: `P${plans.length + 1}`,
        site_id: site.id,
        site_name: site.name,
        sort: 99,
        is_test: true,
      });
    refresh();
    setEditor(null);
    toast.success("Plan saved");
  };

  const remove = async (id) => {
    await base44.entities.Plan.delete(id);
    refresh();
  };

  return (
    <Section
      title="Plans"
      subtitle={`${plans.length} of 6. A plan says what, who, where and when.`}
      action={
        canEdit ? (
          <button
            onClick={() => !atLimit && setEditor({ ...blank })}
            disabled={atLimit}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-border px-3 text-[13px] font-semibold text-navy disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        ) : null
      }
    >
      <div className="space-y-2.5">
        {plans.length ? (
          plans.map((p) => (
            <div key={p.id} className="rounded-xl border border-border p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] font-medium leading-snug text-navy">
                  <span className="mr-1.5 rounded bg-secondary px-1.5 py-0.5 text-[11px] font-bold">{p.code}</span>
                  {p.what}
                </p>
                {canEdit ? (
                  <div className="flex shrink-0">
                    <button onClick={() => setEditor(p)} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(p.id)} aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Delivers {p.delivers_tactic || "—"} · {p.who || "no owner"} · {p.where || "no place"} · {p.when || "no date"}
              </p>
            </div>
          ))
        ) : (
          <EmptyLine>No plans yet.</EmptyLine>
        )}
      </div>

      <Modal open={!!editor} onClose={() => setEditor(null)} title={editor?.id ? `Edit ${editor.code}` : "Add plan"}>
        {editor ? (
          <div className="space-y-3">
            <TextAreaField label="What" rows={2} value={editor.what || ""} onChange={(e) => setEditor({ ...editor, what: e.target.value })} />
            <SelectField
              label="Delivers tactic"
              placeholder="Choose"
              value={editor.delivers_tactic || ""}
              onChange={(e) => setEditor({ ...editor, delivers_tactic: e.target.value })}
              options={tactics.map((t) => ({ value: t.code, label: `${t.code} — ${t.approach}` }))}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <TextField label="Who" value={editor.who || ""} onChange={(e) => setEditor({ ...editor, who: e.target.value })} />
              <TextField label="Where" value={editor.where || ""} onChange={(e) => setEditor({ ...editor, where: e.target.value })} />
              <TextField label="When" value={editor.when || ""} onChange={(e) => setEditor({ ...editor, when: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <GhostButton className="flex-1" onClick={() => setEditor(null)}>Cancel</GhostButton>
              <PrimaryButton className="flex-1" onClick={save}>Save plan</PrimaryButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}