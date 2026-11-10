import { useState } from "react";
import { Download, Eye, Pencil, Trash2, Paperclip } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { ProductChips } from "@/components/master/bits";
import { Modal } from "@/components/ui-kit/Modal";
import { GhostButton } from "@/components/ui-kit/controls";

const iconBtn = "grid h-11 w-11 place-items-center rounded-xl bg-secondary text-foreground transition hover:ring-2 hover:ring-gold";

export function ToolRow({ tool, onEdit, onDelete }) {
  const [viewing, setViewing] = useState(false);
  const [opening, setOpening] = useState(false);
  const updated = tool.updated_date
    ? new Date(tool.updated_date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
    : "";

  const openPdf = async () => {
    if (!tool.file_uri) return;
    setOpening(true);
    try {
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: tool.file_uri });
      window.open(signed_url, "_blank", "noopener");
    } finally {
      setOpening(false);
    }
  };

  return (
    <div className="rounded-xl bg-background/40 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold">{tool.title}</p>
          <p className="text-[14px] text-muted-foreground">
            {tool.category} · {tool.version || "v1"}
            {updated ? ` · updated ${updated}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          {tool.content ? (
            <button aria-label="Read online" className={iconBtn} onClick={() => setViewing(true)}>
              <Eye className="h-5 w-5" />
            </button>
          ) : null}
          {tool.file_uri ? (
            <button aria-label="Download PDF" className={iconBtn} onClick={openPdf} disabled={opening}>
              <Download className="h-5 w-5" />
            </button>
          ) : null}
          <button aria-label="Edit tool" className={iconBtn} onClick={() => onEdit(tool)}>
            <Pencil className="h-5 w-5" />
          </button>
          <button aria-label="Delete tool" className={iconBtn} onClick={() => onDelete(tool)}>
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      {tool.summary ? <p className="mt-2 text-[14px]">{tool.summary}</p> : null}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Paperclip className="h-4 w-4 text-gold" />
        <ProductChips keys={tool.assigned_products || []} />
      </div>

      {viewing ? (
        <Modal open onClose={() => setViewing(false)} title={tool.title}>
          <p className="mb-3 text-[14px] text-muted-foreground">
            {tool.category} · {tool.version || "v1"}
          </p>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{tool.content}</p>
          <div className="mt-4">
            <GhostButton className="w-full" onClick={() => setViewing(false)}>
              Close
            </GhostButton>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}