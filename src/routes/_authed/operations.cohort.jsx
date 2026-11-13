import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { todayISO } from "@/lib/opsShift";
import { tenantId } from "@/lib/tenant";
import { inputClass } from "@/components/ui-kit/controls";

export const Route = createFileRoute("/_authed/operations/cohort")({
  ssr: false,
  component: CohortPage,
  head: () => ({ meta: [{ title: "Sam — Cohorts" }] }),
});

const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

function CohortPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", lab_date: "", lab_place: "", apply_weeks: 6 });
  const [selectedUser, setSelectedUser] = useState("");
  const [busy, setBusy] = useState(false);

  const cohorts = useQuery({
    queryKey: ["ops-cohorts"],
    queryFn: () => base44.entities.OpsCohort.list(),
  });
  const enrolments = useQuery({
    queryKey: ["ops-enrolments-all"],
    queryFn: () => base44.entities.OpsEnrolment.list(),
  });
  const users = useQuery({
    queryKey: ["ops-users"],
    enabled: user?.role === "admin",
    queryFn: () => base44.entities.User.list(),
  });

  const refresh = async () => {
    await Promise.all([cohorts.refetch(), enrolments.refetch()]);
  };

  const createCohort = async () => {
    if (!form.name.trim()) {
      toast.error("Give the cohort a name.");
      return;
    }
    setBusy(true);
    try {
      await base44.entities.OpsCohort.create({
        name: form.name.trim(),
        customer_id: tenantId(user),
        site_id: user?.site_id || "",
        lab_date: form.lab_date || "",
        lab_place: form.lab_place || "",
        apply_weeks: Number(form.apply_weeks) || 6,
        program_key: "ops_supervisors",
        facilitator_id: user?.id || "",
        status: "Planned",
      });
      setForm({ name: "", lab_date: "", lab_place: "", apply_weeks: 6 });
      toast.success("Cohort created. Add the supervisors next.");
      await refresh();
    } catch {
      toast.error("Could not create the cohort.");
    } finally {
      setBusy(false);
    }
  };

  const addSupervisor = async (cohort) => {
    const person = (users.data || []).find((u) => u.id === selectedUser);
    if (!person) {
      toast.error("Choose a person first.");
      return;
    }
    try {
      await base44.entities.OpsEnrolment.create({
        cohort_id: cohort.id,
        customer_id: tenantId(user),
        user_id: person.id,
        user_name: person.full_name || person.email,
        site_id: cohort.site_id || person.site_id || "",
        stage: "Prime",
        prime_started: todayISO(),
        verify_result: "Not yet",
      });
      setSelectedUser("");
      toast.success(`${person.full_name || person.email} is enrolled.`);
      await refresh();
    } catch {
      toast.error("Could not enrol them.");
    }
  };

  const completeLab = async (enrolment) => {
    const weeks = Number(
      (cohorts.data || []).find((c) => c.id === enrolment.cohort_id)?.apply_weeks || 6,
    );
    const today = todayISO();
    try {
      await base44.entities.OpsEnrolment.update(enrolment.id, {
        stage: "Apply",
        lab_completed_at: new Date().toISOString(),
        lab_completed_by: user?.id || "",
        apply_start: today,
        apply_end: addDays(today, weeks * 7),
        verify_date: addDays(today, weeks * 7 + 7),
      });
      toast.success("Lab complete: the Field Coach is unlocked for them.");
      await refresh();
    } catch {
      toast.error("Could not mark the Lab complete.");
    }
  };

  return (
    <div className="space-y-3">
      <Link to="/operations" className="text-[15px] text-muted-foreground">
        ← Operations
      </Link>
      <div>
        <h1 className="font-heading text-[26px] font-semibold leading-tight text-foreground">Cohorts</h1>
        <p className="text-[15px] text-muted-foreground">
          One cohort: customer, site, supervisors, Lab date and place, Apply length, Verify date.
        </p>
      </div>

      <div className="sam-glass p-3">
        <p className="text-[15px] font-semibold text-foreground">New cohort</p>
        <input className={inputClass} placeholder="Cohort name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid grid-cols-2 gap-1.5">
          <input type="date" className={inputClass} value={form.lab_date} onChange={(e) => setForm({ ...form, lab_date: e.target.value })} />
          <input type="number" className={inputClass} placeholder="Apply weeks (6–8)" value={form.apply_weeks} onChange={(e) => setForm({ ...form, apply_weeks: e.target.value })} />
        </div>
        <input className={inputClass} placeholder="Lab place" value={form.lab_place} onChange={(e) => setForm({ ...form, lab_place: e.target.value })} />
        <button type="button" onClick={createCohort} disabled={busy} className="mt-2 min-h-[48px] w-full rounded-xl bg-gold px-3 text-[16px] font-semibold text-gold-foreground disabled:opacity-50">
          {busy ? "Creating…" : "Create cohort"}
        </button>
      </div>

      {(cohorts.data || []).map((cohort) => {
        const people = (enrolments.data || []).filter((e) => e.cohort_id === cohort.id);
        return (
          <div key={cohort.id} className="sam-glass p-3">
            <p className="text-[16px] font-semibold text-foreground">{cohort.name}</p>
            <p className="text-[14px] text-muted-foreground">
              Lab {cohort.lab_date || "not set"} · Apply {cohort.apply_weeks || 6} weeks · {cohort.status}
            </p>

            <div className="mt-2 space-y-1.5">
              {people.length ? (
                people.map((e) => (
                  <div key={e.id} className="rounded-lg bg-background/40 p-2">
                    <p className="text-[15px] font-medium text-foreground">{e.user_name || e.user_id}</p>
                    <p className="text-[14px] text-muted-foreground">
                      {e.stage} · Lab {e.lab_completed_at ? "complete" : "not complete"} · Apply {e.apply_start || "–"} to {e.apply_end || "–"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {!e.lab_completed_at ? (
                        <button type="button" onClick={() => completeLab(e)} className="min-h-[44px] rounded-lg bg-gold px-3 text-[14px] font-semibold text-gold-foreground">
                          <GraduationCap className="mr-1 inline h-4 w-4" />
                          Lab complete
                        </button>
                      ) : null}
                      <Link to="/operations/verify" className="inline-flex min-h-[44px] items-center rounded-lg bg-secondary px-3 text-[14px] font-semibold text-foreground">
                        Verify
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[14px] text-muted-foreground">No supervisors enrolled yet.</p>
              )}
            </div>

            {user?.role === "admin" ? (
              <div className="mt-2 flex gap-1.5">
                <select className={inputClass + " mt-0"} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                  <option value="">Add a supervisor…</option>
                  {(users.data || [])
                    .filter((u) => !(enrolments.data || []).some((e) => e.user_id === u.id && e.cohort_id === cohort.id))
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.full_name || u.email}
                      </option>
                    ))}
                </select>
                <button type="button" onClick={() => addSupervisor(cohort)} className="min-h-[48px] rounded-xl bg-secondary px-3 text-[15px] font-semibold text-foreground">
                  Add
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}