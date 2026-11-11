import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CUSTOMER_STATUSES } from "@/lib/products";
import { useProducts } from "@/lib/catalog";
import { Image } from "@/components/ui/image";
import { TextField, TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";
import { ProductPicker } from "@/components/master/ProductPicker";

const BLANK = {
  name: "",
  code: "",
  status: "Prospect",
  products: [],
  contact_name: "",
  contact_email: "",
  region: "",
  address: "",
  logo_url: "",
  sites: "",
  start_date: "",
  notes: "",
  progress_sam: 0,
  progress_ops: 0,
  progress_maintenance: 0,
  progress_strategy: 0,
};

export function CustomerForm({ customer, saving, onSave, onCancel }) {
  const [form, setForm] = useState(() =>
    customer
      ? {
          ...BLANK,
          ...customer,
          sites: (customer.sites || []).join(", "),
        }
      : BLANK,
  );

  const products = useProducts();
  const [uploading, setUploading] = useState(false);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const pickLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set("logo_url", file_url);
    } finally {
      setUploading(false);
    }
  };
  const progressProducts = products.filter((p) => p.progress_field && form.products.includes(p.key));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = {
      ...form,
      name: form.name.trim(),
      sites: String(form.sites || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    ["progress_sam", "progress_ops", "progress_maintenance", "progress_strategy"].forEach((key) => {
      payload[key] = Math.max(0, Math.min(100, Number(payload[key]) || 0));
    });
    onSave(payload);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <TextField label="Customer name" value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Pilbara Mining Co" />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Code" value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="PIL" />
        <SelectField
          label="Status"
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          options={CUSTOMER_STATUSES.map((s) => ({ value: s, label: s }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Main contact" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
        <TextField label="Contact email" type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Region" value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="WA Goldfields" />
        <TextField label="Start date" type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
      </div>
      <TextField label="Sites" hint="Separate with commas" value={form.sites} onChange={(e) => set("sites", e.target.value)} />
      <TextAreaField label="Address" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, suburb, state, postcode" />

      <div>
        <p className="mb-2 text-[15px] font-medium">Logo</p>
        <div className="flex items-center gap-3">
          {form.logo_url ? (
            <Image src={form.logo_url} alt="Customer logo" className="h-16 w-16 shrink-0 rounded-xl bg-background" />
          ) : (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-background/40 text-[14px] text-muted-foreground">
              None
            </div>
          )}
          <label className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl bg-secondary px-4 text-[15px] font-semibold text-foreground">
            {uploading ? "Uploading…" : form.logo_url ? "Replace logo" : "Upload logo"}
            <input type="file" accept="image/*" className="hidden" onChange={pickLogo} disabled={uploading} />
          </label>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[15px] font-medium">Products they get access to</p>
        <ProductPicker value={form.products} onChange={(products) => set("products", products)} />
      </div>

      {progressProducts.length ? (
        <div>
          <p className="mb-2 text-[15px] font-medium">Product progress (%)</p>
          <div className="grid grid-cols-2 gap-3">
            {progressProducts.map((p) => (
              <TextField
                key={p.key}
                label={p.name}
                type="number"
                min="0"
                max="100"
                value={form[p.progress_field]}
                onChange={(e) => set(p.progress_field, e.target.value)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <TextAreaField label="Notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />

      <div className="flex gap-2">
        <PrimaryButton type="submit" className="flex-1" disabled={saving}>
          {saving ? "Saving…" : customer ? "Save customer" : "Create customer"}
        </PrimaryButton>
        {onCancel ? (
          <GhostButton type="button" onClick={onCancel}>
            Cancel
          </GhostButton>
        ) : null}
      </div>
    </form>
  );
}