/** Card marks are held as an object keyed by line number while editing, and saved as an array. */
export function arrayToMarks(arr) {
  const out = {};
  (arr || []).forEach((m) => {
    out[String(m.line_no)] = {
      value: m.value || "",
      note: m.note || "",
      action: m.action || "",
      owner: m.owner || "",
      by_date: m.by_date || "",
    };
  });
  return out;
}

export function marksToArray(marks) {
  return Object.entries(marks || {})
    .filter(([, v]) => v?.value)
    .map(([no, v]) => ({
      line_no: String(no),
      value: v.value,
      note: v.note || "",
      action: v.action || "",
      owner: v.owner || "",
      by_date: v.by_date || "",
    }));
}

export function validateMarks(numbers, marks, { allowNa = true } = {}) {
  for (const no of numbers) {
    const m = marks?.[String(no)] || {};
    if (!m.value) return `Line ${no} needs Yes, No${allowNa ? ", or Not available yet" : ""}.`;
    if (m.value === "No" && !(m.action && m.owner && m.by_date)) {
      return `Line ${no} is a No: it needs an action, an owner and a date.`;
    }
    if (m.value === "NA" && !m.note) return `Line ${no}: give the short reason it is not available at your site.`;
  }
  return null;
}

/** Every No in a card, with the action it carries. */
export function openActions(marks) {
  return Object.entries(marks || {})
    .filter(([, m]) => m.value === "No")
    .map(([no, m]) => ({ line_no: no, action: m.action || "", owner: m.owner || "", by_date: m.by_date || "" }));
}