// Wording from the Managing Strategy workbook, Tool 1 (v3). Do not rewrite.
export const STAIRCASE = [
  { step: "Creativity", description: "Run on energy and ideas. The founders decide everything and know everyone.", turning_point: "The founders can no longer run it alone." },
  { step: "Direction", description: "A head office and a structure. Direction comes from the top; the sites follow.", turning_point: "The sites want to decide for themselves." },
  { step: "Delegation", description: "The sites run their own month and are judged on results. Head office steps back.", turning_point: "Head office cannot see whether the sites add up to the plan." },
  { step: "Coordination", description: "Common systems, reports and reviews pull the sites back into one business.", turning_point: "The systems get heavier than the work." },
  { step: "Collaboration", description: "Teams across sites and functions solve problems together. The systems serve the work.", turning_point: "The business outgrows what its people can carry." },
];

export const MATURITY_LEVELS = ["Reactive", "Structured", "Measured", "Self-improving"];

export const MATURITY_AREAS = [
  { key: "maturity_goal", label: "The Goal and the Objectives", cells: [
    "There is a budget. Nobody below the executive can say what business we are really running.",
    "A Goal and Objectives exist, written by the executive and sent to the sites.",
    "Every Objective has a number, a date and one owner. They change only after analysis.",
    "The Objectives are reset on evidence. A Superintendent can name the Objective their work serves, and how." ] },
  { key: "maturity_strategies", label: "Strategies and Tactics", cells: [
    "Head office writes the plan; sites receive numbers.",
    "Sites write a plan to a template; strategy and tactic mean the same thing.",
    "Every Strategy has an owner; every Tactic has a trigger that says it is not working.",
    "Tactics change on results; a stalled Strategy is resourced or stopped, not carried." ] },
  { key: "maturity_meetings", label: "The meetings · IN and ON", cells: [
    "One weekly meeting with everything in it. The business itself is never examined.",
    "Weekly and monthly reviews exist; the monthly is just a fourth weekly.",
    "Weekly IN, monthly ON: the five questions in order, the Strategies tracked, on trend.",
    "The ON meetings improve the business; the weekly never runs past the hour." ] },
  { key: "maturity_site_head_office", label: "Site and head office", cells: [
    "Reporting up is paperwork; nothing comes back.",
    "Sites report monthly; head office reads.",
    "Every site return is read against its Objective; every ask is answered inside the month.",
    "Resources follow the verdicts; what works at one site runs at all sites." ] },
  { key: "maturity_behaviours", label: "Behaviours", cells: [
    "People are careful what they say. Bad news travels slowly.",
    "Behaviours are named but not observed. Meetings run long and decide little.",
    "Behaviours are observed and coached. Meetings start and finish on time.",
    "People raise problems early without cost. Challenge is welcomed." ] },
];

export const EVIDENCE_QUESTIONS = [
  "The executive's weekly meeting runs to an agenda and to time, and ends with decisions.",
  "In a separate meeting, the executive looks at the business itself: the Strategies and the numbers against the plan.",
  "When a site asks head office for something, it gets an answer inside the month: yes, no or a date.",
  "A Strategy that is not working is resourced or stopped at a set point, not carried to year end.",
];

export const ACTION_OPTIONS = ["Keep", "Change", "Stop"];

export function emptyForm() {
  return {
    staircase_step: "",
    turning_point: "",
    maturity_goal: "",
    maturity_strategies: "",
    maturity_meetings: "",
    maturity_site_head_office: "",
    maturity_behaviours: "",
    gaps: "",
    meetings_review: [],
    evidence: EVIDENCE_QUESTIONS.map((q) => ({ question: q, answer: "", evidence: "" })),
  };
}
