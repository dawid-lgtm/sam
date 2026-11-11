import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useRefreshSam } from "@/lib/useSamData";
import { withWords } from "@/lib/labels";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { TextField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

const blank = { action: "", for_plan: "", owner: "", due: "", done: false };

export function ActionSection({ site, actions, plans, canEdit }) {
  const refresh = useRefreshSam();
  const [editor, setEditor] = useState(null);
  const atLimit = actions.length >= 8;

  const save = async () => {
    if (!editor.action?.trim()) return toast.error("Write the action first");
    if (!editor.due) return toast.error("Add the completion date — every action carries one");
    const payload = {
      action: editor.action.trim(),
      for_plan: editor.for_plan || "",
      owner: editor.owner || "",
      due: editor.due,
      done: !!editor.done,
    };
    if (editor.id) await base44.entities.SiteAction.update(editor.id, payload);
    else
      await base44.entities.SiteAction.create({
        ...payload,
        code: `A${actions.length + 1}`,
        site_id: site.id,
        site_name: site.name,
        sort: 99,
        is_test: true,
      });
    refresh();
    setEditor(null);
    toast.success("Action saved");
  };

  const tick = async (a) => {
    await base44.entities.SiteAction.update(a.id, { done: !a.done });
    refresh();
  };

  const remove = async (id) => {
    await base44.entities.SiteAction.delete(id);
    refresh();
  };

  return (
    <Section
      title="Actions"
      subtitle={`${actions.length} of 8. Tick when it is actually done.`}
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
        {actions.length ? (
          actions.map((a) => {
            const plan = plans.find((p) => p.code === a.for_plan);
            return (
              <div key={a.id} className="flex items-start gap-3 rounded-xl bg-background/40 p-3.5">
                <button
                  onClick={() => canEdit && tick(a)}
                  disabled={!canEdit}
                  aria-label={a.done ? "Mark not done" : "Mark done"}
                  className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl transition ${
                    a.done ? "bg-gold text-gold-foreground" : "border-2 border-muted-foreground text-transparent"
                  }`}
                >
                  <Check className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-[15px] leading-snug ${a.done ? "text-muted-foreground line-through" : "font-medium text-foreground"}`}>
                    <span className="mr-1.5 inline-flex rounded bg-card px-1.5 py-0.5 text-[15px] font-semibold text-foreground no-underline">
                      {a.code}
                    </span>
                    {a.action}
                  </p>
                  <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
                    For {withWords(a.for_plan, plan?.what, 5)} · {a.owner || "no owner"}
                    {a.due ? ` · due ${a.due}` : ""}
                  </p>
                </div>
                {canEdit ? (
                  <div className="flex shrink-0">
                    <button
                      onClick={() => setEditor(a)}
                      aria-label="Edit"
                      className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground hover:bg-card hover:text-foreground"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => remove(a.id)}
                      aria-label="Delete"
                      className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground hover:bg-card hover:text-foreground"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <EmptyLine>No actions yet.</EmptyLine>
        )}
      </div>

      <Modal open={!!editor} onClose={() => setEditor(null)} title={editor?.id ? `Edit ${editor.code}` : "Add action"}>
        {editor ? (
          <div className="space-y-3">
            <TextField label="The action" value={editor.action || ""} onChange={(e) => setEditor({ ...editor, action: e.target.value })} />
            <SelectField
              label="For plan"
              placeholder="Choose"
              value={editor.for_plan || ""}
              onChange={(e) => setEditor({ ...editor, for_plan: e.target.value })}
              options={plans.map((p) => ({ value: p.code, label: `${p.code} · ${p.what}` }))}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Owner" value={editor.owner || ""} onChange={(e) => setEditor({ ...editor, owner: e.target.value })} />
              <TextField
                label="Completion date"
                hint="Required."
                type="date"
                value={editor.due || ""}
                onChange={(e) => setEditor({ ...editor, due: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <GhostButton className="flex-1" onClick={() => setEditor(null)}>
                Cancel
              </GhostButton>
              <PrimaryButton className="flex-1" onClick={save}>
                Save action
              </PrimaryButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}