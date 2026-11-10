import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { PrimaryButton } from "@/components/ui-kit/controls";

const field = "mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-[15px] text-foreground focus:border-gold focus:outline-none";

// One person per line: email, role (user or admin), customer name. Role and customer are optional.
function parseRows(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line, index) => !(index === 0 && /e-?mail/i.test(line) && /role|customer/i.test(line)))
    .map((line) => {
      const [email, role, customer] = line.split(",").map((v) => (v || "").trim());
      return { email, role: role === "admin" ? "admin" : "user", customer };
    })
    .filter((row) => row.email);
}

export function BulkUserUpload({ customers, onDone }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState([]);

  const readFile = async (file) => {
    if (!file) return;
    setText(await file.text());
  };

  const run = async () => {
    const rows = parseRows(text);
    if (!rows.length) return;
    setBusy(true);
    const out = [];
    for (const row of rows) {
      try {
        await base44.users.inviteUser(row.email, row.role);
        const match = customers.find(
          (c) => row.customer && (c.name.toLowerCase() === row.customer.toLowerCase() || (c.code || "").toLowerCase() === row.customer.toLowerCase()),
        );
        if (match) {
          const created = await base44.entities.User.filter({ email: row.email });
          if (created?.[0]) await base44.entities.User.update(created[0].id, { customer_id: match.id });
        }
        out.push({ email: row.email, ok: true, text: match ? `Invited · ${match.name}` : "Invited" });
      } catch (err) {
        out.push({ email: row.email, ok: false, text: err?.message || "Failed" });
      }
    }
    setResults(out);
    setBusy(false);
    setText("");
    onDone();
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-[15px] font-medium">Upload a CSV</span>
        <input
          type="file"
          accept=".csv,text/csv,text/plain"
          onChange={(e) => readFile(e.target.files?.[0])}
          className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-[15px] text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-2 file:text-[15px] file:font-semibold file:text-gold-foreground"
        />
      </label>
      <label className="block">
        <span className="text-[15px] font-medium">…or paste the list</span>
        <textarea
          rows={5}
          className={field}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"name@company.com, user, Pilbara Mining Co\nsue@company.com, admin"}
        />
      </label>
      <PrimaryButton type="button" className="w-full" onClick={run} disabled={busy || !text.trim()}>
        {busy ? "Inviting…" : "Invite everyone on the list"}
      </PrimaryButton>
      {results.length ? (
        <ul className="space-y-1 rounded-xl bg-background/40 p-3">
          {results.map((r, i) => (
            <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 text-[14px]">
              <span>{r.email}</span>
              <span className={r.ok ? "text-gold" : "text-foreground"}>{r.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}