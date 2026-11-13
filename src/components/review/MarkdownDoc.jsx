import { Fragment } from "react";
import { parseBlocks } from "@/components/review/markdownBlocks";

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;

export function Inline({ text }) {
  const parts = String(text ?? "").split(INLINE);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (/^`[^`]+`$/.test(part))
          return (
            <code key={i} className="rounded bg-background/60 px-1.5 py-0.5 text-[15px]">
              {part.slice(1, -1)}
            </code>
          );
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="text-gold underline">
              {link[1]}
            </a>
          );
        if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

const headingSize = {
  1: "text-[26px] leading-tight",
  2: "mt-6 text-[20px] leading-snug",
  3: "mt-5 text-[17px] leading-snug",
  4: "mt-4 text-[16px] leading-snug",
};

export default function MarkdownDoc({ text }) {
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-foreground">
      {parseBlocks(text).map((block, i) => {
        if (block.type === "hr") return <hr key={i} className="my-4 border-foreground/20" />;
        if (block.type === "h") {
          const Tag = `h${Math.min(block.level, 4)}`;
          return (
            <Tag key={i} className={`font-heading font-semibold ${headingSize[block.level] || headingSize[4]}`}>
              <Inline text={block.text} />
            </Tag>
          );
        }
        if (block.type === "ul")
          return (
            <ul key={i} className="ml-4 list-disc space-y-1.5">
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        if (block.type === "ol")
          return (
            <ol key={i} className="ml-4 list-decimal space-y-1.5">
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </ol>
          );
        if (block.type === "quote")
          return (
            <blockquote key={i} className="border-l-2 border-gold pl-3 text-muted-foreground">
              <Inline text={block.text} />
            </blockquote>
          );
        if (block.type === "table")
          return (
            <div key={i} className="overflow-x-auto rounded-xl bg-background/40">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-foreground/20">
                    {block.head.map((cell, j) => (
                      <th key={j} className="px-3 py-2 font-semibold">
                        <Inline text={cell} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, j) => (
                    <tr key={j} className="border-b border-foreground/10 last:border-0">
                      {row.map((cell, k) => (
                        <td key={k} className="px-3 py-2 align-top">
                          <Inline text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        return (
          <p key={i}>
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}