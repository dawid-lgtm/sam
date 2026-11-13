# Supervisors Sam: build brief for Base44

**From:** Dawid Falck, The Decision Architecture Group
**To:** Base44
**Date:** 13 November 2026 (Australia/Perth)
**Repo:** `dawid-lgtm/sam`, branch `main` (read against commit `9bd626e`)
**Product:** Supervisors Sam, under the Managing Operations program

**Source documents.** These are binding. The page numbers are the printed "Page X of N".
- `docs/Supervisor-Handbook.pdf`: Managing Operations Part A Supervisor Handbook, 46 pages. Cited as "HB p".
- `docs/Supervisor-Prime-Workbook.pdf`: 16 pages. Cited as "Prime p".
- `docs/Supervisor-Apply-Tools.pdf`: Tools 1–9, 21 pages. Cited as "AT p". AT p3 says: "The same tools will be in Sam."

This brief sits alongside `docs/SAM-UPDATE-2026-11-13.md` (Strategy Sam). The shared rules in that brief also apply here:
- multi-tenant `customer_id` and site scoping (P1-1, P1-2);
- invites that keep site and role (P1-4);
- no test data on real screens (P1-3, P1-6);
- the next-step card, gating and nudges (P1-8);
- the shared program engine (Section 5).

Do not build these twice. Supervisors Sam is the first real user of that engine.

---

## 0. The idea in one page

Supervisors Sam is **two linked modules that share one login, one profile and one cohort.**

| | **Module 1: Training** | **Module 2: 4 Block Field Coach** |
|---|---|---|
| What it is | Takes a supervisor through the program: Prime, the Validation Lab, then Verify | An in-field coaching tool on the supervisor's phone, every shift. Not a course. |
| Device | Laptop or tablet first; works on a phone | **Phone first**, one-handed, in a ute or at the face, with poor signal |
| When | From enrolment until the Validation Lab, then Verify | Unlocked when the Lab is complete. Used every shift for the 6–8 weeks of Apply, **then for good**: after the program it becomes the supervisor's home screen |
| What it does | Prime tasks, Lab materials, the handbook released at the Lab, the Verify observation | Nudges, guides and coaches through the five stepping stones and the four blocks of **every shift**. The supervisor ticks off tasks, enters performance data, takes photos and submits evidence, and submits a **block report at the end of each block**. The Superintendent coaches from the same data. |
| Without Dawid? | Yes. A client facilitator or Superintendent runs it from the screens | Yes. The phone tells the supervisor what to do next, all shift |

**Priority.** The Field Coach is the P1 centrepiece. It is the product. The Training module is P1 only as far as a pilot needs it (Section 3): Prime, the Lab unlock and Verify.

**The four blocks are inside one shift. They are not weeks of a roster.** The handbook (HB p24–28) splits every shift into four blocks of two to three hours:

| Block | Name | Times (day shift) |
|---|---|---|
| Block 1 | Start up | 06:15–09:00 |
| Block 2 | Execution | 09:30–11:30 |
| Block 3 | Optimise | 11:45–14:30 |
| Block 4 | Set up and hand over | 14:45 to the end of the shift |

Blocks 1–3 each end with a meeting with the Superintendent: the Drive-around at 09:00, the touch-base at 11:30 and the check-in at 14:30. So a supervisor submits **four block reports every shift**, plus the handover, pre-start and Shift Report records. The roster is the frame that repeats those shifts (Section 2.1).

---

## 1. Where it goes in the app (current code)

What exists today, and what to do with it:

- **Products.** The `Product` entity (`base44/entities/Product.jsonc`) and `ProgramCard`, `Tool` and `CardProgress` are generic.
  - Create or confirm one Product for Managing Operations (key `operations`; `src/lib/products.js` maps it to `progress_sam`). Add Supervisors Sam as a program under it (key `ops_supervisors`).
  - Leave a slot for `ops_superintendents` (Section 9).
- **Navigation.** `src/components/AppNav.jsx` has no Managing Operations tab for client users today. Add an **Operations** tab, shown to anyone enrolled in an Ops program.
  - Before the Lab, the tab opens the Training module.
  - After the Lab, it opens **Today** (the Field Coach).
  - Once Apply ends, **Today replaces Home** for supervisors (Section 2.9).
- **The four-blocks widget.** `src/components/home/FourBlocks.jsx` is hard-coded to the **Superintendent's** day (blocks from 05:00, 10:00, 11:45, 14:45, with "The meetings" and "People and plan"). It is shown to any role on Home (`src/routes/_authed/index.jsx` lines 150 and 212).
  - Drive it from the person's role and their site's shift times.
  - For supervisors, use the supervisor blocks in this brief.
  - Keep the Superintendent version for Superintendents Sam.
