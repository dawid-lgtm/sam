import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useOps } from "@/lib/useOps";
import { DEFAULT_SETTINGS } from "@/lib/opsContent";
import { saveOffline } from "@/lib/offline";
import { inputClass } from "@/components/ui-kit/controls";

export const Route = createFileRoute("/_authed/operations/settings")({
  ssr: false,
  component: ShiftSettings,
  head: () => ({ meta: [{ title: "Sam — Shift settings" }] }),
});

const DIRECT = ["administrator", "executive", "project_manager", "site_lead"];

function ShiftSettings() {
  const { user, data, refresh } = useOps();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  const setting = data.setting || {};
  const merged = {
    ...DEFAULT_SETTINGS,
    ...Object.fromEntries(Object.entries(setting).filter(([, v]) => v !== null && v !== undefined && v !== "")),
    block_times: setting.block_times?.length === 4 ? setting.block_times : DEFAULT_SETTINGS.block_times,
  };
  const state = form || merged;
  const set = (patch) => setForm({ ...state, ...patch });
  const setBlock = (i, patch) => {
    const next = state.block_times.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    set({ block_times: next });
  };

  const direct = DIRECT.includes(user?.access);

  const save = async () => {
    setBusy(true);
    try {
      const payload = {
        ...state,
        site_id: user?.site_id || setting.site_id || "",
        site_name: user?.site_name || setting.site_name || "",
        approval_pending: !direct,
        approved_by: direct ? user.id : "",
        approved_at: direct ? new Date().toISOString() : "",
        changed_by: user?.id || "",
      };
      if (setting.id) await saveOffline("ShiftSetting", "update", { id: setting.id, data: payload });
      else await saveOffline("ShiftSetting", "create", { data: payload });
      toast.success(direct ? "Shift settings saved." : "Saved. Waiting for your Superintendent's approval.");
      await refresh();
    } catch {
      toast.error("Could not save. Try again when you have signal.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <Link to="/operations" className="text-[15px] text-muted-foreground">
        ← Today
      </Link>
      <div>
        <h1 className="font-heading text-[26px] font-semibold leading-tight text-foreground">Shift settings</h1>
        <p className="text-[15px] text-muted-foreground">
          Times are indicative. Your site can change them; the order does not change.
        </p>
      </div>

      {state.approval_pending ? (
        <p className="flex items-start gap-2 rounded-xl bg-background/50 p-3 text-[15px] leading-snug text-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          A change to the touch-base or check-in needs your Superintendent's approval. This one is waiting on them.
        </p>
      ) : null}

      <div className="sam-glass p-3">
        <p className="text-[15px] font-semibold text-foreground">Roster</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <label className="block">
            <span className="text-[13px] text-muted-foreground">Pattern</span>
            <input className={inputClass + " mt-0"} value={state.roster_pattern} onChange={(e) => set({ roster_pattern: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-[13px] text-muted-foreground">Roster start</span>
            <input type="date" className={inputClass + " mt-0"} value={state.roster_start || ""} onChange={(e) => set({ roster_start: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-[13px] text-muted-foreground">On days</span>
            <input type="number" className={inputClass + " mt-0"} value={state.on_days} onChange={(e) => set({ on_days: Number(e.target.value) })} />
          </label>
          <label className="block">
            <span className="text-[13px] text-muted-foreground">Off days</span>
            <input type="number" className={inputClass + " mt-0"} value={state.off_days} onChange={(e) => set({ off_days: Number(e.target.value) })} />
          </label>
          <label className="block">
            <span className="text-[13px] text-muted-foreground">Shift length (hours)</span>
            <input type="number" className={inputClass + " mt-0"} value={state.shift_length_hours} onChange={(e) => set({ shift_length_hours: Number(e.target.value) })} />
          </label>
          <label className="block">
            <span className="text-[13px] text-muted-foreground">Supervisors on shift</span>
            <input type="number" className={inputClass + " mt-0"} value={state.supervisors_on_shift} onChange={(e) => set({ supervisors_on_shift: Number(e.target.value) })} />
          </label>
        </div>
      </div>

      <div className="sam-glass p-3">
        <p className="text-[15px] font-semibold text-foreground">The day</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {[
            { k: "handover_time", label: "Handover" },
            { k: "handover_minutes", label: "Handover (min)" },
            { k: "prestart_time", label: "Pre-start" },
            { k: "prestart_minutes", label: "Pre-start (min)" },
            { k: "report_due_time", label: "Shift Report due" },
            { k: "last_bucket_time", label: "Last bucket" },
            { k: "handover_out_time", label: "Handover out" },
            { k: "night_offset_hours", label: "Night offset (hours)" },
          ].map((f) => (
            <label key={f.k} className="block">
              <span className="text-[13px] text-muted-foreground">{f.label}</span>
              <input
                type={f.k.endsWith("_minutes") || f.k.includes("hours") ? "number" : "time"}
                className={inputClass + " mt-0"}
                value={state[f.k] ?? ""}
                onChange={(e) => set({ [f.k]: f.k.includes("hours") || f.k.includes("minutes") ? Number(e.target.value) : e.target.value })}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="sam-glass p-3">
        <p className="text-[15px] font-semibold text-foreground">The four blocks</p>
        <div className="mt-2 space-y-2">
          {state.block_times.map((b, i) => (
            <div key={i} className="rounded-lg bg-background/40 p-2">
              <p className="text-[14px] font-medium text-foreground">Block {i + 1}</p>
              <div className="mt-1 grid grid-cols-2 gap-1.5">
                <input type="time" className={inputClass + " mt-0"} value={b.start} onChange={(e) => setBlock(i, { start: e.target.value })} />
                <input type="time" className={inputClass + " mt-0"} value={b.end} onChange={(e) => setBlock(i, { end: e.target.value })} />
                <input className={inputClass + " mt-0"} placeholder="Meeting" value={b.meeting || ""} onChange={(e) => setBlock(i, { meeting: e.target.value })} />
                <input type="time" className={inputClass + " mt-0"} value={b.meeting_time || ""} onChange={(e) => setBlock(i, { meeting_time: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="button" onClick={save} disabled={busy} className="min-h-[56px] w-full rounded-xl bg-gold px-4 text-[17px] font-semibold text-gold-foreground disabled:opacity-50">
        {busy ? "Saving…" : direct ? "Save site settings" : "Send for Superintendent approval"}
      </button>
    </div>
  );
}