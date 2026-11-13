// Supervisors Sam — all handbook and Apply Tool wording lives here.
// Screens read from this file; nothing is hard-coded in components.

export const OPS_PROGRAM = "ops_supervisors";
export const OPS_PRODUCT = "operations";

export const BLOCKS = [
  { no: 1, name: "Start up", focus: "Operators to their gear, and the first bucket on time." },
  { no: 2, name: "Execution", focus: "Check the counts, watch the whole pit, act on the top delay." },
  { no: 3, name: "Optimise", focus: "Stopwatch, change one thing, coach one operator." },
  { no: 4, name: "Set up and hand over", focus: "Protect the last bucket and set the next crew up." },
];

// The 44 coaching-card lines, plus the "+" line on every card.
export const CARD_LINES = [
  { no: 1, group: "Handover", text: "I read the off-going supervisor's Shift Report and handover sheet before the handover." },
  { no: 2, group: "Handover", text: "Last shift's PAVA is in front of me: loads, loads an hour, buckets an hour, first and last bucket, top delay." },
  { no: 3, group: "Handover", text: "The pit plan was checked against the mud map, and any difference was named." },
  { no: 4, group: "Handover", text: "Every job the last shift left set up, and every job left undone, has a name against it." },
  { no: 5, group: "Handover", text: "What I must leave set up for the next shift is written down, with a name." },
  { no: 6, group: "Handover", text: "The plan across processes was agreed, not assumed." },
  { no: 7, group: "Handover", text: "Contingencies, TARPs and the golden rules are in force, and the crew knows them." },
  { no: 8, group: "Handover", text: "Focus and priority areas are named, with the reason." },
  { no: 9, group: "Handover", text: "Escalated items are recorded, with who they went to." },
  { no: 10, group: "Handover", text: "Key actions for the crew are clear enough to be said back." },
  { no: 11, group: "Handover", text: "The four decisions are made: priorities, contingencies, gear and people, and what is ready for the next shift." },
  { no: 12, group: "Handover", text: "The handover ran to its 30 minutes, and I listened more than I talked." },
  { no: 13, group: "Pre-start", text: "Every work area was checked fit to start, area by area: people, machines, conditions." },
  { no: 14, group: "Pre-start", text: "Anything not fit to start stopped the work, and is recorded." },
  { no: 15, group: "Pre-start", text: "The targets were stated: loads for the shift, loads for each block, and the first and last bucket." },
  { no: 16, group: "Pre-start", text: "Last shift's result and the operator scorecard were on the table." },
  { no: 17, group: "Pre-start", text: "The plan was given operator by operator, by name." },
  { no: 18, group: "Pre-start", text: "Each operator said back the first and last bucket, the targets, the contingencies and the priority areas." },
  { no: 19, group: "Pre-start", text: "A briefing failure was fixed before the operator left the room, or is recorded." },
  { no: 20, group: "Pre-start", text: '"What did we get away with yesterday?" was asked, answered and written down.' },
  { no: 21, group: "Pre-start", text: "Anything the crew raised that changes the plan is recorded, with an owner." },
  { no: 22, group: "Pre-start", text: "The crew was out of the room on time, and the first bucket was still the aim." },
  { no: 23, group: "Block 1 · Start up", text: "Operators were at their gear on time, and every task was manned." },
  { no: 24, group: "Block 1 · Start up", text: "The first bucket came on time." },
  { no: 25, group: "Block 1 · Start up", text: "The targets were checked against the load and haul numbers." },
  { no: 26, group: "Block 1 · Start up", text: "I found what could stop the shift (service due, soft floor, short crew) and fixed or escalated it." },
  { no: 27, group: "Block 2 · Execution", text: "The operators' counts were checked, unit by unit, beside the system's." },
  { no: 28, group: "Block 2 · Execution", text: "I found the top delay and acted on it." },
  { no: 29, group: "Block 2 · Execution", text: "I had one safety interaction at the work." },
  { no: 30, group: "Block 3 · Optimise", text: "I put a stopwatch on three trucks, and changed to the agreed contingency where the numbers said to." },
  { no: 31, group: "Block 3 · Optimise", text: "The circuit, the dig and dump, and the truck allocation were set up well; payload and passes were checked." },
  { no: 32, group: "Block 3 · Optimise", text: "I coached one operator at the work." },
  { no: 33, group: "Block 4 · Set up and hand over", text: "The last bucket was protected, and its time is written down." },
  { no: 34, group: "Block 4 · Set up and hand over", text: "The next shift's areas were inspected and set up." },
  { no: 35, group: "Block 4 · Set up and hand over", text: "What we got away with, what went wrong, and the decisions for the next shift are written down." },
  { no: 36, group: "Shift Report", text: "Every block's numbers are in: target, my figure and the system." },
  { no: 37, group: "Shift Report", text: "Every digger and area is reported: material, loads, loads an hour, buckets an hour, payload and digging hours." },
  { no: 38, group: "Shift Report", text: "Every delay has a unit, minutes, a cause and an action taken." },
  { no: 39, group: "Shift Report", text: "Safety is reported: areas inspected, interactions held, hazards and controls, what we got away with, and any incident or near miss." },
  { no: 40, group: "Shift Report", text: "Support work and statutory reports are reported, with why anything was not done." },
  { no: 41, group: "Shift Report", text: "Every variance says what could have foreseen or avoided it, and whether it reaches the next shift." },
  { no: 42, group: "Shift Report", text: "The gap is written in one line: the number and the cause." },
  { no: 43, group: "Shift Report", text: "The report was done by about 16:00 (checked from the time it was submitted)." },
  { no: 44, group: "Shift Report", text: "The final drive-around was held, I explained the variances first, and the handover to the oncoming crew is complete." },
  { no: "+", group: "Every card", text: "Safe to speak up: people asked, challenged and admitted mistakes without being put down." },
];

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const STEP_LINES = {
  handover: [...range(1, 12), "+"],
  prestart: [...range(13, 22), "+"],
  b1: [...range(23, 26), "+"],
  b2: [...range(27, 29), "+"],
  b3: [...range(30, 32), "+"],
  b4: [...range(33, 35), "+"],
  report: [...range(36, 44), "+"],
  handover_out: [...range(1, 12), "+"],
};

