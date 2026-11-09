import { useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useRefreshSam } from "@/lib/useSamData";
import { notifySaveError } from "@/lib/access";
import { Modal } from "@/components/ui-kit/Modal";
import { TextField, TextAreaField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

const blank = { statement: "", metric: "", target_date: "", exec_owner: "", load_bearing_note: "", progress: 0 };

export function ObjectiveEditor({ open, onClose, objective, nextCode, onSaved }) {
  const { user } = useAuth();
  const refresh = useRefreshSam();
  const editing = !!objective;
  const [form, setForm] = useState(objective || { ...blank, code: nextCode });
  const [step, setStep] = useState("edit");
  const [log, setLog] = useState({ change: "", cause: "", board_approval_date: "" });
  const [saving, setSaving] = useState(false);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setLogField = (patch) => setLog((l) => ({ ...l, ...patch }));

  const close = () => {
    setStep("edit");
    setLog({ change: "", cause: "", board_approval_date: "" });
    onClose();
  };

  const next = () => {
    if (!form.statement.trim()) return toast.error("Write the objective first");
    if (editing) {
      setLog({ ...log, change: log.change || `Objective ${form.code} edited` });
      setStep("log");
    } else {
      submit(true);
    }
  };

  const submit = async (noLog) => {
    if (!noLog && (!log.change.trim() || !log.cause.trim())) {
      return toast.error("The change and the cause are both required");
    }
    setSaving(true);
    try {
      const payload = {
        statement: form.statement.trim(),
        metric: form.metric || "",
        target_date: form.target_date || "",
        exec_owner: form.exec_owner || "",
        load_bearing_note: form.load_bearing_note || "",
        progress: Number(form.progress) || 0,
      };
      if (editing) {
        await base44.entities.ObjectiveChangeLog.create({
          log_date: moment.utc().format("YYYY-MM-DD"),
          objective_code: form.code,
          change: log.change.trim(),
          cause: log.cause.trim(),
          board_approval_date: log.board_approval_date || "",
          logged_by: user?.full_name || user?.email || "",
          is_test: true,
        });
        await base44.entities.Objective.update(objective.id, payload);
      } else {
        await base44.entities.Objective.create({ ...payload, code: form.code, sort: 99, is_test: true });
      }
      refresh();
      onSaved?.();
      close();
      toast.success(editing ? "Objective changed and logged" : "Objective added");
    } catch (err) {
      toast.error(notifySaveError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title={editing ? `Edit ${form.code}` : `Add objective ${form.code}`}>
      {step === "edit" ? (
        <div className="space-y-3">
          <TextAreaField
            label="The objective"
            rows={3}
            value={form.statement}
            onChange={(e) => set({ statement: e.target.value })}
            placeholder="What has to be true"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="The number" value={form.metric} onChange={(e) => set({ metric: e.target.value })} placeholder="e.g. 0 lost-time injuries" />
            <TextField label="By when" type="date" value={form.target_date} onChange={(e) => set({ target_date: e.target.value })} />
            <TextField label="Executive owner" value={form.exec_owner} onChange={(e) => set({ exec_owner: e.target.value })} />
            <TextField label="Progress %" type="number" min="0" max="100" value={form.progress} onChange={(e) => set({ progress: e.target.value })} />
          </div>
          <TextAreaField
            label="Load-bearing note"
            hint="Why the whole goal rests on this one."
            value={form.load_bearing_note}
            onChange={(e) => set({ load_bearing_note: e.target.value })}
          />
          <div className="flex gap-2 pt-1">
            <GhostButton className="flex-1" onClick={close}>Cancel</GhostButton>
            <PrimaryButton className="flex-1" onClick={next} disabled={saving}>
              {editing ? "Continue" : "Add objective"}
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="rounded-xl bg-accent px-3 py-2.5 text-[13px] leading-snug text-[#7a6114]">
            Changing an objective always leaves a change-log entry. It cannot be edited or deleted afterwards.
          </p>
          <TextAreaField label="The change" rows={2} value={log.change} onChange={(e) => setLogField({ change: e.target.value })} />
          <TextAreaField
            label="The cause"
            rows={3}
            value={log.cause}
            onChange={(e) => setLogField({ cause: e.target.value })}
            placeholder="What made this change necessary?"
          />
          <TextField label="Board approval date" type="date" value={log.board_approval_date} onChange={(e) => setLogField({ board_approval_date: e.target.value })} />
          <div className="flex gap-2 pt-1">
            <GhostButton className="flex-1" onClick={() => setStep("edit")}>Back</GhostButton>
            <PrimaryButton className="flex-1" onClick={() => submit(false)} disabled={saving}>
              {saving ? "Saving…" : "Save and log"}
            </PrimaryButton>
          </div>
        </div>
      )}
    </Modal>
  );
}