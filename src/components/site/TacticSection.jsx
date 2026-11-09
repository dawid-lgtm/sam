import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useRefreshSam } from "@/lib/useSamData";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { TextField, TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

const blank = { approach: "", delivers_strategy: "", owner: "", not_working_trigger: "", review_date: "" };

export function TacticSection({ site, tactics, strategies, canEdit }) {
  const refresh = useRefreshSam();
  const [editor, setEditor] = useState(null);
  const atLimit = tactics.length >= 6;

  const save = async () => {
    if (!editor.approach?.trim()) return toast.error("Write the approach first");
    const payload = {
      approach: editor.approach.trim(),
      delivers_strategy: editor.delivers_strategy || "",
      owner: editor.owner || "",
      not_working_trigger: editor.not_working_trigger || "",
      review_date: editor.review_date || "",
    };
    if (editor.id) await base44.entities.Tactic.update(editor.id, payload);
    else
      await base44.entities.Tactic.create({
        ...payload,
        code: `T${tactics.length + 1}`,
        site_id: site.id,
        site_name: site.name,
        sort: 99,
        is_test: true,
      });
    refresh();
    setEditor(null);
    toast.success("Tactic saved");
  };

  const remove = async (id) => {
    await base44.entities.Tactic.delete(id);
    refresh();
  };

  return (
    <Section
      title="Tactics"
      subtitle={`${tactics.length} of 6. Each tactic delivers a strategy.`}
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
        {tactics.length ? (
          tactics.map((t) => (
            <div key={t.id} className="rounded-xl border border-border p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] font-medium leading-snug text-navy">
                  <span className="mr-1.5 rounded bg-secondary px-1.5 py-0.5 text-[11px] font-bold">{t.code}</span>
                  {t.approach}
                </p>
                {canEdit ? (
                  <div className="flex shrink-0">
                    <button onClick={() => setEditor(t)} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(t.id)} aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Delivers {t.delivers_strategy || "—"} · {t.owner || "no owner"}
                {t.review_date ? ` · review ${t.review_date}` : ""}
              </p>
              {t.not_working_trigger ? (
                <p className="mt-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-900">
                  Not working if: {t.not_working_trigger}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <EmptyLine>No tactics yet.</EmptyLine>
        )}
      </div>

      <Modal open={!!editor} onClose={() => setEditor(null)} title={editor?.id ? `Edit ${editor.code}` : "Add tactic"}>
        {editor ? (
          <div className="space-y-3">
            <TextAreaField label="The approach" rows={3} value={editor.approach || ""} onChange={(e) => setEditor({ ...editor, approach: e.target.value })} />
            <SelectField
              label="Delivers strategy"
              placeholder="Choose"
              value={editor.delivers_strategy || ""}
              onChange={(e) => setEditor({ ...editor, delivers_strategy: e.target.value })}
              options={strategies.map((s) => ({ value: s.code, label: `${s.code} — ${s.statement}` }))}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Owner" value={editor.owner || ""} onChange={(e) => setEditor({ ...editor, owner: e.target.value })} />
              <TextField label="90-day review" type="date" value={editor.review_date || ""} onChange={(e) => setEditor({ ...editor, review_date: e.target.value })} />
            </div>
            <TextAreaField
              label="The trigger that says it is not working"
              rows={2}
              value={editor.not_working_trigger || ""}
              onChange={(e) => setEditor({ ...editor, not_working_trigger: e.target.value })}
            />
            <div className="flex gap-2">
              <GhostButton className="flex-1" onClick={() => setEditor(null)}>Cancel</GhostButton>
              <PrimaryButton className="flex-1" onClick={save}>Save tactic</PrimaryButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}