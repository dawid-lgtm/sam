export const STAIRCASE = [
  {
    step: "Creativity",
    description: "One person holds the idea and everyone waits to be told what to do.",
    turning_point: "You can no longer do the work yourself.",
  },
  {
    step: "Direction",
    description: "The leader sets the direction and the team carries it out.",
    turning_point: "The plan is bigger than one person's day.",
  },
  {
    step: "Delegation",
    description: "Work moves to people you trust, with clear outcomes and clear limits.",
    turning_point: "You become the bottleneck for decisions.",
  },
  {
    step: "Coordination",
    description: "The parts are managed together: meetings, measures and people line up.",
    turning_point: "Sites start solving each other's problems.",
  },
  {
    step: "Collaboration",
    description: "Everyone improves the system, not just their own part of it.",
    turning_point: "Improvement comes from the crew, not from head office.",
  },
];

export const MATURITY_LEVELS = ["Reactive", "Structured", "Measured", "Self-improving"];

export const MATURITY_AREAS = [
  { key: "maturity_goal", label: "The Goal and the Objectives" },
  { key: "maturity_strategies", label: "Strategies and Tactics" },
  { key: "maturity_meetings", label: "The meetings IN and ON" },
  { key: "maturity_site_head_office", label: "Site and head office" },
  { key: "maturity_behaviours", label: "Behaviours" },
];

export const EVIDENCE_QUESTIONS = [
  "Does every meeting start with the numbers, not with opinions?",
  "Does every action leave the room with one owner and one date?",
  "Is the difference between IN (running the work) and ON (improving the work) clear in each meeting?",
  "Does every site get its answer back within three days?",
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