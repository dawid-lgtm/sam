// TEST DATA ONLY. Made-up person, site and numbers for the v0 demo.

export const person = {
  first_name: "John",
  full_name: "John Carter (test)",
  role: "Production Superintendent",
  site: "North Pit (test)",
  company: "Test Mining Co",
  crew: "B Crew",
  roster: "7 on / 7 off, day shift",
  shift: "06:00 to 18:00",
  reports_to: "Operations Manager (test)",
  team: "4 supervisors, 62 operators",
};

export const programs = [
  {
    id: "superintendent",
    name: "Superintendent program",
    level: "Managing Operations",
    week: 6,
    weeks: 13,
    done: 11,
    total: 24,
    next_step: "Workbook: plan the week (Block 2)",
    steps: [
      { title: "Workbook: the four blocks of your day", status: "done" },
      { title: "Workbook: the Daily Site Review", status: "done" },
      { title: "Lab 1: running the day", status: "done" },
      { title: "Workbook: plan the week (Block 2)", status: "next" },
      { title: "Apply: run two weekly meetings", status: "todo" },
      { title: "Validation Lab", status: "todo" },
      { title: "Verify: observed shift", status: "todo" },
    ],
  },
  {
    id: "strategy",
    name: "Managing Strategy",
    level: "Site leadership team",
    week: 2,
    weeks: 8,
    done: 3,
    total: 12,
    next_step: "Self-assessment: score your site",
    steps: [
      { title: "Read: Goal, Objectives and Strategies", status: "done" },
      { title: "Self-assessment: score your site", status: "next" },
      { title: "Write your site tactics", status: "todo" },
      { title: "Monthly strategy review", status: "todo" },
    ],
  },
];

// Key dates. type: lab | review | meeting | verify
export const keyDates = [
  { date: "2026-11-12", title: "Daily Site Review (extended)", type: "review" },
  { date: "2026-11-17", title: "Weekly planning meeting", type: "meeting" },
  { date: "2026-11-24", title: "Monthly strategy review", type: "review" },
  { date: "2026-12-03", title: "Verify: observed shift", type: "verify" },
];

export const labSessions = [
  { id: "lab-a", date: "2026-11-19", place: "North Pit training room (test)", seats: 4 },
  { id: "lab-b", date: "2026-11-26", place: "North Pit training room (test)", seats: 7 },
  { id: "lab-c", date: "2026-12-08", place: "South Pit crib room (test)", seats: 10 },
];

export const sitePerformance = [
  { label: "Tonnes moved (week)", value: "412 kt", target: "430 kt", pct: 96 },
  { label: "Plan compliance", value: "88%", target: "90%", pct: 98 },
  { label: "Truck hours used", value: "81%", target: "85%", pct: 95 },
  { label: "Shift handovers on time", value: "94%", target: "95%", pct: 99 },
];

export const safetyFocus = [
  { title: "Vehicle interaction", detail: "Positive communication before entering any haul road." },
  { title: "Isolation and lock-out", detail: "Verify zero energy, every time." },
  { title: "Working at heights", detail: "Harness checks at the start of every task." },
  { title: "Fatigue", detail: "Speak up early. Breaks are part of the plan." },
];
