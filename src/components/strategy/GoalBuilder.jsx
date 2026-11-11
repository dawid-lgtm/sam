import { useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useRefreshSam } from "@/lib/useSamData";
import { notifySaveError } from "@/lib/access";
import { Modal } from "@/components/ui-kit/Modal";
import { TextAreaField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

const SMART = [
  { key: "s", label: "Specific", hint: "Says who and what changes. Not 'be better'." },
  { key: "m", label: "Measurable", hint: "You could prove it was reached, or prove it was not." },
  { key: "a", label: "Achievable", hint: "Reachable with the crews and capital you actually have." },
  { key: "r", label: "Relevant", hint: "It is what the business is here for, not a side project." },
  { key: "t", label: "Time-bound", hint: "A date, so it can be late." },
];

export function GoalBuilder({ open, onClose, company }) {
  const { user } = useAuth();
  const refresh = useRefreshSam();
  const [sentence, setSentence] = useState(company?.goal_sentence || "");
  const [checks, setChecks] = useState({});
  const [saving, setSaving] = useState(false);

  const toggle = (key) => setChecks((c) => ({ ...c, [key]: !c[key] }));

  const save = async () => {
    if (!sentence.trim()) return toast.error("Write the goal first");
    setSaving(true);
    try {
      const payload = {
        goal_sentence: sentence.trim(),
        goal_repeatable: !!company?.goal_repeatable,
        goal_changed_by: user?.full_name || user?.email || "",
        goal_changed_date: moment.utc().format("YYYY-MM-DD"),
      };
      if (company?.id) {
        await base44.entities.CompanySetting.update(company.id, payload);
      } else {
        await base44.entities.CompanySetting.create({ company_name: "Your company", is_test: true, ...payload });
      }
      refresh();
      onClose();
      toast.success("Goal saved. Build the Objectives under it next.");
    } catch (err) {
      toast.error(notifySaveError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Build the goal">
      <div className="space-y-3">
        <TextAreaField
          label="The goal, in one sentence"
          hint="Where the business is going, in words a supervisor can repeat."
          rows={3}
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder="e.g. Every site runs the same plan, seen the same way, by 2028."
        />

        <p className="text-[15px] font-semibold text-foreground">Check it against SMART</p>
        <div className="space-y-1.5">
          {SMART.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggle(item.key)}
              className="flex w-full items-start gap-3 rounded-xl bg-background/40 p-3 text-left transition"
            >
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${
                  checks[item.key] ? "bg-gold text-gold-foreground" : "border-2 border-muted-foreground"
                }`}
              >
                {checks[item.key] ? <Check className="h-4 w-4" /> : null}
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-foreground">{item.label}</span>
                <span className="block text-[14px] leading-snug text-muted-foreground">{item.hint}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <GhostButton className="flex-1" onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton className="flex-1" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save goal"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}