import { useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useRefreshSam } from "@/lib/useSamData";
import { withWords } from "@/lib/labels";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { TextField, TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

const blank = { approach: "", delivers_strategy: "", owner: "", not_working_trigger: "", review_date: "", deliver_month: "" };

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
      deliver_month: editor.deliver_month || "",
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
            className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl bg-secondary px-3.5 text-[15px] font-semibold text-foreground disabled:opacity-40"
          >
            <Plus className="h-5 w-5" /> Add
          </button>
        ) : null
      }
    >
      <div className="space-y-2.5">
        {tactics.length ? (
          tactics.map((t) => {
            const strategy = strategies.find((s) => s.code === t.delivers_strategy);
            return (
              <div key={t.id} className="rounded-xl bg-background/40 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[15px] font-medium leading-snug text-foreground">
                    <span className="mr-1.5 inline-flex rounded bg-gold px-1.5 py-0.5 text-[15px] font-semibold text-gold-foreground">
                      {t.code}
                    </span>
                    {t.approach}
                  </p>
                  {canEdit ? (
                    <div className="flex shrink-0">
                      <button
                        onClick={() => setEditor(t)}
                        aria-label="Edit"
                        className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground hover:bg-card hover:text-foreground"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        aria-label="Delete"
                        className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground hover:bg-card hover:text-foreground"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ) : null}
                </div>
                <p className="mt-1.5 text-[15px] leading-snug text-muted-foreground">
                  Delivers {withWords(t.delivers_strategy, strategy?.statement, 6)} · {t.owner || "no owner"}
                  {t.review_date ? ` · review ${t.review_date}` : ""}
                  {t.deliver_month ? ` · by ${moment.utc(`${t.deliver_month}-01`).format("MMMM YYYY")}` : ""}
                </p>
                {t.not_working_trigger ? (
                  <p className="mt-1.5 rounded-lg bg-background/60 px-3 py-2 text-[15px] leading-snug text-foreground">
                    Not working if: {t.not_working_trigger}
                  </p>
                ) : null}
              </div>
            );
          })
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
              options={strategies.map((s) => ({ value: s.code, label: `${s.code} · ${s.statement}` }))}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Owner" value={editor.owner || ""} onChange={(e) => setEditor({ ...editor, owner: e.target.value })} />
              <TextField label="90-day review" type="date" value={editor.review_date || ""} onChange={(e) => setEditor({ ...editor, review_date: e.target.value })} />
              <TextField
                label="Complete by month"
                hint="When only the month is known."
                type="month"
                value={editor.deliver_month || ""}
                onChange={(e) => setEditor({ ...editor, deliver_month: e.target.value })}
              />
            </div>
            <TextAreaField
              label="The trigger that says it is not working"
              rows={2}
              value={editor.not_working_trigger || ""}
              onChange={(e) => setEditor({ ...editor, not_working_trigger: e.target.value })}
            />
            <div className="flex gap-2">
              <GhostButton className="flex-1" onClick={() => setEditor(null)}>
                Cancel
              </GhostButton>
              <PrimaryButton className="flex-1" onClick={save}>
                Save tactic
              </PrimaryButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}