export const linesFor = (stepId) => STEP_LINES[stepId] || [];
export const lineText = (no) => CARD_LINES.find((l) => String(l.no) === String(no))?.text || "";

// The day's steps, in order. Times come from the site settings.
export const STEPS = [
  { id: "handover", label: "Handover", short: "Handover", meeting: null, handbook: "HB p18–20 · Tool 4" },
  { id: "prestart", label: "Pre-start", short: "Pre-start", meeting: null, handbook: "HB p21–23" },
  { id: "b1", label: "Block 1 · Start up", short: "B1", meeting: "Drive-around 09:00", handbook: "HB p24–25 · Tool 5" },
  { id: "b2", label: "Block 2 · Execution", short: "B2", meeting: "Touch-base 11:30", handbook: "HB p25" },
  { id: "b3", label: "Block 3 · Optimise", short: "B3", meeting: "Check-in 14:30", handbook: "HB p25" },
  { id: "b4", label: "Block 4 · Set up and hand over", short: "B4", meeting: "Final drive-around 16:30", handbook: "HB p25, p29, p33" },
  { id: "report", label: "Shift Report", short: "Report", meeting: null, handbook: "HB p29–32 · Tool 6" },
  { id: "handover_out", label: "Handover out", short: "Handover out", meeting: "Handover 17:00", handbook: "HB p33–34" },
];

export const DEFAULT_BLOCK_TIMES = [
  { start: "06:15", end: "09:00", meeting: "Drive-around", meeting_time: "09:00" },
  { start: "09:30", end: "11:30", meeting: "Touch-base", meeting_time: "11:30" },
  { start: "11:45", end: "14:30", meeting: "Check-in", meeting_time: "14:30" },
  { start: "14:45", end: "17:00", meeting: "Final drive-around", meeting_time: "16:30" },
];

