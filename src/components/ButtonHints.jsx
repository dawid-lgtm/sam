import { useEffect } from "react";

// Every button and link gets a hover hint: its own title if it has one,
// otherwise its label or aria-label.
function describe(el) {
  const label = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ");
  if (label && label.length <= 60) el.title = label;
}

function fill(root = document) {
  root.querySelectorAll("button, a[href], [role='button']").forEach((el) => {
    if (!el.title) describe(el);
  });
}

export function ButtonHints() {
  useEffect(() => {
    fill();
    const observer = new MutationObserver(() => fill());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}