- **`FourBlockDay` entity and `FourBlockLog` / `FourBlockCard` (master).** These are an admin-only tally (person, role, date, `blocks: 4`). Replace them with the real `Shift` and `BlockReport` records below. The master four-block counts must read from `Shift`.
- **`src/routes/_authed/program.$programId.jsx`.** It reads fake data from `homeTestData.js`. Replace it with the real program runner (SAM-UPDATE P1-5 and Section 5). Supervisors Sam must not show any test data.
- **Offline.** `src/lib/offline.js` queues saves for the Strategy entities only (`LIST_KEY`). Extend it to every Field Coach entity, and add a photo queue (Section 6).
- **Roles.** `src/lib/access.js` has `administrator`, `executive`, `project_manager`, `project_lead` and `site_lead`. Add:
  - `supervisor`;
  - `superintendent` (coach of named supervisors);
  - `facilitator` (runs a cohort's Lab, sees Prime answers; may be one of ours or a client trainer).
  - Site scoping follows `canEditSite`.

---

## 2. Module 2: the 4 Block Field Coach (P1 centrepiece)

### 2.1 Setup: roster, shifts and times (done once per site, editable)

A site administrator or Superintendent sets this up. The supervisor confirms their own crew and roster on first login.

| Setting | Default (from the book) | Notes |
|---|---|---|
| Roster pattern | e.g. 7 on / 7 off, or 14/14; day shifts then night shifts | Free pattern: on-days, off-days, and day/night order. Generates the supervisor's shift calendar. |
| Roster start date | — | The first shift of the first Apply roster. |
| Shift length | 12 hours | HB p15 worked example |
| Handover | 05:00, 30 min, office | HB p18 |
| Pre-start | 06:00, 15 min | HB p21. Crew out of the room by 06:15. |
| Block 1 · Start up | 06:15–09:00; Drive-around 09:00 | HB p24–25 |
| Block 2 · Execution | 09:30–11:30; touch-base 11:30 | HB p25 |
| Block 3 · Optimise | 11:45–14:30; check-in 14:30 | HB p25 |
| Block 4 · Set up and hand over | 14:45 to the end of the shift. Shift Report by about 16:00; last bucket about 16:30; final drive-around 16:30–16:50; handover 17:00 | HB p25, p29, p33 |
| Superintendent slots | One supervisor: 09:00 / 11:30 / 14:30 / 16:30. Several supervisors take turns: final drive-around 15 min each with two supervisors (16:30, 16:45), 10 min each with three (16:30, 16:40, 16:50) | HB p26, p33. "Your block runs on until your turn." |
| Night shift | Same four blocks, with no Drive-around, no check-ins and no final drive-around unless a Superintendent is on duty (then use the day-shift pattern) | HB p26. Night clock times: **[DAWID TO CONFIRM]**. Default: day times + 12 h. |

Rules:
- "Times are indicative. Your site can change them. The order does not change." (AT p3)
- "The four blocks are fixed, and so are the touch-base and the check-in. Timing changes need your Superintendent's approval." (HB p25)
- So a time change made by a supervisor is saved as **pending Superintendent approval**. A site admin can change site defaults directly.

### 2.2 The shift flow: what the phone shows, in order

The **Today** screen always shows one big **"Now" card**:
- the current step;
- what to do next, in handbook words;
- the time left;
- one primary button.

Below it is a strip of the day: Handover · Pre-start · B1 · B2 · B3 · B4, each with a status: Not started, Due, Done, or Late.

The card lines are the handbook line numbers (1–44, plus "+" on every card). "The number is the line's ID in Sam" (AT p3). Use those numbers as fixed IDs.

**Every card works the same way:**
- Each line is a tick-box.
- Each line can be marked Yes or No.
- Every **No** must have an action, an owner and a date before the card can be submitted.
- The "+" line ("Safe to speak up: people asked, challenged and admitted mistakes without being put down") is on every card.

**Any line can be "Not available yet at my site".** It needs a short reason and alerts the Superintendent (AT p3). It does not count as a No.

#### Step 1. The handover (05:00, 30 min, office)

Source: HB p18–20; AT p7–8 (Tool 4).

Before the handover:
- The supervisor sees the off-going supervisor's Shift Report and handover sheet for this crew and area. These are pulled from Sam, not retyped.

Agenda, with timers (HB p19, 30 min):

| Min | Item |
|---|---|
| 7 | Last shift in PAVA |
| 5 | Pit plan vs mud map |
| 5 | What was left set up / what to set up |
| 5 | Plan across processes |
| 3 | Contingencies, TARPs, golden rules |
| 3 | Focus areas |
| 2 | Escalated items |

What the supervisor records:

**Tool 4 handover sheet** (AT p7):
- Last shift in PAVA. Rows: loads, loads an hour, buckets an hour, first and last bucket, top delay. Columns: Plan, Actual, Variance and impact, Action taken.
- Set up, and to set up. Each row has "What, and where" and a **Name**:
  - What the last shift left set up (or did not);
  - What I must leave set up for the next shift;
  - Focus or priority areas, and contingencies in force;
  - Things escalated, still to be resolved;
  - Key actions for the crew;
  - Pit plan checked against the mud map.

**Decisions** (HB p18), each ticked:
1. Priorities for the day.
2. Contingencies.
3. Allocation of gear and people.
4. What to leave ready for the next shift.

Rule (HB p19): "a job to set up, or a risk, without a name is not handed over". The app will not save an item without a name.

**Coaching card, lines 1–12 plus "+"** (HB p20). Self-marked at the end of the handover.

Also:
- **Photo:** the mud map or pit plan (optional, recommended).
- **Tool 1, Work out your number** (AT p4), done before the pre-start. Six steps:
  1. Shift volume (bcm or t)
  2. Loads
  3. Digging hours
  4. Loads an hour (and per truck)
  5. Buckets a load
  6. Buckets a minute / seconds a bucket
- The app does the arithmetic and shows the one-sentence line: "We need __ loads this shift: that is __ an hour, __ per truck per hour, and a bucket every __ seconds."
- First bucket and last bucket times, and the loads target for each block (B1–B4) and for the shift.
- Units: loads, and buckets per hour. "Buckets a minute and seconds a bucket are only for checking at the face." (AT p4)
- Note: the handover does **not** commit the number. That waits for the Block 1 Drive-around (HB p18).

#### Step 2. The pre-start (06:00, 15 min)

Source: HB p21–23; AT p9.

Agenda, with timers (HB p22, 15 min): Safety 3; Targets 3; Last shift and scorecard 2; Plan per operator 5; Said back by name 2.

What the supervisor records:
- **Decisions** (HB p21):
  1. Fit to start, area by area (people, machines, conditions), or work does not start.
  2. Anything the crew raised that changes the plan.
- **The answer to "What did we get away with yesterday?"** (HB p10, p21). This is a required text field. It feeds the safety trend.
- **Said back by name.** A checklist of the crew, each ticked when they said back first and last bucket, targets, contingencies, priority areas and the risks to the numbers.
  - "An operator who cannot say first and last bucket, the targets, the contingencies and the priority areas is a briefing failure." (HB p22)
  - The app asks "Fixed before they left the room?" for any unticked operator.
- **Coaching card, lines 13–22 plus "+"** (HB p23).
- **Tool 3, operator scorecard** (AT p6). The supervisor confirms it is up to date. At least once a roster, they record that the top performers were named and congratulated (date). The app reminds them if this hasn't happened by the second-last shift of the roster.

#### Step 3. Time in field: the four blocks

Source: HB p24–28; AT p10–13 (Tool 5); AT p5 (Tool 2).

Each block has:
- a **checklist** of what to check in that block (HB p25), ticked as the supervisor goes;
- data fields;
- the block's **coaching card lines**;
- a **Submit block report** button at the end.

| Block | Check in this block (HB p25), ticked as you go | Data to enter (AT p10–13) | Card lines | Ends with |
|---|---|---|---|---|
| **1 · Start up** 06:15–09:00 | Operators to their gear on time; every task manned · Go-lines operating efficiently · Fuel plan in place and kept to · First bucket on time · Every work area inspected and set up for safety · Targets checked against the load and haul numbers · Handover checked: is it correct? · What could stop the shift found (service due, soft floor, short crew) | First bucket time · Loads: target / my figure / the system · **The number I commit at the 09:00 Drive-around** (loads) · if it is less than the target: the reason on the ground and which assumption moved (HB p24) · what I need fixed that I can't fix myself | 23–26 + | **Drive-around 09:00** with the Superintendent. Night shift: commit the number at the top of the Shift Report instead. |
| **2 · Execution** 09:30–11:30 | Operators' counts checked, unit by unit, beside the system's · Whole pit watched: digger digging freely, circuit flowing · Digger operator asked about the work area and trucks · Top delay found and acted on · One safety interaction at the work | Loads: target / my figure / the system · Buckets an hour: target / my figure · Top delay: cause, minutes lost · **Touch-base decision for each area: continue, correct, prepare or escalate** · safety interaction: who and what (short) | 27–29 + | **Touch-base 11:30** |
| **3 · Optimise** 11:45–14:30 | Stopwatch on three trucks: hang, queue, load and cycle time · Changed to the agreed contingency; timed again · Circuit running efficiently? · Dig and dump set up well? · Truck allocation right? · Trucks loaded properly? Payload and passes checked · One operator coached at the work | **Stopwatch table:** 3 trucks × hang (s), queue (s), load (s), cycle (min), plus target. Build an in-app stopwatch with lap buttons. · What I changed, and what I expected · The gap at 14:30 (loads) and shift left (hours) · operator coached: who and what | 30–32 + | **Check-in 14:30** |
| **4 · Set up and hand over** 14:45–end | Shift Report done by about 16:00 (Step 4) · In the field with your Superintendent · Last bucket protected; its time written down · Next shift's areas inspected and set up · What we got away with, what went wrong and the decisions to place before the work, written down | Last bucket time · Loads, shift total: target / my figure / the system · What we got away with · Decisions to make before the work | 33–35 + | **Final drive-around 16:30–16:50, then handover 17:00** (Step 5) |

**Operator counts (Tool 2, AT p5).** One card per operator per shift. At the end of each block the operator writes loads, buckets (digger), payload (truck), and delays with cause and minutes. The supervisor checks them in person.
- For P1, the supervisor enters each operator's block figures into Sam (or photographs the paper card).
- The app totals them to give "my figure" for the block.
- Operators do **not** need logins in P1.

**Block report: what "Submit block report" sends.** The book defines the content of each block card (AT p10–13), not a separate "block report". The block report is that card plus the block's numbers and evidence. **[DAWID TO CONFIRM this definition.]**

| Field | Source |
|---|---|
| Supervisor, crew, site, pit and areas, date, shift (day/night), block no. | AT p10–13 header |
| Planned and actual start/end of the block; submitted-at time (on time / late) | Book block times |
| Checklist items ticked (HB p25), each with optional note and photo | HB p25 |
| Block data fields (table above) | AT p10–13 |
| Loads: target / my figure / the system; variance (calculated) | AT p10–13 |
| Operator count entries for the block (Tool 2) | AT p5 |
| Card lines for the block, each Yes / No / Not available yet; "+" line | HB p28 |
| Actions from any No: action, owner, by date | HB p28 |
| Superintendent meeting held? (Drive-around / touch-base / check-in), at what time, and the decision taken | HB p24–26 |
| Evidence: photos (e.g. go-line, work area set up, delay cause, bund, floor) with caption, GPS and time | New |
| Escalations raised (what, to whom) | HB p24 |

**Submitting a block report automatically fills the matching parts of the Shift Report** (Tool 6). The supervisor never types a number twice.

#### Step 4. Time in office (in Block 4): the Shift Report, Tool 6

Source: HB p29–32; AT p14–17.

The Shift Report builds up through the blocks and must be finished by about 16:00 (HB p29). The app pre-fills it from the handover, Tool 1 and the four block reports, and the supervisor completes the rest.

Use the **corrected Tool 6 field list**. This matches the handbook template on HB p31–32 and card line 37. The printed AT pp14–15 is missing some of these fields and is being corrected.

**Header**
- Supervisor, crew, Superintendent, date, shift (day/night), **pit and areas**.
- The shift target (loads).
- The number I committed at the Drive-around (written before Block 2).

**Production by digger.** For each digger and area:
- material;
- loads plan / actual;
- loads an hour plan / actual;
- buckets an hour plan / actual;
- payload plan / actual (bcm or t);
- digging hours plan / actual;
- variance and impact;
- action taken.

**By block.** For blocks 1–4 and the shift: loads plan, loads actual (my figure), the system, variance and impact, action taken. Auto-filled from the block reports.

**Measures.** Plan, actual, variance and impact, and action taken for each of:
- first bucket;
- last bucket;
- **fuel plan**;
- cycle time;
- trucks on the circuit.

**Delays.** Each with unit, minutes, cause and action taken. Pre-filled from Tool 2 and the Block 2 top delay.

**Safety and the pit.** Each with "What I found" and "Action taken":
- work areas inspected;
- safety interactions held;
- hazards found, and their controls;
- what we got away with;
- **incidents and near misses reported**.

**Support work and tasks.** Columns: planned / done / if not, why. Rows:
- dozers;
- graders and water carts;
- scheduled tasks and compliance;
- **statutory reports**.

**Close-out**
- The gap, in one line (the number and the cause).
- Each variance: what could have foreseen or avoided it, and does it reach the next shift.
- **What went wrong, and the decisions to make before the work.**
- Jobs not finished, and what the next crew must finish.
- Risks to the next shift, and the jobs it must plan in.
- Escalated, and still to be resolved.
- **Emerging issues, or changes to the plan for the next shift.**
- Key actions I need from the next shift.

**Sign-off.** Signed (supervisor) and received (Superintendent), with timestamps.

**Coaching card, lines 36–44 plus "+"** (AT p16, HB p30). Line 43 ("Done by about 16:00") is checked automatically from the submit time, and the supervisor can override it with a note.

**Actions page** (AT p17):
- For each variance: closed / carried / escalated, owner, by date.
- The coaching point (one), and whether it was checked at the next final drive-around.
- The decision made live, put forward as a rule.

#### Step 5. Handover to the next crew (in Block 4)

Source: HB p33–34.

- **Final drive-around** with the Superintendent, 16:30–16:50. The supervisor explains the variances; the Superintendent checks them, "never the other way round" (HB p34).
- **Decisions:**
  1. What needs escalating, clearly defined and agreed.
  2. The key actions needed from the next shift.
- **The handover at 17:00** uses the same agenda and card as Step 1 (lines 1–12). There is no separate card (HB p34). The supervisor fills in the Tool 4 handover sheet for the oncoming supervisor, and it appears in that supervisor's Step 1 the next shift.
- Night shift: the variances are explained at the start of the morning handover, with the day Superintendent (HB p33).
- A cause seen for the third time is flagged automatically as a "system finding for the week" (HB p34), visible to the Superintendent with its evidence.

### 2.3 Roster-level tools (not every shift)

| Tool | When | What the app does |
|---|---|---|
| Tool 3 · Operator scorecard (AT p6) | Each roster | Built automatically from the Tool 2 counts: loads an hour trend over the roster, % against target, first bucket on time. Supervisor marks the top performers and the date they were named. |
| Tool 8 · Six behaviours self-evaluation (AT p19, HB p9) | Each roster | Plan, Assign, Watch, Respond, Fix, Report. Each rated Displayed Y/N and Instilled Y/N, with an example behind each Yes. One behaviour to work on, and what the Superintendent will look for. Both sign in the app. |
| Time in the seat (HB p9) | Each roster | Two hours doing an operator's job, plus one thing noticed. A checklist item with date and note. |
| HRO check (HB p10) | Once a roster | The Superintendent checks the five HRO principles with the supervisor: Yes/No, with evidence. |
| Tool 7 · Assumptions I inherited (AT p18) | Each quarter, and when the ground changes | Assumption rows from AT p18, each with: planned (with unit), what I see over the roster, matches Y/N, so what for my number. Also: said at the Drive-around on (date), and the Superintendent's answer. |
| Tool 9 · Fault tree (AT p20, HB p39–41) | When a loss keeps coming back | The loss and its size; lever → branch → second → third level → foundation bar; evidence; the cause; the fix, owner and date. Suggested by the app when the same delay cause appears 3 times (HB p34). |

### 2.4 Nudges and notifications

Notifications go to the phone (web push for the PWA; native push if store-wrapped later) and also appear in-app. Every one deep-links to the exact screen. Times follow the site's shift settings.

| When | Nudge (example text) |
|---|---|
| 15 min before handover | "Handover at 05:00. Last shift's report and handover sheet are ready. Open them." |
| Handover start + 30 min, card not done | "Mark your handover card (lines 1–12) before the pre-start." |
| Before pre-start, Tool 1 not done | "Work out your number before the pre-start." |
| Each block start | "Block 2 · Execution has started. Check the operators' counts against the system's." (block focus in one line, HB p24) |
| Mid-block | One coaching prompt from the block's checklist that isn't ticked yet, e.g. "Have you had your safety interaction at the work?" |
| 15 min before each Superintendent meeting | "Drive-around at 09:00. Bring what you saw, not what the plan said. Is your number ready?" |
| Block end | "Block 1 is done. Submit your block report (2 minutes)." |
| Block report 20 min overdue | Second nudge to the supervisor. |
| Block report 60 min overdue | Supervisor and Superintendent alerted. Marked "late" on the dashboard. |
| 15:30 | "Shift Report due by about 16:00. 4 sections left." |
| 16:15, Shift Report not submitted | Supervisor alerted. Superintendent alerted at 16:30. |
| Next shift start | Unclosed actions from any No are shown on the Now card. |
| Roster: second-last shift | "Name and congratulate your top performers this roster." "Tool 8 self-evaluation due." "Time in the seat not logged." |
| Apply: 2 weeks before the end | "Apply ends on [date]. Verify is booked for [date]." Superintendent gets the same. |

Settings:
- The supervisor can snooze a nudge (15 min) but cannot switch off block-report nudges during Apply.
- Quiet hours follow the roster: no nudges on days off.

### 2.5 Evidence: photos and uploads

- Every checklist item and every card line can take a **photo or file**: camera first, gallery second.
- Each one is saved with time, GPS (where allowed), shift and block.
- Captions are optional.
- Photos are compressed on the phone (for example to 1600 px max), stored offline and uploaded when there is signal.
- Some items are "evidence recommended" (for example, mud map at handover, go-line, next shift's areas set up). P1: none are mandatory. **[DAWID TO CONFIRM any mandatory photos.]**
- Stored per customer, not publicly fetchable. The same rule as logos in SAM-UPDATE.

### 2.6 Tracking and progress

The supervisor sees:
- **This shift:** 7 steps (handover, pre-start, B1–B4, Shift Report and final handover). Each is Done, Late or Missed.
- **This roster:**
  - shifts completed;
  - block reports on time (%);
  - Shift Reports by 16:00 (%);
  - the committed number vs actual, trended;
  - the Yes rate by card line;
  - open actions.
- **Apply progress:** week X of 6–8, and the readiness checks for Verify (Section 3.4).
- **Streaks and encouragement.** Short, factual praise, e.g. "8 shifts in a row with your Shift Report done by 16:00." No points or badges for P1.

**The Superintendent dashboard** (P1) shows each supervisor they coach:
- today's status per step (live);
- late or missing block reports and Shift Reports;
- the number committed vs actual;
- each No line with its action;
- "Not available yet" items;
- the trend for each card line over the roster (which lines are most often No, i.e. what to coach next);
- system findings (causes seen 3+ times).

### 2.7 Superintendent: coaching from the data

- Receives each Shift Report and marks it **Received** (Tool 6 sign-off).
- Can comment on any block report, card line or photo. The comment is pushed to the supervisor.
- Leaves **one coaching point** per shift on the actions page (AT p17). It is checked at the next final drive-around (HB p34).
- Approves or rejects block-time changes (HB p25).
- Marks the roster checks (Tool 8 co-sign, HRO check).
- The card lines are the supervisor's self-evaluation. The Superintendent coaches; they do not grade. A No is "the next thing to fix" (HB p28). Show it that way: no red "fail" screens.
- During Apply, **block reports do not need Superintendent approval** to count as done. Only Shift Reports are "received". **[DAWID TO CONFIRM.]**

### 2.8 Gating inside the Field Coach

- A block's report can't be submitted until its card lines are all marked and every No has an action, owner and date.
- The Shift Report can't be submitted until the four block reports are in. Block 4 can be submitted after the Shift Report, so allow that order.
- The supervisor can always **skip with a reason** ("radio call to an incident", "no Superintendent on site"). The reason is recorded and shown to the Superintendent. A skipped step counts as "Missed (reason)", not Done.
- If a step needs the Superintendent and they are not there: "do the step, write it down, and take it to them at the next meeting" (AT p3). The app offers "Superintendent not available" as an option that carries the item to the next meeting.

### 2.9 After the program: the Field Coach continues

When Verify is signed off:
- the program shows as complete;
- **Today** becomes the supervisor's home screen and carries on indefinitely, with the same flow, tools and dashboard;
- the nudge intensity can be lowered by the site (for example, block reminders only).

Coaching-card marking stays on by default. **[DAWID TO CONFIRM:** after Apply, are card lines marked every shift or once a roster?**]**

---

## 3. Module 1: Training (Prime → Validation Lab → Verify)

Built on the shared engine in SAM-UPDATE Section 5 (Program → Stage → Cards; Cohort; Enrolment; Facilitator role).

### 3.1 Cohort setup (client admin or facilitator)

Each cohort records:
- customer;
- site;
- the supervisors and their Superintendents;
- Lab date and place;
- facilitator;
- Prime start (the supervisor's next roster);
- **Apply length: 6, 7 or 8 weeks (default 6)**;
- Verify date (auto-set to the week after Apply ends; editable).

The handbook's lead-in also applies: "Before you start, your Superintendent starts their own program" (HB p5). P2: when Superintendents Sam exists, warn if a supervisor's Superintendent isn't enrolled.

### 3.2 Prime (over one roster, on shift)

Source: Prime p3–15.

- 10 tasks with the roster timing from Prime p3:
  - Task 1: first shift.
  - Tasks 2: shifts 1 and 2.
  - Task 3: two shifts, mid-roster.
  - Task 4: mid-roster.
  - Task 5: over the roster, twice.
  - Tasks 6 and 7: later shifts.
  - Task 8: mid-roster (quiz, no marks).
  - Tasks 9 and 10: last shift.
- Each task is a card: the question, table or stopwatch fields, plus photo upload.
- Nudges follow that timing: "about 15 minutes on a shift. It is not homework for the end of a 12-hour day." (Prime p3)
- "If a figure, a meeting or a person is not available, write that down. It is a finding, not a failure." This is the same "Not available yet" option as in Apply.
- **Hard content lock.** Before the Lab, the supervisor must **not** see any of the following anywhere in the app (no tab, card, help link or nudge):
  - the four blocks;
  - the five stepping stones;
  - the new handover or pre-start agendas;
  - the Shift Report;
  - the Apply tools;
  - the handbook.

  This includes the Home four-blocks widget. During Prime the supervisor sees only Prime.
- The Superintendent can see a supervisor's Prime progress, not the answers' scores. There are no scores.

### 3.3 The Validation Lab (one day)

- **Facilitator view:**
  - every supervisor's Prime answers, by task, side by side (for example, all the Task 3 time logs, all the Task 9 roster ideas);
  - export as CSV and PDF;
  - a "Questions and won't-work-here" wall the facilitator can fill in on the day;
  - the Task 8 quiz answers next to the model answers.
- **Attendance:** the facilitator marks each person present. **Lab complete** is set per person by the facilitator (or a client admin).
- **On Lab complete, for that person:**
  - the handbook (PDF and in-app reading) is released;
  - the Apply tools and the 4 Block Field Coach are unlocked;
  - the setup wizard runs (roster, shift times, crew, operators, diggers and trucks, Superintendent);
  - Apply week 1 starts on their next rostered shift.
- **Validation check** (end of the Lab): short questions answered in the app, then shown to the facilitator as "what to coach first on your roster". Not pass/fail.
- **First-shift commitment:** each person writes one thing they will do on their first shift. It shows on their Now card on shift 1.

### 3.4 Apply (6–8 weeks) and Verify

- Apply happens entirely in the Field Coach (Section 2).
- **Verify** is "One shift observed, Yes or No against the cards" (HB p5). The observer is the Superintendent or facilitator. **[DAWID TO CONFIRM who.]**
- The observer opens a Verify form on their own device for one booked shift. It shows the same cards (lines 1–44, plus "+") for that supervisor's shift, marked Yes/No by the observer, beside the supervisor's own marks. There's a notes field, photo evidence and a sign-off.
- **Verify result:** signed off, or "repeat" with the lines to work on and a new date. **[DAWID TO CONFIRM:** is there a pass threshold?**]** Default: no threshold; the observer decides and signs.

---

## 4. Data model (new entities)

All entities carry `customer_id` and `site_id`, with RLS:
- a supervisor sees their own records;
- their Superintendent sees the records of supervisors they coach;
- a client admin sees their customer;
- the facilitator sees their cohort;
- super admin sees everything.

| Entity | Key fields |
|---|---|
| `OpsCohort` | customer_id, site_id, program_key (`ops_supervisors`), facilitator_id, lab_date, lab_place, apply_weeks (6–8, default 6), verify_date, status |
| `OpsEnrolment` | cohort_id, user_id, role (supervisor), superintendent_id, stage (Prime / Lab / Apply / Verify / Complete), prime_started, lab_completed_at, lab_completed_by, apply_start, apply_end, verify_result |
| `PrimeResponse` | enrolment_id, task_no (1–10), answers (object), photos[], submitted_at |
| `ShiftSetting` | site_id, roster_pattern, shift_length, handover_time, prestart_time, block_times[4] (start, end, meeting name and time), report_due_time, last_bucket_time, final_drive_window, handover_out_time, night_shift_offset, approved_by |
| `Roster` | user_id, start_date, pattern, shifts[] (date, day/night) |
| `Shift` | user_id, date, day_night, crew, pit_and_areas, superintendent_id, status per step, target_loads, committed_loads, committed_at |
| `HandoverRecord` | shift_id, direction (in / out), Tool 4 PAVA rows, setup items[] (what, where, name), decisions[4], counterpart_supervisor_id |
| `PrestartRecord` | shift_id, decisions[2], got_away_with, said_back[] (operator, ok), scorecard_current |
| `NumberWorkout` (Tool 1) | shift_id, volume, unit, payload, loads, digging_hours, loads_hr, trucks, buckets_load, buckets_min, secs_bucket, block_targets[4], first_bucket, last_bucket |
| `BlockReport` | shift_id, block_no (1–4), planned/actual start and end, submitted_at, on_time, checklist[] (item_id, done, note, photo_ids), data (object per block, see 2.2), loads_target, loads_mine, loads_system, meeting_held, meeting_time, meeting_decision, escalations[], skipped_reason |
| `OperatorCount` (Tool 2) | shift_id, operator_name, machine, area, block_no, loads, buckets, payload, delays[] (cause, minutes), checked |
| `ShiftReport` (Tool 6) | shift_id, all the corrected Tool 6 fields (2.2 Step 4), signed_at, received_by, received_at |
| `CardMark` | parent (type and id), line_no (1–44 or "+"), value (Yes / No / NA_not_available), note, action, owner, by_date, action_status |
| `Evidence` | parent (type and id), file_uri (private), caption, taken_at, gps, uploaded_at |
| `CoachingNote` | shift_id or parent, superintendent_id, text, coaching_point (bool), checked_next_shift (Y/N) |
| `RosterCheck` | user_id, roster_id, type (Tool 8 / time in seat / HRO / top performers / Tool 3), data, signed_by_supervisor, signed_by_superintendent |
| `AssumptionCheck` (Tool 7) | user_id, date, rows[] (assumption, planned, seen, matches, so_what), drive_around_date, superintendent_answer |
| `FaultTree` (Tool 9) | user_id, loss, size, unit, levels (object), evidence, cause, fix, owner, by_date |
| `VerifyObservation` | enrolment_id, shift_id, observer_id, marks[] (line_no, value), notes, photos, result, signed_at |
| `Nudge` | user_id, type, due_at, sent_at, opened_at, snoozed_until, deep_link |

The card line text (1–44 plus "+"), the block checklists, agendas and nudge texts live in **one content file**, for example `src/lib/opsSupervisorContent.js`, taken word for word from the handbook and Apply Tools. Screens read from it; nothing is hard-coded in components.

---

## 5. Phone and in-pit design rules

- **One-handed, big targets:** minimum 48 px, high contrast, readable in sun, dark mode for night shift.
- **Fewest taps.** Number pads for numbers. Calculated fields filled automatically. "Same as plan" shortcuts.
- **A block report must take 2 minutes or less** for a normal block. Test it.
- **The Now card is always one tap from anywhere.**
- Shift times use the phone's local time zone (sites are usually Australia/Perth time).

## 6. Offline (in-pit coverage is patchy)

- The whole shift must work offline: the Today screen, cards, block reports, the Shift Report, photos and the stopwatch.
- Extend `src/lib/offline.js` `LIST_KEY` to the new entities.
- Queue photos separately (they're large) and upload in the background.
- Show "Saved on phone · will send when you have signal" on every submit.
- Nudges must still fire offline. Schedule them on the device for the shift ahead, as local notifications where the platform allows.
- Fix the offline issues already raised in SAM-UPDATE (expired token, user switch on a shared device, retry rules) before the pilot. Field phones are often shared.

---

## 7. Priorities

**P1: must have for a supervised pilot (one site, one cohort)**
1. Field Coach Today screen with the Now card and the day strip (2.2).
2. Handover, pre-start, Blocks 1–4 with checklists, data fields, card lines and block report submit (2.2).
3. Tool 1 calculator; Tool 2 operator counts entered by the supervisor; corrected Tool 6 Shift Report, auto-filled from the blocks; actions page; Step 5 handover sheet passed to the next supervisor.
4. Photos and evidence, with offline queue.
5. Nudges (2.4): block start, meeting reminders, block report due/overdue, Shift Report due/overdue.
6. Superintendent dashboard and coaching (2.6, 2.7): live status, late items, No lines with actions, Shift Report received, comments, coaching point.
7. Site shift settings and roster (2.1), including night shift.
8. Training: cohort, Prime with the hard content lock, Lab complete unlock, Apply length per cohort, Verify form (3.1–3.4).
9. Roles, RLS and customer/site scoping for all new entities (Section 4).
10. Replace `FourBlocks.jsx`'s fixed Superintendent day with role- and site-driven blocks; replace `FourBlockDay`; remove test data from the Ops screens.

**P2: after the pilot starts**
- Tool 3 auto scorecard; Tool 8 co-sign; HRO check; time in the seat; Tool 7; Tool 9 with the "cause seen 3 times" trigger.
- Facilitator Lab wall and CSV/PDF export of Prime answers (a simple export is enough for P1).
- Trends by card line; system findings; roster summary report for the Superintendent.
- Operator self-entry of counts (operator logins or a shared crew tablet).
- Native store builds (see the earlier app-store notes).

## 8. Acceptance tests

1. **Cold supervisor, Block 1, no help.**
   - Setup: a new supervisor with Lab complete, at a test site with default shift times.
   - Pass: they log in on a phone for the first time with no instructions, and complete the handover, pre-start and Block 1 report, including the committed number, using only the Now card.
   - Record every hesitation, question, empty screen or locked screen without a reason. Fix each one and repeat until there are none.
2. **Full shift.** The same supervisor completes Blocks 2–4, the Shift Report by 16:00 and the Step 5 handover. The oncoming test supervisor sees that handover sheet in their own Step 1.
3. **Offline shift.** Airplane mode from 06:00 to 16:00 with photos taken. Reconnect: every record and photo arrives once, in order, with no duplicates.
4. **Nudges.** With a block report left unsubmitted, the supervisor gets the reminder at block end and at +20 min, and the Superintendent is alerted at +60 min. Night shift: no Superintendent meeting nudges.
5. **Content lock.** A Prime-stage supervisor cannot reach any of the locked content (3.2) by tab, link, search, help, Home widget or direct URL. After the facilitator marks Lab complete, everything appears.
6. **Superintendent.** A Superintendent with three supervisors sees each one's live status, marks a Shift Report received, leaves a coaching point, and sees it come back as checked at the next final drive-around.
7. **Isolation.** A second customer and a second site see none of this data.
8. **Speed.** A normal block report submits in 2 minutes or less on a mid-range Android phone.

## 9. Superintendents Sam (next; same engine)

Dawid will send the Superintendent handbook when it is final. Build with this in mind now:
- The program key `ops_superintendents` uses the same Cohort, Enrolment, Prime, Lab and Verify engine.
- The Field Coach is reused with a different content file. The Superintendent's own four blocks are already sketched in `FourBlocks.jsx`: start up and drive-arounds; the meetings; people and plan; time in field.
- The two Field Coaches are **linked on one clock** (HB p26–27). The Superintendent's Drive-around, touch-base, check-in and final drive-around slots are the same events as the supervisors'. One meeting record, seen from both sides.
- Do not hard-code "supervisor" anywhere in the Field Coach engine. Role, blocks, cards and nudges come from content and settings.

## 10. Scope

- Selling and commercial features are out of scope.
- Leave the existing partner and credit lines as they are. Do not add new partner names.

## 11. Questions for Dawid (real gaps only)

1. **Block report.** Is "block report" the Tool 5 block card plus the block's numbers, photos and the Superintendent meeting outcome, as defined in 2.2? Or do you want something different?
2. **Night shift times.** The book says "the same blocks" (HB p26) but gives no clock times. Use day times + 12 h (handover 17:00, blocks from 18:15)?
3. **Approval.** Should the Superintendent approve each block report, or only receive the Shift Report? The brief assumes only the Shift Report.
4. **After Apply.** Are card lines marked every shift for good, or once a roster?
5. **Verify.** Who observes (the Superintendent, our facilitator, or both), and is there a pass threshold?
6. **Mandatory photos.** Are any required? The brief assumes none in P1.
7. **Operator counts.** Is it OK for the supervisor to key the operators' figures (or photograph the paper card) in P1, rather than operators using the app?
