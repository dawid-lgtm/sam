import { useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { Pencil, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useRefreshSam } from "@/lib/useSamData";
import { notifySaveError } from "@/lib/access";
import { tenantId } from "@/lib/tenant";
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
      const payload = {
        goal_sentence: sentence.trim(),
        goal_repeatable: repeatable,
        goal_changed_by: user?.full_name || user?.email || "",
        goal_changed_date: moment.utc().format("YYYY-MM-DD"),
      };
      if (company?.id) {
        await base44.entities.CompanySetting.update(company.id, payload);
      } else {
        await base44.entities.CompanySetting.create({ company_name: "Your company", customer_id: tenantId(user), ...payload });
      }
      refresh();
      setOpen(false);
      toast.success("Goal saved");
    } catch (err) {
      toast.error(notifySaveError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[15px] font-medium text-foreground">
          <span className="h-4 w-1.5 rounded-full bg-gold" />
          The goal
        </span>
        {canEdit ? (
          <button
            onClick={() => {
              setSentence(company?.goal_sentence || "");
              setRepeatable(!!company?.goal_repeatable);
              setOpen(true);
            }}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-secondary px-3 text-[15px] font-medium text-foreground"
          >
            <Pencil className="h-5 w-5" /> Edit
          </button>
        ) : null}
      </div>

      <p className="font-heading text-[24px] font-semibold leading-[1.25] text-foreground sm:text-[30px]">
        {company?.goal_sentence || "No goal set yet"}
      </p>

      <div className="mt-4 flex items-start gap-2 text-[15px] text-muted-foreground">
        <span
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${
            company?.goal_repeatable ? "bg-gold text-gold-foreground" : "border-2 border-muted-foreground"
          }`}
        >
          {company?.goal_repeatable ? <Check className="h-4 w-4" /> : null}
        </span>
        Could a Superintendent repeat it?
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="The goal">
        <div className="space-y-4">
          <TextAreaField label="One sentence" rows={3} value={sentence} onChange={(e) => setSentence(e.target.value)} />
          <button
            type="button"
            onClick={() => setRepeatable((v) => !v)}
            className="flex w-full items-start gap-3 rounded-xl bg-background/40 p-3 text-left"
          >
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${
                repeatable ? "bg-gold text-gold-foreground" : "border-2 border-muted-foreground"
              }`}
            >
              {repeatable ? <Check className="h-4 w-4" /> : null}
            </span>
            <span className="text-[15px] text-foreground">Could a Superintendent repeat it word for word?</span>
          </button>
          <div className="flex gap-2">
            <GhostButton className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </GhostButton>
            <PrimaryButton className="flex-1" onClick={save} disabled={saving}>
              Save goal
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </section>
  );
}