import { useState } from "react";
import { EmptyLine } from "@/components/ui-kit/Section";
import { ToolRow } from "@/components/master/ToolRow";

// One tab per product; opening a tab shows the tools filed under it.
export function ToolProductTabs({ tools, products, onEdit, onDelete }) {
  const [openKey, setOpenKey] = useState(products[0]?.key || "");
  const unassigned = tools.filter((t) => !(t.assigned_products || []).length);
  const tabs = [
    ...products.map((p) => ({ key: p.key, name: p.name })),
    ...(unassigned.length ? [{ key: "__none__", name: "Unassigned" }] : []),
  ];

  const countFor = (key) =>
    key === "__none__"
      ? unassigned.length
      : tools.filter((t) => (t.assigned_products || []).includes(key)).length;

  const openTools = tools.filter((t) =>
    openKey === "__none__" ? !(t.assigned_products || []).length : (t.assigned_products || []).includes(openKey),
  );

  if (!tabs.length) return <EmptyLine>Nothing in the repository yet. Add the first tool.</EmptyLine>;

  return (
    <div>
      <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setOpenKey(tab.key)}
            title={`Show what ${tab.name} holds`}
            className={`flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[14px] font-semibold transition ${
              openKey === tab.key ? "bg-gold text-gold-foreground" : "bg-background/50 text-foreground hover:bg-secondary"
            }`}
          >
            {tab.name}
            <span className={openKey === tab.key ? "opacity-80" : "text-muted-foreground"}>{countFor(tab.key)}</span>
          </button>
        ))}
      </div>

      <div className="mt-1 space-y-2">
        {openTools.length ? (
          openTools.map((tool) => (
            <ToolRow key={tool.id} tool={tool} onEdit={onEdit} onDelete={onDelete} />
          ))
        ) : (
          <EmptyLine>Nothing filed under this product yet.</EmptyLine>
        )}
      </div>
    </div>
  );
}