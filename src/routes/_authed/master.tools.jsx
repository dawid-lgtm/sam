import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useProducts } from "@/lib/catalog";
import { byName, toolsQuery } from "@/lib/masterQueries";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { PrimaryButton, GhostButton } from "@/components/ui-kit/controls";
import { ToolForm } from "@/components/master/ToolForm";
import { ToolRow } from "@/components/master/ToolRow";

export const Route = createFileRoute("/_authed/master/tools")({
  component: ToolsPage,
  head: () => ({ meta: [{ title: "Sam — Core materials" }] }),
});

const field = "w-full rounded-xl border border-input bg-background px-3 py-3 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none";
const CATEGORIES = ["Handbook", "Agenda", "Coaching card", "Workbook", "Slide pack", "Other"];

function ToolsPage() {
  const queryClient = useQueryClient();
  const { data: tools = [], isLoading } = useQuery(toolsQuery);
  const products = useProducts();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [productFilter, setProductFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");

  const list = [...tools]
    .sort(byName)
    .filter((t) => (productFilter ? (t.assigned_products || []).includes(productFilter) : true))
    .filter((t) => (categoryFilter ? t.category === categoryFilter : true))
    .filter((t) => `${t.title} ${t.summary || ""}`.toLowerCase().includes(search.toLowerCase()));

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["tools"] });

  const save = async (payload) => {
    setSaving(true);
    try {
      if (editing?.id) await base44.entities.Tool.update(editing.id, payload);
      else await base44.entities.Tool.create(payload);
      setEditing(null);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await base44.entities.Tool.delete(deleting.id);
    setDeleting(null);
    await refresh();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Core materials"
        intro="The online and print versions of the handbooks, the tools and the audits, stored once and assigned to products. An update flows to every place it is used."
      />

      <Section
        action={
          <PrimaryButton onClick={() => setEditing({})}>
            <Plus className="h-5 w-5" /> Add tool
          </PrimaryButton>
        }
      >
        <div className="grid gap-2 sm:grid-cols-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools" className={field} />
          <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className={field}>
            <option value="">Every product</option>
            {products.map((p) => (
              <option key={p.key} value={p.key}>
                {p.name}
              </option>
            ))}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={field}>
            <option value="">Every type</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section title={`In the repository (${tools.length})`} subtitle="Each tool is available online and as a PDF download.">
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-xl bg-background/40" />
        ) : list.length ? (
          <div className="space-y-2">
            {list.map((tool) => (
              <ToolRow key={tool.id} tool={tool} onEdit={setEditing} onDelete={setDeleting} />
            ))}
          </div>
        ) : (
          <EmptyLine>{tools.length ? "No tool matches those filters." : "Nothing in the repository yet. Add the first tool."}</EmptyLine>
        )}
        <p className="mt-3 flex items-start gap-2 text-[14px] text-muted-foreground">
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          A tool is stored once. Editing it here updates every course and customer it is assigned to — no re-uploading.
        </p>
      </Section>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${editing.title}` : "Add a tool"}>
        <ToolForm tool={editing?.id ? editing : null} saving={saving} onSave={save} onCancel={() => setEditing(null)} />
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Remove this tool?">
        <p className="text-[15px]">{deleting?.title} will be removed from every course it is assigned to.</p>
        <div className="mt-4 flex gap-2">
          <GhostButton className="flex-1" onClick={remove}>
            Remove tool
          </GhostButton>
          <GhostButton className="flex-1" onClick={() => setDeleting(null)}>
            Keep
          </GhostButton>
        </div>
      </Modal>
    </div>
  );
}