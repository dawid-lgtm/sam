import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { ACCESS_LABELS } from "@/lib/access";
import { SelectField, PrimaryButton } from "@/components/ui-kit/controls";

export function AccessSetup({ user, sites }) {
  const { refresh } = useAuth();
  const [access, setAccess] = useState("");
  const [siteId, setSiteId] = useState("");
  const [saving, setSaving] = useState(false);

  if (user?.role !== "admin") {
    return (
      <div className="mb-5 rounded-2xl bg-card p-4">
        <p className="text-[16px] font-semibold text-foreground">Your access has not been set yet</p>
        <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
          Ask an administrator to set your role in Sam.
        </p>
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ access, site_id: siteId || "" });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-5 rounded-2xl bg-card p-4">
      <p className="text-[16px] font-semibold text-foreground">Set your access</p>
      <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
        Sam shows the strategy to everyone. Your role decides what you can change.
      </p>
      <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
        Administrators and executives also need app-admin rights on their account before they can save strategy
        changes.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <SelectField
          label="Role"
          placeholder="Choose"
          value={access}
          onChange={(e) => setAccess(e.target.value)}
          options={Object.entries(ACCESS_LABELS).map(([value, label]) => ({ value, label }))}
        />
        <SelectField
          label="Your site (site roles only)"
          placeholder="None"
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          options={sites.map((s) => ({ value: s.id, label: s.name }))}
        />
      </div>
      <PrimaryButton className="mt-3 w-full" disabled={!access || saving} onClick={save}>
        {saving ? "Saving…" : "Save my access"}
      </PrimaryButton>
    </div>
  );
}