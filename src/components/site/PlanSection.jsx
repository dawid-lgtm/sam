import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useRefreshSam } from "@/lib/useSamData";
import { withWords } from "@/lib/labels";
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
            className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl bg-secondary px-3.5 text-[15px] font-semibold text-foreground disabled:opacity-40"
          >
            <Plus className="h-5 w-5" /> Add
          </button>
        ) : null
      }
    >
      <div className="space-y-2.5">
        {plans.length ? (
          plans.map((p) => {
            const tactic = tactics.find((t) => t.code === p.delivers_tactic);
            return (
              <div key={p.id} className="rounded-xl bg-background/40 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[15px] font-medium leading-snug text-foreground">
                    <span className="mr-1.5 inline-flex rounded bg-gold px-1.5 py-0.5 text-[15px] font-semibold text-gold-foreground">
                      {p.code}
                    </span>
                    {p.what}
                  </p>
                  {canEdit ? (
                    <div className="flex shrink-0">
                      <button
                        onClick={() => setEditor(p)}
                        aria-label="Edit"
                        className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground hover:bg-card hover:text-foreground"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        aria-label="Delete"
                        className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground hover:bg-card hover:text-foreground"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ) : null}
                </div>
                <p className="mt-1.5 text-[15px] leading-snug text-muted-foreground">
                  Delivers {withWords(p.delivers_tactic, tactic?.approach, 5)} · {p.who || "no owner"} ·{" "}
                  {p.where || "no place"} · {p.when || "no date"}
                </p>
              </div>
            );
          })
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
              options={tactics.map((t) => ({ value: t.code, label: `${t.code} · ${t.approach}` }))}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <TextField label="Who" value={editor.who || ""} onChange={(e) => setEditor({ ...editor, who: e.target.value })} />
              <TextField label="Where" value={editor.where || ""} onChange={(e) => setEditor({ ...editor, where: e.target.value })} />
              <TextField label="When" value={editor.when || ""} onChange={(e) => setEditor({ ...editor, when: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <GhostButton className="flex-1" onClick={() => setEditor(null)}>
                Cancel
              </GhostButton>
              <PrimaryButton className="flex-1" onClick={save}>
                Save plan
              </PrimaryButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}