import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toolsQuery } from "@/lib/masterQueries";

/** The tool attached to a program card, opened straight from the card. */
export function CardToolLink({ toolId }) {
  const { data: tools = [] } = useQuery(toolsQuery);
  const [opening, setOpening] = useState(false);
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) return null;

  const open = async () => {
    setOpening(true);
    try {
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: tool.file_uri });
      window.open(signed_url, "_blank", "noopener");
    } finally {
      setOpening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={open}
      disabled={opening}
      title={`Open ${tool.title}`}
      className="mt-2 flex min-h-[44px] w-full items-center gap-2 rounded-xl bg-background/50 px-3 text-left text-[15px] font-semibold text-gold underline decoration-gold underline-offset-2 transition hover:bg-background/70 disabled:opacity-50"
    >
      <FileText className="h-4 w-4 shrink-0" />
      {tool.title}
    </button>
  );
}