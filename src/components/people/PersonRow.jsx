import { useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { ACCESS_LABELS } from "@/lib/access";
import { SelectField, PrimaryButton } from "@/components/ui-kit/controls";

export function PersonRow({ person, sites, onSaved }) {
  const [access, setAccess] = useState(person.access || "");
  const [siteId, setSiteId] = useState(person.site_id || "");
  const [saving, setSaving] = useState(false);

  // Site staff must sit on a site from the setup; a super admin does not work one.
  const missingSite = person.role !== "admin" && !siteId;

  const save = async () => {
    if (missingSite) {
      toast.error("Choose the site this person works at.");
      return;
    }
    setSaving(true);
    try {
      await base44.entities.User.update(person.id, { access, site_id: siteId || "" });
      toast.success(`${person.full_name || person.email} updated`);
      onSaved();
    } catch {
      toast.error("Could not update this person.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl bg-background/40 p-3.5">
      <p className="text-[16px] font-medium text-foreground">{person.full_name || person.email}</p>
      <p className="text-[15px] leading-snug text-muted-foreground">
        {person.email} · {person.role === "admin" ? "app administrator" : "app user"}
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <SelectField
          label="Access"
          placeholder="Not set"
          value={access}
          onChange={(e) => setAccess(e.target.value)}
          options={Object.entries(ACCESS_LABELS).map(([value, label]) => ({ value, label }))}
        />
        <SelectField
          label="Site"
          hint={missingSite ? "Required before this person can be saved." : undefined}
          placeholder="Choose their site"
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          options={sites.map((s) => ({ value: s.id, label: s.name }))}
        />
      </div>
      <PrimaryButton className="mt-2 w-full" onClick={save} disabled={saving || missingSite}>
        {saving ? "Saving…" : missingSite ? "Choose their site first" : "Save"}
      </PrimaryButton>
    </div>
  );
}