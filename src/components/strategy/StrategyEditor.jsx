import { useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useRefreshSam } from "@/lib/useSamData";
import { notifySaveError } from "@/lib/access";
import { Modal } from "@/components/ui-kit/Modal";
import { TextField, TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

const blank = {
  statement: "",
  objective_code: "",
  owner: "",
  success_metric: "",
  value_volume: "",
  value_dollars: "",
  deliver_date: "",
  deliver_month: "",
  sites: [],
  review_date: "",
};

export function StrategyEditor({ open, onClose, strategy, nextCode, objectives, sites, presetObjective }) {
  const refresh = useRefreshSam();
  const editing = !!strategy;
  const [form, setForm] = useState(strategy || { ...blank, code: nextCode, objective_code: presetObjective || "" });
  const [saving, setSaving] = useState(false);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const toggleSite = (id) =>
    set({ sites: form.sites.includes(id) ? form.sites.filter((s) => s !== id) : [...form.sites, id] });

  const save = async () => {
    if (!form.statement.trim()) return toast.error("Write the strategy first");
    setSaving(true);
    try {
      const payload = {
        statement: form.statement.trim(),
        objective_code: form.objective_code || "",
        owner: form.owner || "",
        success_metric: form.success_metric || "",
        value_volume: form.value_volume || "",
        value_dollars: form.value_dollars || "",
        deliver_date: form.deliver_date || "",
        deliver_month: form.deliver_month || "",
        sites: form.sites || [],
        review_date: form.review_date || "",
      };
      if (editing) {
        await base44.entities.Strategy.update(strategy.id, payload);
      } else {
        await base44.entities.Strategy.create({ ...payload, code: form.code, sort: 99, is_test: true });
      }
      refresh();
      onClose();
      toast.success(editing ? "Strategy saved" : "Strategy added");
    } catch (err) {
      toast.error(notifySaveError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? `Edit ${form.code}` : `Add strategy ${form.code}`}>
      <div className="space-y-3">
        {form.objective_code ? (
          <p className="rounded-xl bg-gold/15 px-3 py-2.5 text-[15px] leading-snug text-foreground">
            <span className="text-muted-foreground">Delivers the Objective: </span>
            {objectives.find((o) => o.code === form.objective_code)?.statement || form.objective_code}
          </p>
        ) : null}
        <TextAreaField
          label="The strategy"
          rows={3}
          value={form.statement}
          onChange={(e) => set({ statement: e.target.value })}
          placeholder="How we will get there"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Serves objective"
            placeholder="Choose"
            value={form.objective_code}
            onChange={(e) => set({ objective_code: e.target.value })}
            options={objectives.map((o) => ({ value: o.code, label: `${o.code} — ${o.statement}` }))}
          />
          <TextField label="Owner (wider leadership team)" value={form.owner} onChange={(e) => set({ owner: e.target.value })} />
          <TextField label="Success metric" value={form.success_metric || ""} onChange={(e) => set({ success_metric: e.target.value })} placeholder="Agreed in Step 2" />
          <TextField label="Value $" value={form.value_dollars} onChange={(e) => set({ value_dollars: e.target.value })} placeholder="e.g. $1.2M a year" />
          <TextField label="Deliver date" type="date" value={form.deliver_date || ""} onChange={(e) => set({ deliver_date: e.target.value })} />
          <TextField
            label="Deliver by month"
            hint="Use when only the month is known — e.g. March 2027."
            type="month"
            value={form.deliver_month || ""}
            onChange={(e) => set({ deliver_month: e.target.value })}
          />
          <TextField label="Value volume" value={form.value_volume} onChange={(e) => set({ value_volume: e.target.value })} placeholder="e.g. 310 truck hours a quarter" />
          <TextField label="90-day review" type="date" value={form.review_date} onChange={(e) => set({ review_date: e.target.value })} />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-foreground">Sites</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {sites.map((s) => {
              const on = (form.sites || []).includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSite(s.id)}
                  className={`min-h-[48px] rounded-xl px-3.5 text-[15px] font-medium transition ${
                    on ? "bg-gold text-gold-foreground" : "bg-background/40 text-foreground"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <GhostButton className="flex-1" onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton className="flex-1" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save strategy"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}