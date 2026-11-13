import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { todayISO, stepStatus, stepsFor } from "@/lib/opsShift";
import { inputClass } from "@/components/ui-kit/controls";
import { STEPS } from "@/lib/opsContent";

async function loadCoach(user) {
  const [enrolments, shifts] = await Promise.all([
    base44.entities.OpsEnrolment.list(),
    base44.entities.Shift.filter({ date: todayISO() }),
  ]);
  const inScope = user.role === "admin" ? enrolments : enrolments.filter((e) => e.site_id === user.site_id);
  const shiftIds = shifts.map((s) => s.id);
  const [blocks, reports, notes] = shiftIds.length
    ? await Promise.all([
        base44.entities.BlockReport.filter({ shift_id: { $in: shiftIds } }),
        base44.entities.ShiftReport.filter({ shift_id: { $in: shiftIds } }),
        base44.entities.CoachingNote.filter({ shift_id: { $in: shiftIds } }),
      ])
    : [[], [], []];
  return { enrolments: inScope, shifts, blocks, reports, notes };
}

export function CoachDashboard({ user, setting }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(null);
  const [noteText, setNoteText] = useState("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["coach", user?.id],
    enabled: !!user?.id,
    queryFn: () => loadCoach(user),
  });

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  const rows = data.enrolments.map((e) => {
    const shift = data.shifts.find((s) => s.user_id === e.user_id) || null;
    const steps = stepsFor(setting, shift?.day_night || "Day");
    const blocks = shift ? data.blocks.filter((b) => b.shift_id === shift.id) : [];
    const report = shift ? data.reports.find((r) => r.shift_id === shift.id) : null;
    const marks = blocks.flatMap((b) => (b.marks || []).map((m) => ({ ...m, block_no: b.block_no })));
    return { enrolment: e, shift, steps, blocks, report, marks };
  });

  const receive = async (row) => {
    if (!row.report) return;
    try {
      await base44.entities.ShiftReport.update(row.report.id, {
        received_by: user.id,
        received_at: new Date().toISOString(),
        received_note: `${user.full_name || user.email} marked it received`,
      });
      toast.success("Shift Report marked received.");
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["ops"] });
    } catch {
      toast.error("Could not mark it received.");
    }
  };

  const addNote = async (row) => {
    if (!noteText.trim()) return;
    try {
      await base44.entities.CoachingNote.create({
        shift_id: row.shift?.id || "",
        user_id: row.enrolment.user_id,
        superintendent_id: user.id,
        superintendent_name: user.full_name || user.email || "",
        text: noteText.trim(),
        coaching_point: true,
        checked_next_shift: "Pending",
        site_id: row.enrolment.site_id || user.site_id || "",
      });
      setNoteText("");
      toast.success("Coaching point sent to the supervisor.");
      await refetch();
    } catch {
      toast.error("Could not save the note.");
    }
  };

  if (!rows.length) {
    return <p className="sam-glass p-4 text-[16px] text-foreground">No supervisors enrolled at your site yet.</p>;
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const name = row.enrolment.user_name || "Supervisor";
        const isOpen = open === row.enrolment.id;
        const statuses = Object.fromEntries(
          STEPS.map((s) => {
            const step = row.steps.find((x) => x.id === s.id);
            const record = s.id.startsWith("b")
              ? row.blocks.find((b) => Number(b.block_no) === Number(s.id.slice(1)))
              : s.id === "report"
                ? row.report
                : null;
            return [s.id, row.shift ? stepStatus(step, record) : "Not started"];
          }),
        );
        const nos = row.marks.filter((m) => m.value === "No");
        const nas = row.marks.filter((m) => m.value === "NA");

        return (
          <div key={row.enrolment.id} className="rounded-xl bg-card p-3">
            <button type="button" onClick={() => setOpen(isOpen ? null : row.enrolment.id)} className="flex w-full items-start gap-3 text-left">
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-semibold text-foreground">{name}</span>
                <span className="block text-[14px] text-muted-foreground">
                  {row.enrolment.stage} · {row.shift ? `${row.shift.day_night} shift` : "no shift started"}
                </span>
              </span>
              <ChevronRight className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-90" : ""}`} />
            </button>

            {row.shift ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {["handover", "prestart", "b1", "b2", "b3", "b4", "report"].map((id) => (
                  <span
                    key={id}
                    className={`rounded-full px-2 py-0.5 text-[12px] ${
                      statuses[id] === "Done"
                        ? "bg-gold text-gold-foreground"
                        : statuses[id] === "Due"
                          ? "bg-foreground text-background"
                          : "bg-background/60 text-muted-foreground"
                    }`}
                  >
                    {id === "prestart" ? "Pre-start" : id.toUpperCase()} {statuses[id]}
                  </span>
                ))}
              </div>
            ) : null}

            {isOpen ? (
              <div className="mt-3 space-y-2 border-t border-foreground/10 pt-2">
                <p className="text-[14px] text-muted-foreground">
                  {nos.length} No · {nas.length} not available yet
                </p>
                {nos.map((m, i) => (
                  <p key={i} className="rounded-lg bg-background/40 p-2 text-[14px] text-foreground">
                    B{m.block_no} line {m.line_no}: {m.action} · {m.owner} · {m.by_date}
                  </p>
                ))}
                {nas.map((m, i) => (
                  <p key={i} className="rounded-lg bg-background/40 p-2 text-[14px] text-muted-foreground">
                    B{m.block_no} line {m.line_no} not available: {m.note}
                  </p>
                ))}

                <div className="rounded-lg bg-background/40 p-2">
                  <p className="text-[14px] font-medium text-foreground">Shift Report</p>
                  <p className="text-[14px] text-muted-foreground">
                    {row.report
                      ? row.report.received_at
                        ? `Received by ${row.report.received_note || "you"}`
                        : "Submitted, not received yet"
                      : "Not submitted"}
                  </p>
                  {row.report && !row.report.received_at ? (
                    <button type="button" onClick={() => receive(row)} className="mt-1.5 min-h-[44px] w-full rounded-lg bg-gold px-3 text-[15px] font-semibold text-gold-foreground">
                      Mark received
                    </button>
                  ) : null}
                </div>

                <div className="rounded-lg bg-background/40 p-2">
                  <p className="text-[14px] font-medium text-foreground">One coaching point</p>
                  <textarea rows={2} className={inputClass} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="The next thing to fix, in their words" />
                  <button type="button" onClick={() => addNote(row)} className="mt-1.5 min-h-[44px] w-full rounded-lg bg-secondary px-3 text-[15px] font-semibold text-foreground">
                    Send coaching point
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}