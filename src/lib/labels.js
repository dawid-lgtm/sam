/** The first few words of an item, so a code never stands alone. */
export function shortWords(text, max = 6) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "not written yet";
  return words.length > max ? `${words.slice(0, max).join(" ")}…` : words.join(" ");
}

/** "S4 · safety control gaps" — code plus plain words. */
export function withWords(code, text, max = 6) {
  return code ? `${code} · ${shortWords(text, max)}` : shortWords(text, max);
}