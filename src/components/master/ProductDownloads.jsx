import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toolsQuery } from "@/lib/masterQueries";
import { Section, EmptyLine } from "@/components/ui-kit/Section";

function DownloadRow({ tool }) {
  const [opening, setOpening] = useState(false);
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
    <div className="flex items-start justify-between gap-3 rounded-xl bg-background/40 p-3">
      <div className="min-w-0">
        <p className="text-[15px] font-semibold">{tool.title}</p>
        <p className="text-[14px] text-muted-foreground">
          {tool.category} · {tool.version || "v1"}
        </p>
        {tool.summary ? <p className="mt-1 text-[14px]">{tool.summary}</p> : null}
      </div>
      <button
        aria-label={`Download ${tool.title}`}
        onClick={open}
        disabled={opening}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold text-gold-foreground disabled:opacity-50"
      >
        <Download className="h-5 w-5" />
      </button>
    </div>
  );
}

export function ProductDownloads({ productKey }) {
  const { data: tools = [], isLoading } = useQuery(toolsQuery);
  const list = tools
    .filter((t) => t.file_uri && (t.assigned_products || []).includes(productKey))
    .sort((a, b) => (a.sort || 0) - (b.sort || 0));

  return (
    <Section title="Tools and downloads" subtitle="The handbook and tools that go with this program.">
      {isLoading ? (
        <div className="h-24 animate-pulse rounded-xl bg-background/40" />
      ) : list.length ? (
        <div className="space-y-2">
          {list.map((t) => (
            <DownloadRow key={t.id} tool={t} />
          ))}
        </div>
      ) : (
        <EmptyLine>Nothing to download yet.</EmptyLine>
      )}
    </Section>
  );
}