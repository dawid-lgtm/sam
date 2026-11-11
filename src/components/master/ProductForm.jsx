import { useState } from "react";
import { slugKey } from "@/lib/catalog";
import { PROGRESS_FIELD_OPTIONS } from "@/lib/products";
import { TextField, TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

export function ProductForm({ product, nextSort = 0, saving, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    for_whom: product?.for_whom || "",
    inside: product?.inside || "",
    status: product?.status || "Available",
    progress_field: product?.progress_field || "",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      name: form.name.trim(),
      key: product?.key || slugKey(form.name),
      sort: product?.sort ?? nextSort,
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <TextField
        label="Product name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        required
        placeholder="e.g. Managing Operations"
      />
      <TextAreaField
        label="What it is"
        hint="One sentence, the same words you would say on site."
        rows={3}
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
      />
      <TextAreaField label="For" hint="Who it is built for." rows={2} value={form.for_whom} onChange={(e) => set("for_whom", e.target.value)} />
      <TextAreaField label="Inside" hint="The modules, handbooks and audits it holds." rows={3} value={form.inside} onChange={(e) => set("inside", e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Status"
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          options={[
            { value: "Available", label: "Available" },
            { value: "Later", label: "Later" },
          ]}
        />
        <SelectField
          label="Progress bar"
          value={form.progress_field}
          onChange={(e) => set("progress_field", e.target.value)}
          options={PROGRESS_FIELD_OPTIONS}
        />
      </div>

      <div className="flex gap-2">
        <PrimaryButton type="submit" className="flex-1" disabled={saving}>
          {saving ? "Saving…" : product ? "Save product" : "Create product"}
        </PrimaryButton>
        <GhostButton type="button" onClick={onCancel}>
          Cancel
        </GhostButton>
      </div>
    </form>
  );
}