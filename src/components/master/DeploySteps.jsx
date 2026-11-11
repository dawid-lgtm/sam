import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toolsQuery } from "@/lib/masterQueries";

function ToolLink({ tool }) {
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
    <button
      type="button"
      onClick={open}
      disabled={opening}
      title={`Open ${tool.title}`}
      className="flex min-h-[44px] w-full items-center gap-2 rounded-xl bg-background/50 px-3 text-left text-[15px] font-semibold text-gold underline decoration-gold underline-offset-2 transition hover:bg-background/70 disabled:opacity-50"
    >
      <FileText className="h-4 w-4 shrink-0" />
      {tool.title}
    </button>
  );
}

/** One card per deployment step, each with a description, its tools and one tick box. */
export function DeploySteps({ plan, productKey = "strategy" }) {
  const storageKey = `sam-deploy-steps:${productKey}`;
  const [done, setDone] = useState([]);
  const { data: tools = [], isLoading } = useQuery(toolsQuery);

  const stepTools = tools
    .filter((t) => t.file_uri && (t.assigned_products || []).includes(productKey))
    .sort((a, b) => (a.sort || 0) - (b.sort || 0));

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    setDone(raw ? JSON.parse(raw) : []);
  }, [storageKey]);

  const toggle = (n) => {
    const next = done.includes(n) ? done.filter((x) => x !== n) : [...done, n];
    setDone(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  return (
    <div className="space-y-3">
      {plan.phases.map((p) => {
        const isDone = done.includes(p.n);
        return (
          <div
            key={p.n}
            className={`rounded-2xl p-4 ${isDone ? "bg-gold/15 ring-1 ring-gold/50" : "bg-background/40"}`}
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold font-heading text-[18px] font-semibold text-gold-foreground">
                {p.n}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-[19px] font-semibold leading-snug text-foreground">{p.name}</p>
                <p className="text-[14px] leading-snug text-muted-foreground">{p.status}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(p.n)}
                aria-pressed={isDone}
                title={isDone ? `Untick step ${p.n}` : `Tick step ${p.n} off as done`}
                className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl px-2 text-[15px] font-semibold text-foreground transition hover:bg-background/50"
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-md border-2 ${
                    isDone ? "border-gold bg-gold text-gold-foreground" : "border-muted-foreground/60"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : null}
                </span>
                Done
              </button>
            </div>

            <p className="mt-2 text-[15px] leading-snug text-foreground">{p.description}</p>

            <p className="mt-3 text-[14px] font-semibold uppercase tracking-wide text-muted-foreground">Tools needed</p>
            {isLoading ? (
              <div className="mt-1.5 h-11 animate-pulse rounded-xl bg-background/40" />
            ) : stepTools.length ? (
              <div className="mt-1.5 space-y-1.5">
                {stepTools.map((t) => (
                  <ToolLink key={t.id} tool={t} />
                ))}
              </div>
            ) : (
              <p className="mt-1 text-[15px] leading-snug text-muted-foreground">No tools have been added for this program yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}