export const DEFAULT_SETTINGS = {
  roster_pattern: "7 on / 7 off",
  on_days: 7,
  off_days: 7,
  day_first: true,
  shift_length_hours: 12,
  handover_time: "05:00",
  handover_minutes: 30,
  prestart_time: "06:00",
  prestart_minutes: 15,
  block_times: DEFAULT_BLOCK_TIMES,
  report_due_time: "16:00",
  last_bucket_time: "16:30",
  handover_out_time: "17:00",
  night_offset_hours: 12,
  supervisors_on_shift: 1,
};

export const HANDOVER_AGENDA = [
  { min: 7, item: "Last shift in PAVA" },
  { min: 5, item: "Pit plan vs mud map" },
  { min: 5, item: "What was left set up / what to set up" },
  { min: 5, item: "Plan across processes" },
  { min: 3, item: "Contingencies, TARPs, golden rules" },
  { min: 3, item: "Focus areas" },
  { min: 2, item: "Escalated items" },
];

export const PRESTART_AGENDA = [
  { min: 3, item: "Safety" },
  { min: 3, item: "Targets" },
  { min: 2, item: "Last shift and scorecard" },
  { min: 5, item: "Plan per operator" },
  { min: 2, item: "Said back by name" },
];

// Tool 4 (AT p7)
export const PAVA_ROWS = [
  { key: "loads", label: "Loads" },
  { key: "loads_hr", label: "Loads an hour" },
  { key: "buckets_hr", label: "Buckets an hour" },
  { key: "first_last_bucket", label: "First and last bucket" },
  { key: "top_delay", label: "Top delay" },
];

export const HANDOVER_SETUP_ITEMS = [
  { key: "left_set_up", label: "What the last shift left set up (or did not)" },
  { key: "must_leave_set_up", label: "What I must leave set up for the next shift" },
  { key: "focus_areas", label: "Focus or priority areas, and contingencies in force" },
  { key: "escalated", label: "Things escalated, still to be resolved" },
  { key: "key_actions", label: "Key actions for the crew" },
  { key: "pit_plan", label: "Pit plan checked against the mud map" },
];

export const HANDOVER_DECISIONS = [
  "Priorities for the day",
  "Contingencies",
  "Allocation of gear and people",
  "What to leave ready for the next shift",
];

export const PRESTART_DECISIONS = [
  "Fit to start, area by area (people, machines, conditions) — or work does not start",
  "Anything the crew raised that changes the plan",
];

export const BLOCK_CHECKLISTS = {
  1: [
    { id: "b1-1", text: "Operators to their gear on time; every task manned" },
    { id: "b1-2", text: "Go-lines operating efficiently" },
    { id: "b1-3", text: "Fuel plan in place and kept to" },
    { id: "b1-4", text: "First bucket on time" },
    { id: "b1-5", text: "Every work area inspected and set up for safety" },
    { id: "b1-6", text: "Targets checked against the load and haul numbers" },
    { id: "b1-7", text: "Handover checked: is it correct?" },
    { id: "b1-8", text: "What could stop the shift found (service due, soft floor, short crew)" },
  ],
  2: [
    { id: "b2-1", text: "Operators' counts checked, unit by unit, beside the system's" },
    { id: "b2-2", text: "Whole pit watched: digger digging freely, circuit flowing" },
    { id: "b2-3", text: "Digger operator asked about the work area and trucks" },
    { id: "b2-4", text: "Top delay found and acted on" },
    { id: "b2-5", text: "One safety interaction at the work" },
  ],
  3: [
    { id: "b3-1", text: "Stopwatch on three trucks: hang, queue, load and cycle time" },
    { id: "b3-2", text: "Changed to the agreed contingency; timed again" },
    { id: "b3-3", text: "Circuit running efficiently?" },
    { id: "b3-4", text: "Dig and dump set up well?" },
    { id: "b3-5", text: "Truck allocation right?" },
    { id: "b3-6", text: "Trucks loaded properly? Payload and passes checked" },
    { id: "b3-7", text: "One operator coached at the work" },
  ],
  4: [
    { id: "b4-1", text: "Shift Report done by about 16:00" },
    { id: "b4-2", text: "In the field with your Superintendent" },
    { id: "b4-3", text: "Last bucket protected; its time written down" },
    { id: "b4-4", text: "Next shift's areas inspected and set up" },
    { id: "b4-5", text: "What we got away with, what went wrong and the decisions to place before the work, written down" },
  ],
};

