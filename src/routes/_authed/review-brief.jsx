import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import MarkdownDoc from "@/components/review/MarkdownDoc";

const FILE = "/Sam-review-brief.md";

export const Route = createFileRoute("/_authed/review-brief")({
  component: Page,
  head: () => ({ meta: [{ title: "Sam — review brief" }] }),
});

function Page() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(FILE)
      .then((res) => res.text())
      .then(setText)
      .catch(() => setText(""));
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="sam-glass p-4">
        <h1 className="font-heading text-[22px] font-semibold leading-tight">Review brief for Grok</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          The whole brief: purpose, design, data model, screen map, both walkthrough journeys, the rules encoded and the
          open questions. Download it and hand it over with repository access.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={FILE} download="Sam-review-brief.md" className="sam-btn">
            <Download className="h-5 w-5" />
            Download the brief (.md)
          </a>
          <button onClick={copy} disabled={!text} className="sam-btn-quiet">
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? "Copied" : "Copy the text"}
          </button>
        </div>
      </div>

      <div className="sam-glass p-4 sm:p-6">
        {text ? <MarkdownDoc text={text} /> : <p className="text-[15px] text-muted-foreground">Loading the brief…</p>}
      </div>
    </div>
  );
}