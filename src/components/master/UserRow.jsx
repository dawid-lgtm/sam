import { useState } from "react";
import { base44 } from "@/api/base44Client";

const selectClass =
  "mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-[15px] text-foreground focus:border-gold focus:outline-none";

export function UserRow({ person, customers, onSaved }) {
  const [role, setRole] = useState(person.role || "user");
  const [customerId, setCustomerId] = useState(person.customer_id || "");
  const [saving, setSaving] = useState(false);

  const save = async (patch) => {
    setSaving(true);
    try {
      await base44.entities.User.update(person.id, patch);
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl bg-background/40 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold">{person.full_name || person.email}</p>
          <p className="truncate text-[14px] text-muted-foreground">{person.email}</p>
        </div>
        {saving ? <span className="text-[14px] text-gold">Saving…</span> : null}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-[14px] text-muted-foreground">Role</span>
          <select
            className={selectClass}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              save({ role: e.target.value });
            }}
          >
            <option value="user">User</option>
            <option value="admin">Super admin</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[14px] text-muted-foreground">Customer</span>
          <select
            className={selectClass}
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              save({ customer_id: e.target.value });
            }}
          >
            <option value="">Not assigned</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}