// AT p10–13 block fields.
export const BLOCK_FIELDS = {
  1: [
    { key: "first_bucket", label: "First bucket time", type: "time" },
    { key: "committed_loads", label: "The number I commit at the 09:00 Drive-around (loads)", type: "number" },
    { key: "committed_reason", label: "If it is less than the target: the reason on the ground, and which assumption moved", type: "textarea" },
    { key: "support_needed", label: "What I need fixed that I can't fix myself", type: "textarea" },
  ],
  2: [
    { key: "buckets_hr_target", label: "Buckets an hour: target", type: "number" },
    { key: "buckets_hr_mine", label: "Buckets an hour: my figure", type: "number" },
    { key: "top_delay_cause", label: "Top delay: cause", type: "text" },
    { key: "top_delay_minutes", label: "Top delay: minutes lost", type: "number" },
    { key: "area_decisions", label: "Touch-base decision for each area: continue, correct, prepare or escalate", type: "textarea" },
    { key: "safety_interaction", label: "Safety interaction: who and what", type: "textarea" },
  ],
  3: [
    { key: "stopwatch", label: "Stopwatch: three trucks", type: "stopwatch" },
    { key: "change_made", label: "What I changed", type: "textarea" },
    { key: "expected_effect", label: "What I expected it to do", type: "textarea" },
    { key: "loads_gap", label: "The gap at 14:30 (loads)", type: "number" },
    { key: "hours_left", label: "Shift left (hours)", type: "number" },
    { key: "operator_coached", label: "Operator coached: who and what", type: "textarea" },
  ],
  4: [
    { key: "last_bucket", label: "Last bucket time", type: "time" },
    { key: "got_away_with", label: "What we got away with", type: "textarea" },
    { key: "decisions_before_work", label: "Decisions to make before the work", type: "textarea" },
  ],
};

export const LOAD_FIELDS = [
  { key: "loads_target", label: "Loads target" },
  { key: "loads_mine", label: "Loads: my figure" },
  { key: "loads_system", label: "Loads: the system" },
];

export const MEETINGS = {
  b1: { name: "Drive-around", time: "09:00", asks: "Bring what you saw, not what the plan said. Is your number ready?" },
  b2: { name: "Touch-base", time: "11:30", asks: "Continue, correct, prepare or escalate — for each area." },
  b3: { name: "Check-in", time: "14:30", asks: "What did the stopwatch and the change tell you?" },
  b4: { name: "Final drive-around", time: "16:30", asks: "You explain the variances; the Superintendent checks them." },
};

