import {
  BLOCK_CHECKLISTS,
  HANDOVER_DECISIONS,
  HANDOVER_SETUP_ITEMS,
  PAVA_ROWS,
  PRESTART_DECISIONS,
  SHIFT_REPORT_SECTIONS,
} from "@/lib/opsContent";
import { arrayToChecklist, checklistToArray } from "@/components/ops/Checklist";
import { arrayToMarks, marksToArray } from "@/lib/opsMarks";

const num = (v) => (v === "" || v == null ? undefined : Number(v));

/** Turn the saved record into the shape the form edits. */
export function hydrateStep(stepId, record) {
  const base = { marks: arrayToMarks(record?.marks), photos: record?.photos || [] };
  if (stepId === "handover" || stepId === "handover_out") {
    const pava = {};
    PAVA_ROWS.forEach((row) => {
      const found = (record?.pava_rows || []).find((r) => r.key === row.key) || {};
      pava[row.key] = { plan: found.plan || "", actual: found.actual || "", variance: found.variance || "", action: found.action || "" };
    });
    const setup = {};
    HANDOVER_SETUP_ITEMS.forEach((item) => {
      const found = (record?.setup_items || []).find((r) => r.key === item.key) || {};
      setup[item.key] = { what: found.what || "", where: found.where || "", name: found.name || "" };
    });
    const decisions = {};
    HANDOVER_DECISIONS.forEach((label, i) => {
      decisions[i] = !!(record?.decisions || []).find((d) => d.label === label)?.checked;
    });
    return { ...base, counterpart_name: record?.counterpart_name || "", pava, setup, decisions };
  }
  if (stepId === "prestart") {
    return {
      ...base,
      fit_to_start: record?.fit_to_start || "",
      changes_to_plan: record?.changes_to_plan || "",
      got_away_with: record?.got_away_with || "",
      said_back: record?.said_back || [],
      scorecard_current: !!record?.scorecard_current,
      scorecard_named_date: record?.scorecard_named_date || "",
    };
  }
  if (stepId.startsWith("b")) {
    return {
      ...base,
      checklist: arrayToChecklist(BLOCK_CHECKLISTS[Number(stepId.slice(1))], record?.checklist),
      data: { ...(record?.data || {}) },
      meeting_held: !!record?.meeting_held,
      meeting_not_available: !!record?.meeting_not_available,
      meeting_time: record?.meeting_time || "",
      meeting_decision: record?.meeting_decision || "",
    };
  }
  return { ...base, data: { ...(record?.data || {}) } };
}

/** Turn the edited form into the record the entity stores. */
export function buildPayload(stepId, form, blockNo) {
  const common = {
    marks: marksToArray(form.marks),
    photos: form.photos || [],
    status: "Done",
    submitted_at: new Date().toISOString(),
    skipped_reason: "",
  };
  if (stepId === "handover" || stepId === "handover_out") {
    return {
      ...common,
      direction: stepId === "handover" ? "In" : "Out",
      counterpart_name: form.counterpart_name || "",
      pava_rows: PAVA_ROWS.map((row) => ({ key: row.key, ...(form.pava?.[row.key] || {}) })),
      setup_items: HANDOVER_SETUP_ITEMS.map((item) => ({ key: item.key, ...(form.setup?.[item.key] || {}) })),
      decisions: HANDOVER_DECISIONS.map((label, i) => ({ label, checked: !!form.decisions?.[i] })),
    };
  }
  if (stepId === "prestart") {
    return {
      ...common,
      fit_to_start: form.fit_to_start || "",
      changes_to_plan: form.changes_to_plan || "",
      got_away_with: form.got_away_with || "",
      said_back: form.said_back || [],
      scorecard_current: !!form.scorecard_current,
      scorecard_named_date: form.scorecard_named_date || "",
    };
  }
  if (stepId.startsWith("b")) {
    const d = form.data || {};
    return {
      ...common,
      block_no: blockNo,
      checklist: checklistToArray(BLOCK_CHECKLISTS[blockNo], form.checklist),
      data: d,
      loads_target: num(d.loads_target),
      loads_mine: num(d.loads_mine),
      loads_system: num(d.loads_system),
      variance: num(d.loads_mine) != null && num(d.loads_target) != null ? num(d.loads_mine) - num(d.loads_target) : undefined,
      meeting_held: !!form.meeting_held,
      meeting_not_available: !!form.meeting_not_available,
      meeting_time: form.meeting_time || "",
      meeting_decision: form.meeting_decision || "",
      operator_counts: form.operator_counts || [],
    };
  }
  return { ...common, data: form.data || {}, signed_at: new Date().toISOString() };
}

/** What stops this step being submitted, in plain words. */
export function stepProblem(stepId, form, { blockReports } = {}) {
  if (stepId === "prestart" && !String(form.got_away_with || "").trim()) {
    return 'Answer "What did we get away with yesterday?" before submitting.';
  }
  if (stepId === "handover" || stepId === "handover_out") {
    const missingName = HANDOVER_SETUP_ITEMS.find((item) => {
      const row = form.setup?.[item.key] || {};
      return String(row.what || "").trim() && !String(row.name || "").trim();
    });
    if (missingName) return `"${missingName.label}" has no name against it. A job or a risk without a name is not handed over.`;
  }
  if (stepId === "b1") {
    const d = form.data || {};
    if (num(d.committed_loads) != null && num(d.loads_target) != null && num(d.committed_loads) < num(d.loads_target) && !String(d.committed_reason || "").trim()) {
      return "Your committed number is under the target: write the reason on the ground.";
    }
  }
  if (stepId === "report" && blockReports) {
    const missing = [1, 2, 3, 4].filter((n) => !blockReports.get(n));
    if (missing.length) return `Block ${missing.join(", ")} report is not in yet. The Shift Report needs all four.`;
  }
  return null;
}