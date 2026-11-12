import { useState } from "react";
import { toast } from "sonner";
import { isOffline, saveOffline } from "@/lib/offline";
import { useRefreshSam } from "@/lib/useSamData";
import { isAdministrator, notifySaveError } from "@/lib/access";
import { Modal } from "@/components/ui-kit/Modal";
import { TextField, TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

export function ActionEditor({ open, onClose, action, sites, plans, actions, user }) {
  const refresh = useRefreshSam();
  const admin = isAdministrator(user);
  const editing = !!action?.id;
  const [form, setForm] = useState(
    action || {
      site_id: admin ? sites?.[0]?.id || "" : user?.site_id || "",
      action: "",
      for_plan: "",
      owner: "",
      due: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const site = sites?.find((s) => s.id === form.site_id);
  const sitePlans = (plans || []).filter((p) => p.site_id === form.site_id);

  const save = async () => {
    if (!form.site_id) return toast.error("Choose the site this action belongs to");
    if (!form.action?.trim()) return toast.error("Name the action first");
    if (!form.due) return toast.error("Add the completion date — every action carries one");
    setSaving(true);
    try {
      const payload = {
        action: form.action.trim(),
        for_plan: form.for_plan || "",
        owner: form.owner || "",
        due: form.due,
      };
      if (editing) {
        await saveOffline("SiteAction", "update", { id: action.id, data: payload });
      } else {
        const count = (actions || []).filter((a) => a.site_id === form.site_id).length;
        await saveOffline("SiteAction", "create", {
          data: {
            ...payload,
            code: `A${count + 1}`,
            site_id: form.site_id,
            site_name: site?.name || "",
            done: false,
            sort: 99,
            is_test: true,
          },
        });
      }
      refresh();
      onClose();
      toast.success(
        isOffline() ? "Saved on this device · it will sync" : editing ? "Action changed" : "Action added"
      );
    } catch (err) {
      toast.error(notifySaveError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit the action" : "Add an action"}>
      <div className="space-y-3">
        <SelectField
          label="Site"
          value={form.site_id}
          onChange={(e) => set({ site_id: e.target.value, for_plan: "" })}
          disabled={!admin}
          options={(sites || []).map((s) => ({ value: s.id, label: s.name }))}
        />
        <TextAreaField
          label="The action"
          hint="One job, in plain words. Not a theme."
          rows={2}
          value={form.action}
          onChange={(e) => set({ action: e.target.value })}
          placeholder="e.g. Supervisors sign their block plan before the shift starts"
        />
        <TextField
          label="Completion date"
          hint="Required. The date this is actually finished."
          type="date"
          value={form.due}
          onChange={(e) => set({ due: e.target.value })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField label="Owner" value={form.owner || ""} onChange={(e) => set({ owner: e.target.value })} />
          <SelectField
            label="For plan"
            placeholder={sitePlans.length ? "Choose" : "No plans on this site yet"}
            value={form.for_plan || ""}
            onChange={(e) => set({ for_plan: e.target.value })}
            options={sitePlans.map((p) => ({ value: p.code, label: `${p.code} · ${p.what}` }))}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <GhostButton className="flex-1" onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton className="flex-1" onClick={save} disabled={saving}>
            {saving ? "Saving…" : editing ? "Save action" : "Add action"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}