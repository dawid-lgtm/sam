import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { TextField, TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";
import { ProductPicker } from "@/components/master/ProductPicker";

const CATEGORIES = ["Handbook", "Agenda", "Coaching card", "Workbook", "Slide pack", "Other"];
const inputClass =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-[16px] text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-2 file:text-[15px] file:font-semibold file:text-gold-foreground";

export function ToolForm({ tool, saving, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    title: tool?.title || "",
    category: tool?.category || "Handbook",
    summary: tool?.summary || "",
    content: tool?.content || "",
    version: tool?.version || "v1",
    assigned_products: tool?.assigned_products || [],
    file_uri: tool?.file_uri || "",
    file_name: tool?.file_name || "",
  }));
  const [uploading, setUploading] = useState(false);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      setForm((f) => ({ ...f, file_uri, file_name: file.name }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        onSave({ ...form, title: form.title.trim() });
      }}
    >
      <TextField label="Tool name" value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. Superintendent day handbook" />
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Type"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <TextField label="Version" value={form.version} onChange={(e) => set("version", e.target.value)} placeholder="v1" />
      </div>
      <TextField label="One-line summary" value={form.summary} onChange={(e) => set("summary", e.target.value)} />
      <TextAreaField
        label="Online version"
        hint="The text people read inside the app or course."
        rows={5}
        value={form.content}
        onChange={(e) => set("content", e.target.value)}
      />
      <label className="block">
        <span className="text-[15px] font-medium">PDF download</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => upload(e.target.files?.[0])}
          className={inputClass}
        />
        <span className="mt-1 block text-[14px] text-muted-foreground">
          {uploading ? "Uploading…" : form.file_name ? `Uploaded: ${form.file_name} (stored privately)` : "No PDF yet. Stored privately; people open it with a secure link."}
        </span>
      </label>

      <div>
        <p className="mb-2 text-[15px] font-medium">Assign to courses and products</p>
        <ProductPicker value={form.assigned_products} onChange={(v) => set("assigned_products", v)} />
      </div>

      <div className="flex gap-2">
        <PrimaryButton type="submit" className="flex-1" disabled={saving || uploading}>
          {saving ? "Saving…" : tool ? "Save tool" : "Add to repository"}
        </PrimaryButton>
        <GhostButton type="button" onClick={onCancel}>
          Cancel
        </GhostButton>
      </div>
    </form>
  );
}