export const SHIFT_REPORT_SECTIONS = [
  {
    id: "header",
    title: "Header",
    fields: [
      { key: "crew", label: "Crew", type: "text" },
      { key: "superintendent", label: "Superintendent", type: "text" },
      { key: "pit_and_areas", label: "Pit and areas", type: "text" },
      { key: "target_loads", label: "Shift target (loads)", type: "number" },
      { key: "committed_loads", label: "The number I committed at the Drive-around", type: "number" },
    ],
  },
  {
    id: "measures",
    title: "Measures",
    hint: "Plan, actual, variance and impact, and action taken.",
    fields: [
      { key: "first_bucket", label: "First bucket", type: "text" },
      { key: "last_bucket", label: "Last bucket", type: "text" },
      { key: "fuel_plan", label: "Fuel plan", type: "text" },
      { key: "cycle_time", label: "Cycle time", type: "text" },
      { key: "trucks_on_circuit", label: "Trucks on the circuit", type: "text" },
      { key: "measures_actions", label: "Variance, impact and action taken", type: "textarea" },
    ],
  },
  {
    id: "delays",
    title: "Delays",
    hint: "Each with unit, minutes, cause and action taken. Pre-filled from the block reports.",
    fields: [{ key: "delays", label: "Delays and actions", type: "textarea" }],
  },
  {
    id: "safety",
    title: "Safety and the pit",
    hint: "What I found, and the action taken.",
    fields: [
      { key: "areas_inspected", label: "Work areas inspected", type: "textarea" },
      { key: "interactions", label: "Safety interactions held", type: "textarea" },
      { key: "hazards", label: "Hazards found and their controls", type: "textarea" },
      { key: "got_away_with", label: "What we got away with", type: "textarea" },
      { key: "incidents", label: "Incidents and near misses reported", type: "textarea" },
    ],
  },
  {
    id: "support",
    title: "Support work and tasks",
    hint: "Planned / done / if not, why.",
    fields: [
      { key: "dozers", label: "Dozers", type: "text" },
      { key: "graders_water", label: "Graders and water carts", type: "text" },
      { key: "scheduled_tasks", label: "Scheduled tasks and compliance", type: "text" },
      { key: "statutory", label: "Statutory reports", type: "text" },
    ],
  },
  {
    id: "closeout",
    title: "Close-out",
    fields: [
      { key: "gap", label: "The gap, in one line (the number and the cause)", type: "textarea" },
      { key: "variances", label: "Each variance: what could have foreseen or avoided it, and does it reach the next shift", type: "textarea" },
      { key: "went_wrong", label: "What went wrong, and the decisions to make before the work", type: "textarea" },
      { key: "not_finished", label: "Jobs not finished, and what the next crew must finish", type: "textarea" },
      { key: "risks_next", label: "Risks to the next shift, and the jobs it must plan in", type: "textarea" },
      { key: "escalated", label: "Escalated, and still to be resolved", type: "textarea" },
      { key: "emerging", label: "Emerging issues, or changes to the plan for the next shift", type: "textarea" },
      { key: "key_actions", label: "Key actions I need from the next shift", type: "textarea" },
    ],
  },
];

export const PRIME_TASKS = [
  { no: 1, timing: "First shift", title: "Your first shift", prompt: "Walk the pit and write what you see: who is where, what gear is working, what the plan on the board says. Take one photo." },
  { no: 2, timing: "Shifts 1 and 2", title: "The shift in numbers", prompt: "Write the loads, loads an hour, buckets an hour, and the first and last bucket for each shift." },
  { no: 3, timing: "Two shifts, mid-roster", title: "Where the time goes", prompt: "Log what interrupted the shift and how long it cost you, on two shifts." },
  { no: 4, timing: "Mid-roster", title: "Who does what", prompt: "Map your crew: name, machine, and what you rely on them for." },
  { no: 5, timing: "Over the roster, twice", title: "Check it twice", prompt: "Check the same thing on two shifts (for example, first bucket time) and compare what you found." },
  { no: 6, timing: "Later shifts", title: "What your Superintendent expects", prompt: "Write what your Superintendent has told you they expect of you, in their words." },
  { no: 7, timing: "Later shifts", title: "One conversation at the work", prompt: "Talk to one operator about their work area. What did you learn, and what did they need?" },
  { no: 8, timing: "Mid-roster", title: "Quiz — no marks", prompt: "Answer the Prime quiz. There are no scores; it is to show the Lab facilitator where to start." },
  { no: 9, timing: "Last shift", title: "The idea you would keep", prompt: "One thing this roster taught you that you would keep doing." },
  { no: 10, timing: "Last shift", title: "What you would change", prompt: "One thing you would change about how a shift runs." },
];

export const NUDGE_TEXT = {
  handoverSoon: "Handover at {time}. Last shift's report and handover sheet are ready. Open them.",
  handoverCard: "Mark your handover card (lines 1–12) before the pre-start.",
  number: "Work out your number before the pre-start.",
  blockStart: "{block} has started. {focus}",
  blockEnd: "{block} is done. Submit your block report (2 minutes).",
  reportDue: "Shift Report due by about {time}.",
  meeting: "{meeting} at {time}. {asks}",
};