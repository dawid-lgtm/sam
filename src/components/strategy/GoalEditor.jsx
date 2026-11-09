import { useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { Pencil, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useRefreshSam } from "@/lib/useSamData";
import { Modal } from "@/components/ui-kit/Modal";
import { TextAreaField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

export function GoalEditor({ company, canEdit }) {
  const { user } = useAuth();
  const refresh = useRefreshSam();
  const [open, setOpen] = useState(false);
  const [sentence, setSentence] = useState(company?.goal_sentence || "");
  const [repeatable, setRepeatable] = useState(!!company?.goal_repeatable);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!sentence.trim()) return;
    setSaving(true);
    try {
      await base44.entities.CompanySetting.update(company.id, {
        goal_sentence: sentence.trim(),
        goal_repeatable: repeatable,
        goal_changed_by: user?.full_name || user?.email || "",
        goal_changed_date: moment.utc().format("YYYY-MM-DD"),
      });
      refresh();
      setOpen(false);
      toast.success("Goal saved");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl bg-navy p-5 text-white">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">The goal</p>
        {canEdit ? (
          <button
            onClick={() => {
              setSentence(company?.goal_sentence || "");
              setRepeatable(!!company?.goal_repeatable);
              setOpen(true);
            }}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-white/10 px-3 text-[13px] font-medium"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
        ) : null}
      </div>

      <p className="text-[24px] font-semibold leading-[1.25] sm:text-[30px]">{company?.goal_sentence || "No goal set yet"}</p>

      <div className="mt-4 flex items-start gap-2 text-[13px] text-white/80">
        <span
          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md ${
            company?.goal_repeatable ? "bg-gold text-navy" : "border border-white/30"
          }`}
        >
          {company?.goal_repeatable ? <Check className="h-3.5 w-3.5" /> : null}
        </span>
        Could a Superintendent repeat it?
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="The goal">
        <div className="space-y-4">
          <TextAreaField
            label="One sentence"
            rows={3}
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setRepeatable((v) => !v)}
            className="flex w-full items-start gap-3 rounded-xl border border-border p-3 text-left"
          >
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                repeatable ? "border-navy bg-navy text-white" : "border-input"
              }`}
            >
              {repeatable ? <Check className="h-4 w-4" /> : null}
            </span>
            <span className="text-sm text-navy">Could a Superintendent repeat it word for word?</span>
          </button>
          <div className="flex gap-2">
            <GhostButton className="flex-1" onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton className="flex-1" onClick={save} disabled={saving}>Save goal</PrimaryButton>
          </div>
        </div>
      </Modal>
    </section>
  );
}