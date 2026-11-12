import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import { isOffline, saveOffline } from "@/lib/offline";
import { useRefreshSam } from "@/lib/useSamData";
import { shortWords } from "@/lib/labels";
import { Section, EmptyLine, Pill } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

const blank = { strategy_code: "", objective_code: "", ask: "", can_deliver: true, reason: "", what_it_would_take: "" };

export function AskSection({ site, asks, strategies, canEdit }) {
  const refresh = useRefreshSam();
  const [editor, setEditor] = useState(null);

  const save = async () => {
    if (!editor.ask?.trim()) return toast.error("Write what the strategy asks of this site");
    const payload = {
      strategy_code: editor.strategy_code || "",
      objective_code: editor.objective_code || "",
      ask: editor.ask.trim(),
      can_deliver: !!editor.can_deliver,
      reason: editor.reason || "",
      what_it_would_take: editor.what_it_would_take || "",
    };
    if (editor.id) await saveOffline("SiteAsk", "update", { id: editor.id, data: payload });
    else
      await saveOffline("SiteAsk", "create", {
        data: {
          ...payload,
          site_id: site.id,
          site_name: site.name,
          is_test: true,
        },
      });
    refresh();
    setEditor(null);
    toast.success(isOffline() ? "Saved on this device · it will sync" : "Saved");
  };

  const setStrategy = (code) => {
    const strategy = strategies.find((s) => s.code === code);
    setEditor({ ...editor, strategy_code: code, objective_code: strategy?.objective_code || "" });
  };

  return (
    <Section
      title="What the strategies ask of this site"
      subtitle="Answer honestly. A no with a reason is worth more than a quiet yes."
      action={
        canEdit ? (
          <button
            onClick={() => setEditor({ ...blank })}
            className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl bg-secondary px-3.5 text-[15px] font-semibold text-foreground"
          >
            <Plus className="h-5 w-5" /> Add
          </button>
        ) : null
      }
    >
      <div className="space-y-2.5">
        {asks.length ? (
          asks.map((a) => {
            const strategy = strategies.find((s) => s.code === a.strategy_code);
            return (
              <div key={a.id} className="rounded-xl bg-background/40 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap gap-1.5">
                      <Pill tone="gold">
                        {a.strategy_code ? `${a.strategy_code} · ${shortWords(strategy?.statement, 5)}` : "No strategy chosen"}
                      </Pill>
                      <Pill tone={a.can_deliver ? "neutral" : "outline"}>
                        {a.can_deliver ? "We can deliver" : "We cannot"}
                      </Pill>
                    </div>
                    <p className="text-[15px] leading-snug text-foreground">{a.ask}</p>
                  </div>
                  {canEdit ? (
                    <button
                      onClick={() => setEditor(a)}
                      aria-label="Edit"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-card hover:text-foreground"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  ) : null}
                </div>
                {!a.can_deliver ? (
                  <div className="mt-2 space-y-1.5 rounded-lg bg-background/60 px-3 py-2 text-[15px] leading-snug text-foreground">
                    <p>
                      <span className="font-semibold">Why not: </span>
                      {a.reason || "not given"}
                    </p>
                    <p>
                      <span className="font-semibold">What it would take: </span>
                      {a.what_it_would_take || "not given"}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <EmptyLine>No asks recorded for this site yet.</EmptyLine>
        )}
      </div>

      <Modal open={!!editor} onClose={() => setEditor(null)} title="What the strategy asks">
        {editor ? (
          <div className="space-y-3">
            <SelectField
              label="Strategy"
              placeholder="Choose"
              value={editor.strategy_code || ""}
              onChange={(e) => setStrategy(e.target.value)}
              options={strategies.map((s) => ({ value: s.code, label: `${s.code} · ${s.statement}` }))}
            />
            <TextAreaField label="The ask" rows={2} value={editor.ask || ""} onChange={(e) => setEditor({ ...editor, ask: e.target.value })} />
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setEditor({ ...editor, can_deliver: v })}
                  className={`min-h-[48px] flex-1 rounded-xl text-[15px] font-semibold transition ${
                    editor.can_deliver === v ? "bg-gold text-gold-foreground" : "bg-background/40 text-foreground"
                  }`}
                >
                  {v ? "We can deliver" : "We cannot"}
                </button>
              ))}
            </div>
            {!editor.can_deliver ? (
              <>
                <TextAreaField label="The reason" rows={2} value={editor.reason || ""} onChange={(e) => setEditor({ ...editor, reason: e.target.value })} />
                <TextAreaField
                  label="What it would take"
                  rows={2}
                  value={editor.what_it_would_take || ""}
                  onChange={(e) => setEditor({ ...editor, what_it_would_take: e.target.value })}
                />
              </>
            ) : null}
            <div className="flex gap-2">
              <GhostButton className="flex-1" onClick={() => setEditor(null)}>
                Cancel
              </GhostButton>
              <PrimaryButton className="flex-1" onClick={save}>
                Save
              </PrimaryButton>
            </div>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}