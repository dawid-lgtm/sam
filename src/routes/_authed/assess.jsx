import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useSamData } from "@/lib/useSamData";
import { emptyForm } from "@/lib/assessContent";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section } from "@/components/ui-kit/Section";
import { TextAreaField, PrimaryButton } from "@/components/ui-kit/controls";
import { Staircase } from "@/components/assess/Staircase";
import { MaturityMatrix } from "@/components/assess/MaturityMatrix";
import { MeetingsReview } from "@/components/assess/MeetingsReview";
import { EvidenceQuestions } from "@/components/assess/EvidenceQuestions";

export const Route = createFileRoute("/_authed/assess")({
  component: Assess,
  head: () => ({ meta: [{ title: "Sam — Where we are now" }] }),
});

function defaultRows(meetings) {
  return meetings.map((m) => ({
    meeting: m.title,
    where: m.scope === "Site" ? m.site_name : "Head office",
    owner: m.owner || "",
    rhythm: `${(m.weeks || []).join(", ")} · ${m.duration_min} min`,
    decides: m.decides || "",
    in_or_on: m.cadence,
    adds_value: "Y",
    action: "Keep",
  }));
}

function Assess() {
  const { user } = Route.useRouteContext();
  const { data } = useSamData();
  const [form, setForm] = useState(emptyForm());
  const [assessmentId, setAssessmentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const prefilled = useRef(false);

  const { data: mine, refetch } = useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const rows = await base44.entities.Assessment.list();
      return [...rows].sort((a, b) => String(b.assessment_date).localeCompare(String(a.assessment_date)));
    },
  });

  const myAssessments = (mine || []).filter((a) => a.created_by_id === user?.id);

  useEffect(() => {
    if (prefilled.current || !data || !mine) return;
    const latest = myAssessments[0] || null;
    setForm({
      ...emptyForm(),
      ...(latest || {}),
      meetings_review: latest?.meetings_review?.length ? latest.meetings_review : defaultRows(data.meetings),
      evidence: latest?.evidence?.length ? latest.evidence : emptyForm().evidence,
    });
    setAssessmentId(latest?.id || null);
    prefilled.current = true;
  }, [data, mine, user]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const save = async () => {
    setSaving(true);
    try {
      const today = moment.utc().format("YYYY-MM-DD");
      const payload = {
        assessee: user?.full_name || user?.email || "Unknown",
        assessment_date: today,
        staircase_step: form.staircase_step,
        turning_point: form.turning_point,
        maturity_goal: form.maturity_goal,
        maturity_strategies: form.maturity_strategies,
        maturity_meetings: form.maturity_meetings,
        maturity_site_head_office: form.maturity_site_head_office,
        maturity_behaviours: form.maturity_behaviours,
        gaps: form.gaps,
        meetings_review: form.meetings_review,
        evidence: form.evidence,
        is_test: true,
      };
      const todays = myAssessments.find((a) => a.assessment_date === today);
      const record = todays
        ? await base44.entities.Assessment.update(todays.id, payload)
        : await base44.entities.Assessment.create(payload);
      setAssessmentId(record.id);
      await refetch();
      toast.success("Assessment saved");
    } finally {
      setSaving(false);
    }
  };

  const open = (record) => {
    setForm({ ...emptyForm(), ...record, evidence: record.evidence?.length ? record.evidence : emptyForm().evidence });
    setAssessmentId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Tool 1"
        title="Where we are now"
        intro="Work down the three parts. Save it and it is kept with today's date for you."
      />

      <Section
        title="1. The growth staircase"
        subtitle="Pick the step this business is honestly on today."
      >
        <Staircase value={form.staircase_step} onChange={(v) => set({ staircase_step: v })} />
        <div className="mt-4">
          <TextAreaField
            label="The turning point we have reached"
            placeholder="In plain words, what has changed that makes the old way stop working?"
            value={form.turning_point}
            onChange={(e) => set({ turning_point: e.target.value })}
          />
        </div>
      </Section>

      <Section
        className="mt-4"
        title="2. The maturity matrix"
        subtitle="One box per row. No ranking, no scores — this is about the system, not people."
      >
        <MaturityMatrix value={form} onChange={(key, level) => set({ [key]: level })} />
        <div className="mt-4">
          <TextAreaField
            label="Three gaps I would fix first"
            rows={4}
            placeholder="1.  2.  3."
            value={form.gaps}
            onChange={(e) => set({ gaps: e.target.value })}
          />
        </div>
      </Section>

      <Section className="mt-4" title="3. The meetings we run now" subtitle="Check each meeting against what it is for.">
        <MeetingsReview rows={form.meetings_review} onChange={(rows) => set({ meetings_review: rows })} />
      </Section>

      <Section className="mt-4" title="Four questions, with evidence" subtitle="Yes or no. The evidence is what counts.">
        <EvidenceQuestions answers={form.evidence} onChange={(evidence) => set({ evidence })} />
      </Section>

      <PrimaryButton className="mt-5 w-full" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save my assessment"}
      </PrimaryButton>

      {myAssessments.length ? (
        <Section className="mt-6" title="Assessments you have saved">
          <div className="flex flex-wrap gap-2">
            {myAssessments.map((a) => (
              <button
                key={a.id}
                onClick={() => open(a)}
                className={`min-h-[44px] rounded-xl border px-3 text-sm font-medium transition ${
                  a.id === assessmentId ? "border-navy bg-navy text-white" : "border-border text-navy hover:bg-secondary"
                }`}
              >
                {moment.utc(a.assessment_date).format("D MMM YYYY")}
                {a.staircase_step ? ` · ${a.staircase_step}` : ""}
              </button>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}