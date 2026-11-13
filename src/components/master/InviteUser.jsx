import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { PrimaryButton } from "@/components/ui-kit/controls";
import { ACCESS_LABELS } from "@/lib/access";

const field = "mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-[15px] text-foreground focus:border-gold focus:outline-none";

export function InviteUser({ customers, sites = [], onDone }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [siteId, setSiteId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [access, setAccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  // A person works at a site: no site, no invite. Super admins administer instead of working a site.
  const needsSite = role !== "admin";
  const missingSite = needsSite && !siteId;

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (missingSite) {
      setMessage({ ok: false, text: "Choose the site this person works at before inviting them." });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await base44.users.inviteUser(email.trim(), role);
      if (customerId || access || siteId) {
        const matches = await base44.entities.User.filter({ email: email.trim() });
        const created = matches?.[0];
        if (created) {
          await base44.entities.User.update(created.id, {
            ...(customerId ? { customer_id: customerId } : {}),
            ...(access ? { access } : {}),
            ...(siteId ? { site_id: siteId } : {}),
          });
        }
      }
      setMessage({ ok: true, text: `Invite sent to ${email.trim()}.` });
      setEmail("");
      onDone();
    } catch (err) {
      setMessage({ ok: false, text: err?.message || "Could not send that invite." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <label className="block">
        <span className="text-[15px] font-medium">Email</span>
        <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@company.com" />
      </label>
      <label className="block">
        <span className="text-[15px] font-medium">
          Site {needsSite ? <span className="text-gold">· required</span> : <span className="text-muted-foreground">· not needed for a super admin</span>}
        </span>
        <select className={field} value={siteId} onChange={(e) => setSiteId(e.target.value)}>
          <option value="">{sites.length ? "Choose the site they work at" : "No sites set up yet"}</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-[14px] leading-snug text-muted-foreground">
          Only the sites from your setup are offered, so the group cannot grow past the sites you have set up.
        </span>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-[15px] font-medium">Role</span>
          <select className={field} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Super admin</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[15px] font-medium">Access</span>
          <select className={field} value={access} onChange={(e) => setAccess(e.target.value)}>
            <option value="">Not set</option>
            {Object.entries(ACCESS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[15px] font-medium">Customer</span>
          <select className={field} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Not assigned</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <PrimaryButton type="submit" className="w-full" disabled={busy || missingSite}>
        {busy ? "Sending invite…" : missingSite ? "Choose their site first" : "Invite person"}
      </PrimaryButton>
      {message ? (
        <p className={`text-[14px] ${message.ok ? "text-gold" : "text-foreground"}`}>{message.text}</p>
      ) : null}
    </form>
  );
}