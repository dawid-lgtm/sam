// A deliberately small Markdown reader: headings, paragraphs, bullets,
// numbered lists, pipe tables, quotes and rules. Enough for the review brief.
const isBullet = (t) => /^[-*]\s+/.test(t);
const isNumbered = (t) => /^\d+\.\s+/.test(t);
const isHeading = (t) => /^#{1,4}\s+/.test(t);
const isTableRow = (t) => t.startsWith("|");
const isDivider = (t) => /^\|[\s:|-]+\|$/.test(t);

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function parseBlocks(text) {
  const lines = String(text || "").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (/^-{3,}$/.test(line)) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: "h", level: heading[1].length, text: heading[2] });
      i += 1;
      continue;
    }

    if (isTableRow(line) && isDivider((lines[i + 1] || "").trim())) {
      const head = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i].trim())) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      blocks.push({ type: "table", head, rows });
      continue;
    }

    if (isBullet(line)) {
      const items = [];
      while (i < lines.length && isBullet(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (isNumbered(line)) {
      const items = [];
      while (i < lines.length && isNumbered(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (line.startsWith(">")) {
      const parts = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        parts.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: parts.join(" ") });
      continue;
    }

    const parts = [];
    while (i < lines.length && lines[i].trim()) {
      const next = lines[i].trim();
      if (isHeading(next) || isTableRow(next) || isBullet(next) || isNumbered(next) || /^-{3,}$/.test(next)) break;
      parts.push(next);
      i += 1;
    }
    if (!parts.length) {
      blocks.push({ type: "p", text: line });
      i += 1;
      continue;
    }
    blocks.push({ type: "p", text: parts.join(" ") });
  }

  return blocks;
}