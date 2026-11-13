# Strategy Sam — build update for Base44

**From:** Dawid Falck, The Decision Architecture Group
**To:** Base44
**Date:** 13 November 2026 (Australia/Perth)
**Repo:** `dawid-lgtm/sam`, branch `main` (review was against commit `9bd626e`)
**App:** Strategy Sam (the Managing Strategy program)

This is a direct build brief. Please work through it in order, confirm the plan and timing for each Priority 1 item, and answer the questions in Section 6.

---

## 1. Purpose and scope

The Managing Strategy Handbook changes were agreed on 13 November 2026. The app has not yet been updated to that handbook. This brief tells you what to fix in the current build, and how the app must now follow the handbook.

The final Managing Strategy Handbook (22 pages, 13 November 2026) will be in the repo at `docs/Managing-Strategy-Handbook.pdf`. Section 3 of this brief has been checked against that final version. Page numbers below are the printed "Page X of 22". If the PDF and this brief ever differ, the PDF wins, together with any written note I send you. A small number of handbook wording fixes are still being made before print (filling placeholders and the coaching sentence on p3). None of them changes a rule in this brief.

The Managing Operations Part A supervisor set will also be in `docs/`, for the Supervisors Sam phase (Section 5). It is reference only for this round:
- `docs/Supervisor-Handbook.pdf` (46 pages)
- `docs/Supervisor-Prime-Workbook.pdf` (16 pages)
- `docs/Supervisor-Apply-Tools.pdf` (21 pages)

Selling and commercial features are out of scope for this round. Leave existing partner and credit lines as they are, and do not add any new partner names.

Everything else in this brief is in scope and should be fixed. The Priority 1 items in Section 2 block a supervised pilot with even one client. Section 3 is the handbook alignment work (including meetings, coaching cards, tools and wording). Section 4 is should-fix and polish before a wider roll-out. Section 5 is the next phase (other Sam programs) and can wait until the items above are done.

Do not change existing partner or credit lines in the app. Leave them as they are.

---

## 2. Priority 1 fixes

These eight items must be fixed before any client uses the live app. P1-8 (the guided next-step journey) is the top priority: clients must be able to run the program without Dawid in the room.

### P1-1. Keep each client's data separate

**Problem.** The master console can create many Customers, but the strategy data never links to a Customer. There is one shared Goal, one list of Objectives, one list of Sites, and so on. A second client would see, and could overwrite, the first client's strategy.

**Where in the code.**

- These entities have no `customer_id` field: `base44/entities/CompanySetting.jsonc`, `Objective.jsonc`, `Strategy.jsonc`, `Site.jsonc`, `Meeting.jsonc`, `Tactic.jsonc`, `Plan.jsonc`, `SiteAction.jsonc`, `SiteAsk.jsonc`, `StrategyTracker.jsonc`, `ObjectiveChangeLog.jsonc`, `Assessment.jsonc`.
- Their read rules allow any signed-in user (`role: admin` or `role: user`).
- `src/lib/useSamData.js` loads every row of every table and treats `companies[0]` as "the" company (line 24).
- `User.customer_id` exists in `base44/entities/User.jsonc`, but no access rule or screen filters strategy data by it.
- `Customer.sites` is free text (`base44/entities/Customer.jsonc`, edited as a comma-separated string in `src/components/master/CustomerForm.jsx`). It has already drifted from the `Site` table.

**Required change.** Prefer true multi-tenant in this one app (option B below). If you believe one Base44 app per client is safer or cheaper, say so in your reply and explain the cost and admin effort of each option. Do not leave the current shared pool in place.

- Add `customer_id` to every strategy, site, meeting, assessment and related table listed above. `CompanySetting` becomes one row per customer, not one row for the whole app.
- Set `customer_id` on every create (from the signed-in user's customer, or from the Customer record when a master admin is acting for that client).
- Change every access rule to: a user may only read or write rows whose `customer_id` matches their own. Platform super admins (`role: admin`, Decision Architecture Group staff only) may access all customers.
- Site-level writes must also stay scoped by `site_id` (see P1-2).
- Replace `Customer.sites` free text with references to `Site` records that belong to that customer.
- Change `useSamData.js` so it loads only the current user's customer (and, for site roles, only their site where that is the rule). Never use `companies[0]` as a global default.

**How to verify.** Create two test customers, A and B, each with their own Goal, Objectives, Sites and a site user. Sign in as a user of A: you must see only A's data. Sign in as a user of B: you must see only B's data. Confirm that A cannot read or update B's Goal, Objectives, Strategies, Sites, meetings, tactics, plans, actions, asks or tracker rows. Confirm a platform super admin can still see both. Confirm `Customer.sites` lists the same sites as the `Site` table for that customer.

### P1-2. Lock the site boundary: users must not be able to change their own site, role or customer

**Problem.** "Which site you work at" and "what access you have" live on the user's profile and can be saved with the self-service `auth.updateMe` call. The User entity does not declare or protect `access` or `site_id`. Unless the platform blocks this, a site lead could switch themselves to another site and edit that site's tactics and actions. Write rules on site tables already trust `{{user.data.site_id}}`, so a forged or self-changed `site_id` would open the wrong site.

**Where in the code.**

- Write rules on `Tactic`, `Plan`, `SiteAction`, `SiteAsk` and `StrategyTracker` (`base44/entities/*.jsonc`) allow writes when `data.site_id` equals `{{user.data.site_id}}`.
- `src/components/home/AccessSetup.jsx` (around line 27) calls `base44.auth.updateMe({ access, site_id })`. The form is shown to accounts with `role === "admin"`, but the underlying call is a self-service profile update.
- `base44/entities/User.jsonc` declares only `customer_id`. `access` and `site_id` are not declared and have no admin-only restriction.

**Required change.**

- Declare `access`, `site_id` and `customer_id` on the User entity. Only a platform super admin (or a controlled server-side invite/accept path from P1-4) may change them. A user must not be able to change them via `auth.updateMe` or any other self-service call.
- Remove the self-service path in `AccessSetup.jsx`. A person whose access has not been set should be told to ask an administrator, and that is all.
- Keep site-scoped write rules, but they are only safe once `site_id` cannot be self-edited, and once `customer_id` is also enforced (P1-1).

**How to verify.** Using a real non-admin, site-level test account (not a super admin), attempt `auth.updateMe({ site_id: "<another site>", access: "administrator", customer_id: "<another customer>" })`. The call must be refused. Confirm the same user cannot open or edit another site's tactics, plans, actions, asks or tracker. Send me the test result.

### P1-3. Let client Executives and Project Leads save the Goal, Objectives and Strategies without becoming super admins

**Problem.** The screens say Executives and Project Leads can edit the strategy, but the database only allows Base44 `role: admin` (super admins) to write. The only workaround today is to make a client's Project Lead a super admin, which would also give them the master console and every customer.

**Where in the code.**

- `src/lib/access.js`: `canEditStrategy` allows `executive` and `project_lead` (and `administrator`).
- Write rules in `base44/entities/Objective.jsonc`, `Strategy.jsonc`, `CompanySetting.jsonc` and `ObjectiveChangeLog.jsonc` are `user_condition.role: admin` only.
- `notifySaveError` in `access.js` tells the user to "Ask an administrator to give your account app-admin rights."
- `AccessSetup.jsx` also says administrators and executives need "app-admin rights" before they can save.

**Required change.**

- Put the client access levels into the entity access rules, scoped to the user's `customer_id`: allow create/update of Goal (`CompanySetting`), Objectives, Strategies and the Objective change log when `user.data.access` is `executive`, `project_lead` or `administrator`, and `customer_id` matches.
- Keep Base44 `role: admin` for Decision Architecture Group staff only. A client Administrator is `access: administrator`, not a platform super admin.
- Update `notifySaveError` and any on-screen copy so they no longer tell client users to request app-admin rights.

**How to verify.** Sign in as a client Executive (`access: executive`, `role: user`) on customer A. You must be able to create and edit that customer's Goal, Objectives and Strategies, and a change to an Objective must write a change-log entry. You must not be able to open the master console, list other customers, or edit customer B. Repeat for a Project Lead. A site lead must still be refused on Goal/Objectives/Strategies, and allowed only on their own site's Tactics, Plans, Actions, Asks and tracker (subject to P1-2).

### P1-4. Make invitations apply the site, role and customer reliably, and stop hard-coding the invite email

**Problem.** When someone is invited, the app tries to set their site, access and customer immediately after `inviteUser()`. The person usually does not exist as a User until they accept, so those settings are probably lost, while the screen still says "Invite sent". Bulk upload does not collect a site at all. The invite email is hard-coded to say "MMS has elected to deploy…" and "Your role has been set to that of Administrator" for everyone, including site leads at other clients.

**Where in the code.**

- `src/components/master/InviteUser.jsx`: `inviteUser()` then `User.filter({ email })` immediately (lines 31–41). If no User is returned, the site, access and customer are not saved, and no warning is shown. The success message still says the invite was sent.
- `src/components/master/BulkUserUpload.jsx`: invites with email, optional role and optional customer name only. No site field. Same immediate `User.filter` pattern (lines 38–45).
- `base44/emails/UserInvite.html`: fixed text "MMS has elected to deploy the Decision Architecture Managing Strategy Module… You have been invited to {{app_name}}, the platform that will deploy this program in MMS. Your role has been set to that of Administrator." The later paragraphs also assume every recipient is an administrator ("Your login will take you to the administrator page… Load your people… Launch the program").

**Required change.**

- Store pending invites in their own table: email, customer, site, access, program, and status (pending / accepted / expired). Apply those values automatically the first time the person signs in, before they land on Home.
- If `inviteUser()` does create a User immediately, still persist the pending record and apply it on first sign-in, so nothing is lost if the filter misses.
- Show pending and accepted invites on the Users screen. Do not show "Invite sent" as success unless the pending record (or a confirmed User update) was actually saved.
- Require a site for every non-super-admin invite, including bulk upload. A person works at a site: no site, no invite.
- Rewrite `UserInvite.html` so it uses the client company's name, the person's actual access/role, and the program they have been invited to. Do not hard-code a client name or "Administrator". Keep the password-set button and the "invite only / ignore if unexpected" note. Body copy should match the role: an administrator is asked to load people and launch the program; a site lead or other learner is welcomed to their program, not to an administrator page.

**How to verify.** Invite a site lead at a named customer and site. Confirm a pending record is visible in Users. Accept the invite with a fresh inbox. On first sign-in, the person must land with the correct `customer_id`, `site_id` and `access`, and must see only that customer's data. Repeat with bulk upload (site included). Confirm the invite email names the real client, the real role and the program, and does not say "MMS" or "Administrator" unless that is actually the client and role.

### P1-5. Remove fake test data from the learner Home, program and admin screens

**Problem.** A client user who signs in lands on a home page that greets them as a made-up "Production Superintendent · North Pit · B Crew", shows invented tonnes, invented programs at 46%, and invented Lab dates. Tapping a program opens a fake progress page. `/admin` is entirely hard-coded. That would undermine trust on day one.

**Where in the code.**

- `src/lib/homeTestData.js` is headed "TEST DATA ONLY" and defines `person` as John Carter of Pilbara Mining Co, plus fake `programs`, `sitePerformance`, `safetyFocus`, `keyDates` and `labSessions`.
- `src/routes/_authed/index.jsx` imports `person, programs, sitePerformance, safetyFocus, keyDates` from that file.
- `src/routes/_authed/program.$programId.jsx` uses the same fake `programs`.
- `src/routes/_authed/admin.jsx` is hard-coded (fake customers, people, a completion-report CSV, and an "Add a person" form that saves nothing).
- `src/components/home/HomeCalendar.jsx` imports `keyDates` and `labSessions` from the test file. "Book a Validation Lab" writes only to `localStorage` (`sam-test-lab-booking`).

**Required change.**

- Build Home from real data: the signed-in person's name, site and access, the programs actually assigned to their company, real progress from `CardProgress`, and the next real meeting from the `Meeting` records (see also P1-7).
- Build `/program/$programId` from real program cards and `CardProgress` for that person.
- Delete `/admin`, or wire it to real customer, user and progress data. Do not leave a screen that pretends to save.
- Remove `src/lib/homeTestData.js` and every import of it. Home calendar events must come from real meetings and key dates stored in the database, not from a test file or from `localStorage`.

**How to verify.** Sign in as a real test learner with a name, site and at least one assigned program. Home must show that person's name, site and role, real program progress, and the next dated meeting (or a clear empty state if none exist). There must be no "John Carter", "Pilbara Mining Co", made-up tonnes, or made-up Lab dates. Opening a program must show that person's real cards and progress. `/admin` must either be gone or persist real data.

### P1-6. Stop saving real records as test data

**Problem.** Every Goal, Objective, Strategy, Tactic, Plan, Action, tracker cell and assessment the app creates is stamped `is_test: true`. Schema defaults are also `true` on several entities. Any future clean-up of "test data" would delete real client work.

**Where in the code.** `is_test: true` is hard-coded on create in:

- `src/components/strategy/GoalEditor.jsx`
- `src/components/strategy/GoalBuilder.jsx`
- `src/components/strategy/ObjectiveEditor.jsx` (create and related payload)
- `src/components/strategy/StrategyEditor.jsx`
- `src/components/strategy/TrackerGrid.jsx`
- `src/components/strategy/ActionEditor.jsx`
- `src/components/site/TacticSection.jsx`
- `src/components/site/PlanSection.jsx`
- `src/components/site/ActionSection.jsx`
- `src/components/site/AskSection.jsx`
- `src/routes/_authed/assess.jsx`

Schema defaults of `is_test: true` also exist, including `base44/entities/Objective.jsonc`, `Site.jsonc`, and other strategy entities.

**Required change.**

- Remove the hard-coded `is_test: true` from every create/update listed above. Default `is_test` to `false` in every entity schema.
- If you still need a way to mark seed or demo records, use an explicit, rarely used flag set only by a master-admin action, never by ordinary client saves.
- Clean up existing records before go-live: identify which rows are genuinely demo/seed data and which are real work, then clear `is_test` on anything that should be kept. Tell me the clean-up plan in your reply.

**How to verify.** Create a Goal, an Objective, a Strategy, a site Tactic, Plan, Action, Ask, a tracker cell and an assessment as a client user. Every new row must have `is_test` false or unset. Confirm schema defaults are false. Confirm a documented clean-up has been run (or is scheduled and described) on existing data.

### P1-7. Add a real meetings editor (create, edit, delete)

**Problem.** Meetings cannot be created or edited in the app. The Meetings screen only displays records. There is no `Meeting.create` or `Meeting.update` call anywhere in `src/`. A handful of meetings can be seeded, but a client cannot build Tool 4 (the meeting calendar) or run Step C.

**Where in the code.**

- `base44/entities/Meeting.jsonc` already has useful fields (`title`, `scope`, `site_id`, `site_name`, `cadence`, `weeks`, `day_of_week`, `start_time`, `duration_min`, `owner`, `decides`, `rules`, `sort`) but create/update/delete are admin-only, and there is no `customer_id`.
- `src/routes/_authed/meetings.index.jsx` and `src/routes/_authed/meetings.year.jsx` only list and display.
- `src/lib/meetings.js` computes the month grid and the next occurrence from existing records.
- No editor component exists.

**Required change.**

- Add a meetings editor, available to the client roles that own Step C (COO with the Project Managers; client Administrator). Fields: meeting type (Head office IN, Head office ON, Site IN, Site ON), owner, lead, site (for site meetings), day, time, duration, weeks of the month, and start date.
- Enforce the handbook rhythm (see Section 3): site IN in weeks 1–3; site ON in week 4 (replacing that week's IN); head office IN weekly; head office ON monthly in week 1, after the site ON meetings. Allow a start date so the first month can be planned.
- Pre-fill a default calendar from the handbook's Tool 4 example (p10). Every value stays editable at setup (Step C):

| Meeting | Default day | Default time | Default length | Weeks of the month |
|---|---|---|---|---|
| Head office IN | Friday | 08:00 | 60 min, hard stop | Every week |
| Head office ON | Tuesday | 09:00 | 3 hours | Week 1 (after the site ON meetings) |
| Site IN (Weekly Site Review) | Wednesday | 07:00 | 60 min | Weeks 1–3 |
| Site ON (Monthly Site Review) | Wednesday | 07:00 | Minimum 3 hours (1 hour IN, then at least 2 hours ON) | Week 4 |

Do not let the site ON meeting be saved at less than 3 hours.
- Persist via `Meeting.create` / `Meeting.update` / `Meeting.delete`, scoped by `customer_id` (and `site_id` for site meetings).
- The calendar and "next meeting" on Home must use these records.

Default owners and leads, which the editor must pre-fill and allow to be adjusted to fit the business:

| Meeting | Default owner / lead |
|---|---|
| Head office weekly IN | COO chairs. CEO attends when possible. Project Managers attend and present their own site's week. |
| Head office monthly ON | Owner: CEO or COO, chosen at setup (handbook p13: "depending on how the organisation is set up"). Project Managers attend, present their own site, and co-lead the quality and money agenda lines. |
| Site weekly IN (weeks 1–3) | Superintendent leads. Where the site has a Mine Manager, the Mine Manager leads and the Superintendent attends. Attendees include Planning and the Safety lead (see 3.3). |
| Site monthly ON (week 4, Monthly Site Review) | Project Manager leads. Minimum 3 hours: the first hour is that week's IN meeting (led by the Superintendent or Mine Manager), then at least 2 hours ON. Looks at trends, plans and the Strategies. Structured around the four core questions (3.4). |

**How to verify.** As a client Administrator or the COO role, create the four meeting types for one customer with two sites. Edit a day and time, then confirm the month grid, year view and Home "next meeting" all update. Delete a meeting and confirm it disappears. A site lead must see head office meetings plus their own site's meetings only. A second customer must not see these meetings. Confirm you cannot save a site ON meeting in weeks 1–3, or a site IN meeting in week 4, without a clear warning that this breaks the rhythm (or the form simply enforces the rule).

---

### P1-8. Guided "next step" journey, so clients can run the program without Dawid in the room

**Problem.** Today a client team can't run Strategy Sam unassisted. There's no single path from first login to a running rhythm. The home screen shows test data, the steps don't follow A–E, and nothing tells a user what to do next or why. This is the most important requirement in this brief: **the app must be foolproof.** A General Manager, Project Manager or Superintendent who has never met Dawid must be able to log in and take the program from Step A to a live four-meeting rhythm just by following the screens.

**Required change.**
1. **One "Your next step" card at the top of every screen**, driven by data, not hard-coded. It shows:
   - the step and sub-task (for example, "Step B · Build your site's Tactics");
   - one sentence on what to do, and one on why it matters, in handbook wording;
   - who must do it (role and named person);
   - the due date;
   - a single primary button that opens the exact screen and form where the task is done.
2. **A visible journey tracker:** Step A → B → C → D → E, with sub-tasks under each and a status of Not started, In progress, Done, or Waiting on someone else. Show progress at company level and per site.
3. **Hard gating where order matters.** Step B can't start until Step A's decisions are saved, and Step D/E meetings can't be scheduled until Step C's calendar exists. A locked item shows the reason, who it's waiting on, and a "Remind them" button.
4. **A role-specific view.** Each user sees only their own next task. For example, an Executive sees "Approve Objective 2", and a Superintendent sees "Run Weekly Site Review, Wed 7:00, open agenda". Nobody ever lands on an empty screen. Every empty state says what goes here, who adds it, and has the button to add it.
5. **Built-in guidance on every form:** a short "what good looks like" line, one worked example from the handbook (the tyre example), and field-level hints. Validation stops bad entries before they're saved, for example more than five Objectives, an Action with no owner or date, or a Tactic with no trigger.
6. **Run-the-meeting mode** for each of the four meetings:
   - the agenda with timers;
   - the right data pulled in (actions due, asks, tracker);
   - decisions captured with an owner and a date;
   - the 10-line coaching card at the end;
   - the next meeting auto-scheduled from the calendar.
7. **Nudges:** email or in-app reminders before tasks are due and before meetings, and an overdue flag on the next-step card. Each nudge has a deep link straight to the task.
8. **First-login onboarding:**
   - a 3-screen welcome covering what Strategy Sam is, the A–E path, and the user's role;
   - a 60-second "how this works" video slot;
   - a "Help" link on every screen that opens the relevant handbook page.

**Acceptance test.** Create a brand-new client with one site and four test users (Executive, Project Manager, Superintendent, Site Lead). Each user logs in cold, with no instructions outside the app, and follows only the next-step card. Together they complete Steps A to E and hold one of each of the four meetings. Record every point where a tester hesitated, asked a question, or hit an empty or locked screen without a reason. Fix each one and repeat until there are zero.

## 3. Handbook alignment

The handbook changes were agreed on 13 November 2026. The app currently teaches a different version of the method. Please bring the product in line with the rules below. Keep the wording in one content file (replace or extend `src/lib/deploymentPlan.js`, `src/lib/gospaContent.js` and `src/components/strategy/RhythmExplained.jsx`) so screens do not drift from each other.

The five steps, GOSTPA, IN vs ON, the four meetings, and the 10-line coaching cards are the model. Do not invent a different structure.

### 3.1 Five steps A–E, not three

The program runs in five steps:

| Step | Name | What it is |
|---|---|---|
| **A** | The executive working session: set the plan | Facilitated session. Goal, up to five Objectives, Strategies (each with one owner and a value), and the four meeting agendas agreed. Owner: CEO. Attends: COO, executive team, GMs, Ops Managers and Project Managers. Uses Workbook Tool 1 (Where we are now, including the self-assessment completed before the session) and Tool 2 (Goal / Objectives / Strategies builder). |
| **B** | Take it to site: build the Tactics, Plans and Actions | Project Manager leads at each site, guided by the GM or Ops Manager, with the site leadership team in the room. Uses Workbook Tool 3 (site TPA builder). What the site cannot deliver goes back as an ask, with the reason. |
| **C** | Define the meetings and set their dates | Project Managers do this with the COO. Every meeting gets an owner, a day, a time and a start date, in one calendar (Workbook Tool 4). |
| **D** | Run the head office meetings | Describes the HO weekly IN and HO monthly ON meetings (reading order, not start order). |
| **E** | Implement the site meetings | Describes the site weekly IN (Weekly Site Review) and the site monthly ON (Monthly Site Review) (reading order, not start order). |

**What the app does now.** Three steps: (1) Defining the Goals and Objectives, (2) leadership workshop to define Strategies and lock rhythm, (3) cascade to site. See `src/lib/deploymentPlan.js` (`DEPLOYMENT_PLANS.strategy.intro` and `phases`), `src/routes/_authed/strategy.start.jsx` (`GROUPS`, still titled Step 1–3), and `src/routes/_authed/strategy.index.jsx` ("The three steps…").

**What to change.** Rewrite the deployment plan, Get-started groups and Strategy index to Steps A–E as in the table. Step C must include the meetings editor (P1-7). Do not start head office meetings in "Step 2" and sites in "Step 3". Group program cards by the card's `step` field (see also P2-10), mapped to A–E, not by whether the title starts with `"Step N · "`.

### 3.2 GOSTPA, including Tactics — not GOSPA

The plan has six layers: Goal, Objectives, Strategies, **Tactics**, Plans, Actions. Tactics are a layer of the plan, not something sitting outside it. A Tactic is the approach the site is taking now to deliver a Strategy. Each has one owner and a trigger that says it is not working.

**What the app does now.** The product language is "GOSPA". `src/lib/gospaContent.js` defines layers G, O, S, P, A only — there is no T layer. `REVIEW.md` §6 states "Two layers sit outside GOSPA but are part of delivery" and lists Tactics as one of them. Screens and titles use GOSPA throughout: `src/components/strategy/GospaExplainer.jsx`, `GospaFlow.jsx`, `GospaSheet.jsx`, `GospaDiagram.jsx`, `src/routes/_authed/strategy.gospa.jsx`, `strategy.jsx`, `strategy.index.jsx`. The site cascade itself (Goal → Objective → Strategy → Tactic → Plan → Action in `src/components/site/ChainView.jsx`) already has the right chain; the teaching content does not.

**What to change.** Rename the model to GOSTPA everywhere the learner or client admin sees it. Add a Tactics layer to the content file, in order G-O-S-T-P-A, with handbook meaning (approach, owner, trigger). A Tactic changes when its trigger fires, and at the quarterly review (handbook p4). Do not use "90-day review". Keep the site chain as it is, and pre-fill the Strategy from a dropdown as you already do in `TacticSection.jsx`. File and component names can be renamed in a later tidy-up if you prefer not to do that in this pass, but the visible words must say GOSTPA and must include Tactics as a layer.

### 3.3 Head office and site meetings: who leads, and when they start

Apply these rules on the rhythm screen, the deployment plan, the meetings editor (P1-7) and any calendar copy.

**Head office weekly IN.** Owned and chaired by the COO. The CEO attends when possible. Project Managers attend and present their own site's week. Weekly, typically Friday, 60 minutes, hard stop.

**Head office monthly ON.** Owner: CEO or COO, chosen at setup. Monthly, week 1, after the site ON meetings. About 3 hours. Project Managers attend and present their own site. On the agenda lines where site results are read (question 2, quality, and question 3, money), name the Project Managers as co-leads.

**Site weekly IN (weeks 1–3), Weekly Site Review.** The Superintendent leads it. Where the site has a Mine Manager, the Mine Manager leads and the Superintendent attends. 60 minutes. In week 4 this meeting becomes the first hour of the site ON meeting.

Attendees (handbook p16): Project Manager, Department Managers and Superintendents, **Planning**, **Safety lead**, Maintenance, HSEC, HR, Technical Services.

Agenda (handbook p17, 60 minutes, in this order; build it into run-the-meeting mode with timers):

| Min | Item | Lead | Output |
|---|---|---|---|
| 5 | Weak signals: what are we repeatedly getting away with? | Safety lead | The pattern named |
| 10 | Task adherence: what slipped, and why | Department Managers | Causes named |
| 10 | This week's numbers, two minutes per department, in PAVA | Department Managers | Week judged |
| 5 | Maintenance: schedule compliance, availability, backlog, MTBF | Maintenance | Actions, with owners |
| 10 | What is coming: weather, crews, recruitment | Owner | Threats listed |
| 10 | Impact on next week's shifts | Owner | Each threat given an owner |
| 10 | What leaves site | Owner | Owner, forum and date for each |

Weak signals always come first.

**Site week 4 ON, Monthly Site Review.** Led by the Project Manager. **Minimum 3 hours:** 1 hour IN for the week (led by the Superintendent or Mine Manager), then at least 2 hours ON. Looks at trends, plans and the Strategies. Structured around the core questions (3.4). **Tactic owners** report on each Strategy's Tactics, Plans and Actions (not Strategy owners — the Strategy owner often sits at head office).

**Start timing (this is a change from both the old handbook wording and the app).** Head office meetings and site meetings start at the same time, so the rhythm works from the first month.

- The site IN meetings and the head office IN meeting start in the same week.
- The first site ON meeting (week 4) runs before the first head office ON meeting, which then reads every site's month.
- Steps D and E describe the meetings in a reading order, not a start order.

**What the app does now.**

- `RhythmExplained.jsx` and `deploymentPlan.js` `rhythm.rows`: site row is "At site (PM, coached by the Ops Manager or GM)" for all four weeks; head office row is "Head office (CEO and ELT)", with "Executive hour" in weeks 2–4 and the ON meeting in week 1.
- The deployment plan starts the head office rhythm in Step 2 and sites in Step 3. It also uses terms that are not in the handbook: "Executive hour", "six-monthly strategy and performance review", and "Enterprise Foundations rhythm".

**What to change.** Rewrite the rhythm table and copy to match the leads and start rules above. Site ON stays in week 4; head office ON stays in week 1, after the site ON meetings. Head office IN is weekly, including weeks 1–4 (it does not disappear in week 1, and it is not an "Executive hour"). Remove "Executive hour", "six-monthly strategy and performance review" and "Enterprise Foundations rhythm" from the product. Strategies are reviewed for work every month (keep, fix, merge, stop) and changed on value at the quarterly review — not at a separate six-monthly offsite invented by the app.

### 3.4 Core questions: four, defined once, same wording everywhere

The final handbook defines the core questions once (p4) and uses the same wording everywhere. There are **four**, asked in this order:

1. Are our people safe?
2. Are we running a quality business?
3. Are we making money, and can we make more?
4. Are our people happy?

Customers sit under question 2. The handbook glossary (p21) says: "Customers are part of question 2." The head office ON agenda reads question 2 as "Site against site, on trend, customers included" (p14). Do not add a fifth question.

Every ON meeting, at site and at head office, is built on these questions in this order. They must use identical wording on the rhythm screen, both ON agendas, both ON coaching cards and the glossary.

**What the app does now.** `RhythmExplained.jsx` (the `questions` array) lists four questions, but with money before quality: "Are our people safe?…", "Are we making money, and can we make more?…", "Are we running a quality business?…", "Are our people happy?…". Copy also says "the same four questions" and "same four week shape".

**What to change.** Move the four questions into the shared content file, in the order and wording above (quality before money). Drive the rhythm screen, agendas and coaching cards from that single list. Do not keep a second, different list in the rhythm component. Where the app explains question 2, add "customers included".

### 3.5 Action register: one list, reviewed by everyone, one owner and a date on every item

Every part of the plan has one owner. The site's priorities are one list — the action register — reviewed by everyone, with one owner and a date on every item. An action without an owner and a date is not an action.

**What the app does now.** `SiteAction` already has `owner`, `due` and `done` (`base44/entities/SiteAction.jsonc`; editors in `ActionSection.jsx` and `ActionEditor.jsx`). The asks register already exists as `SiteAsk`. What is missing is the rule in the product copy, and a single register view that a meeting can read (done or not, and why), across the site and up to head office.

**What to change.** Keep one action register per customer (site actions stay site-scoped; head office must be able to read every site's open items for the HO IN and HO ON meetings). Require owner and date on every item in the editor and in the schema. Show the register in the meeting workspace (see 3.6–3.7). Do not describe it as "one list, owned by everyone".

### 3.6 Ten-line Yes/No coaching cards, with N/A on quarterly value lines

Each of the four meetings has a coaching card: ten lines that say what good looks like, marked Yes or No. The people who run the meeting mark themselves against it. A No is the next thing to coach, not a fault to report. Keep ten lines per card. Add an **N/A** option on the quarterly value lines (**head office ON line 6**, handbook p15; **site ON line 7**, handbook p20; both "N/A outside quarter-end"), so those lines are not marked No in months that are not a quarter-end. Line 10 on every card is the same psychological-safety line: "People can admit mistakes and ask questions without being put down." 

**What the app does now.** There is no coaching-card screen and no entity to save a completed card against a meeting date. `src/routes/_authed/master.tools.jsx` only has a "Coaching card" file category for uploads.

**What to change.** Add a coaching-card screen for each of the four meeting types, with the ten handbook lines, saved per meeting date (who marked it, Yes / No / N/A where allowed, and the "Actions required from any No: owner / by" line). **Who coaches.** The rule is that the chair's manager coaches against the card (handbook p3). Use this default mapping, and make it configurable per customer:

| Meeting card | Coach (default) |
|---|---|
| Head office IN | CEO coaches the COO |
| Site ON | COO coaches the Project Manager |
| Site IN | Project Manager coaches the Superintendent (or the Mine Manager, where they lead) |
| Head office ON | Configurable at setup (the chair's manager; where the CEO chairs, the Board chair or our facilitator) |

During deployment, our facilitators also coach against the cards. Allow a facilitator to be added as coach on any card. Split any line that currently tries to check two things, keeping the total at ten lines. Use the same core-question wording as in 3.4.

### 3.7 S·T·P·A return and the site pack

After each site ON meeting, the site pack and the S·T·P·A return go up to head office within 3 days, in time for the head office ON meeting in week 1. The S·T·P·A return is one page per Strategy: its Tactics, Plans and Actions, done or not, and each quarter its value. Head office's answers to each site's asks go back to the site within 3 days, before the site's Monthly Planning Meeting.

**What the app does now.** Nothing. There is no S·T·P·A return, no site pack, and no 3-day return workflow.

**What to change.** Add a site pack plus an S·T·P·A return generated from the site's Tactics, Plans, Actions and the strategy tracker row, one page (or screen) per Strategy, with quarterly value when it is a quarter-end. Record the sent date. Let head office answer each ask (yes, no, or a date) and send the answers back, also dated. Surface overdue returns (more than 3 days).

### 3.8 Workbook Tools 1–4, plus the registers and return

The tools named in the handbook live in a separate Managing Strategy Workbook, issued before Step A. In the app they should appear as named tools, not as unnamed screens.

| Tool | Purpose | What the app does now | What to change |
|---|---|---|---|
| **Tool 1. Where we are now** (includes the self-assessment) | Completed before Step A. Growth staircase, maturity matrix, and the meetings we run now. | `src/routes/_authed/assess.jsx` is a maturity assessment, but it is not presented as Tool 1 and is not wired as pre-work for Step A. | Present it as Tool 1 / the self-assessment, completed by each person attending Step A, and feed the results into the Step A working session. |
| **Tool 2. Goal, Objectives and Strategies builder**, plus the strategy tracker | Step A output; tracker is read at HO ON and at each site ON (that site's rows). | The Goal / Objective / Strategy editors and `TrackerGrid.jsx` are a reasonable Tool 2, but they are not named as such. | Name them as Tool 2. Keep the tracker (monthly Y/N on work, quarterly volume and dollars on value). |
| **Tool 3. Site Tactics, Plans and Actions builder** | Step B output; read again at the site ON meeting. | The site page (`TacticSection`, `PlanSection`, `ActionSection`, `AskSection`) is a reasonable Tool 3, but not named as such. | Name it as Tool 3. See also P2-2 (link by record ID). |
| **Tool 4. Meeting calendar** | Step C output. | Meetings can be viewed, not created (P1-7). | The meetings editor and calendar are Tool 4. Include a start-date column. |
| **Action register** | One list, one owner and a date per item, reviewed by everyone. | Site actions exist; no meeting-facing register. | See 3.5. |
| **Asks register** | What a site cannot deliver, with the reason and what it would take. | `SiteAsk` exists. | Keep it, and close the loop with the 3-day return in 3.7. |
| **S·T·P·A return and site pack** | Sent within 3 days of the site ON meeting. | Not in the app. | See 3.7. |

### 3.9 Strategy review cadence

Strategies are reviewed for work every month (keep, fix, merge, stop) and changed on value at the quarterly review. Tactics are reviewed when their trigger fires, and at the same quarterly review.

**What the app does now.** The tracker grid already has monthly work cells and quarterly value fields (`StrategyTracker`). The deployment plan and rhythm copy still talk about a "six-monthly strategy and performance review" and a 90-day review as if they were separate inventions. Tactic review dates already exist on `Tactic.review_date`.

**What to change.** Keep the monthly / quarterly tracker behaviour. Align all copy with "reviewed monthly for work, changed quarterly on value". Remove the six-monthly offsite from the plan. The quarterly value check happens at each site's ON meeting in the last month of the quarter, then at the head office ON meeting in week 1 of the next month.

---

## 4. Priority 2 and polish

Fix these before a wider roll-out. They are not an excuse to delay the Priority 1 and handbook work, but several (offline data loss, TPA links, the public review brief, dependency alerts) should be done in the same pass if you can.

### P2-1. Offline sync must not silently throw away work

**Problem.** In `src/lib/offline.js`, `flush()` drops any refusal that is not classified as a network error, and only keeps a counter (`REJECTED_KEY`). That includes a login that expired during a long shift (401), a platform outage (500/503), or rate limiting (429). A supervisor could come up from underground and lose a shift's entries. `isNetworkError` treats any `TypeError` as "no signal", which can jam the queue forever.

**Required change.** Retry on 401, 429 and 5xx (re-login first on 401). Only drop on a genuine 400/403 validation or permission error. Keep dropped items in a "could not save — tap to review" list, not just a counter. Do not treat `TypeError` as "no signal" unless it is actually a failed fetch. Add a service worker so the app shell still opens underground.

**Verify.** Queue several creates/updates, expire the session, come back online, and confirm the queue is retried after re-login rather than discarded. Force a 500 and a 429 and confirm retry. Force a real 400 and confirm the item is reviewable, not lost. Confirm a thrown `TypeError` that is not a network failure does not block the rest of the queue.

### P2-2. Key the offline cache and queue by user, and clear them on logout

**Problem.** The cached company strategy and the queue live in `localStorage` under global keys (`sam.offline.queue.v1`, `sam.offline.cache.v1`) and are not cleared in `src/lib/AuthContext.jsx` `logout`. On a shared crib-room tablet, the next person's session would replay the previous person's queued changes.

**Required change.** Key the cache, queue and rejected list by user id. Clear them on logout.

**Verify.** As user A, queue an offline change. Log out. Sign in as user B on the same browser. B must not see or flush A's queue or cached strategy. Sign back in as A (same device) and confirm A's pending work is still there if they did not log out… after logout it must be gone from the device, or held only if you have a documented, user-keyed restore you can defend. Default: clear on logout.

### P2-3. Link Tactics, Plans and Actions by record ID, not by codes like "T3"

**Problem.** New codes are `count + 1` (`T${tactics.length + 1}` in `TacticSection.jsx` line 34, likewise `P…` in `PlanSection.jsx` and `A…` in `ActionSection.jsx` / `ActionEditor.jsx`). After a delete, or when two phones work offline, you get two T3s. Plans and actions then point at the wrong parent because they store `delivers_tactic`, `for_plan` and `delivers_strategy` as those codes.

**Required change.** Link by record ID (`tactic_id`, `plan_id`, `strategy_id`). Show the code only as a label. Keep uniqueness of codes per site per customer, but do not use them as foreign keys.

**Verify.** Create T1 and T2, delete T1, create another tactic: it must not become a second T1 that steals P1's parent (or if the next label is T1, existing plans must still point at the original record, which is gone, not at the new one). Repeat with two offline creates on different devices, then sync.

### P2-4. Enforce one executive owner per Objective, and the five-Objective ceiling, in the schema

**Problem.** `ObjectiveEditor.jsx` only requires a statement (`if (!form.statement.trim())`) before save. `exec_owner` can be empty. `base44/entities/Objective.jsonc` required fields are only `code` and `statement`. The five-Objective ceiling is UI-only.

**Required change.** Require `exec_owner` (and a number / metric and a date, as the handbook rule: "An Objective without a number, a date and an owner is not set") in the editor and the schema. Enforce the five-Objective ceiling in the database too, per customer.

**Verify.** Saving an Objective with no owner, no number or no date is refused. A sixth Objective for the same customer is refused.

### P2-5. Log Goal and Strategy changes, and write the log together with the edit

**Problem.** Only Objective edits go to `ObjectiveChangeLog`. Rewriting the Goal in `GoalEditor.jsx` / `GoalBuilder.jsx` simply overwrites it. Strategy edits in `StrategyEditor.jsx` are also unlogged. The Objective log is written first, so a failed save can leave a permanent log entry for a change that never happened.

**Required change.** Log Goal and Strategy changes as well (change, cause, who, when; Board approval date where an Objective or Goal change needs it). Write the log entry and the edit together, so you cannot get one without the other.

**Verify.** Edit a Goal, an Objective and a Strategy. Each leaves an uneditable log entry only if the edit itself saved. Abort or fail a save and confirm no orphan log row.

### P2-6. Calculate customer progress from real completion

**Problem.** Customer progress bars are percentages typed by a super admin in `CustomerForm.jsx` (`progress_sam`, `progress_ops`, `progress_maintenance`, `progress_strategy`).

**Required change.** Calculate progress from `CardProgress` and from chain completeness per site (every Strategy has Tactics, every Tactic has Plans, every Plan has Actions, and so on). Show that figure in the master console. Stop hand-typing it.

**Verify.** Complete a card as a learner and fill a missing Tactic on a site. The customer's progress figure changes without anyone typing a percentage.

### P2-7. Real reporting and export

**Problem.** The only CSV export is the fake one on `/admin`.

**Required change.** Add per-client completion and cascade/chain reports, with CSV/PDF export, including each learner's card answers so a facilitator can read them before a session.

**Verify.** As a platform admin, export customer A's completion and chain report. It contains only A. Learner answers are included and match what was saved.

### P2-8. People management

**Problem.** You cannot deactivate or remove a user. There is no pending-invite list (see P1-4). The master Users page has no site field (`master.users.jsx`, `UserRow.jsx`). Changing a dropdown saves instantly with no confirmation, so one slip makes someone a super admin.

**Required change.** Add deactivate/remove (or equivalent "this person can no longer sign in"), a pending-invite list, and a site field on master Users. Require a confirmation step before setting `role: admin` (super admin).

**Verify.** Deactivated users cannot sign in. Site is visible and editable on the Users list. Setting Super admin asks for confirmation and can be cancelled.

### P2-9. Audit trail

**Problem.** Apart from the Objective change log, there is no record of who changed what.

**Required change.** Record created-by / updated-by (and timestamps) on every write, and show a history per record.

**Verify.** Edit a Tactic as a named site lead. The history shows that person, the time, and the before/after.

### P2-10. Group Get-started cards by the `step` field

**Problem.** `strategy.start.jsx` puts a card into Step 1, 2 or 3 only if its title matches `/^Step (\d) · /`. The master editor already has a separate `step` number on `ProgramCard`. Rename a card and it jumps to "Before you start".

**Required change.** Group by the `step` field, mapped to Steps A–E (Section 3.1). Title text must not control placement.

**Verify.** Change a card's title but leave `step` as A/C (or 1/3). It stays in the right step. Change only `step` and it moves.

### P2-11. Desktop navigation for non-admins is missing Strategy and Assess

**Problem.** In `src/components/AppNav.jsx`, desktop (`variant === "top"`) for non-admins is `[home, ...baseItems.slice(3)]`, which leaves only Home, Site and Meetings.

**Required change.** Show the same five tabs as mobile: Home, Assess, Strategy, Site, Meetings.

**Verify.** As a non-admin on a desktop-width screen, all five tabs are present and work.

### P2-12. Store "launch the program" ticks in the database

**Problem.** `ProgramSteps.jsx` saves ticks in `localStorage` under `sam-program-steps:*`, so they exist only on that browser.

**Required change.** Store them in the database, per customer (and per program).

**Verify.** Tick a launch step on one browser, open the same customer on another browser or device, and see the same ticks.

### P2-13. Remove the public review brief before any client sees the app

**Problem.** `public/Sam-review-brief.md` (internal design and security notes) is shipped with the app. `src/routes/_authed/review-brief.jsx` serves it at `/review-brief`, and `src/routes/_authed/flow.jsx` links to it.

**Required change.** Remove `public/Sam-review-brief.md` and the `/review-brief` route (and the link from `/flow`) before any client is invited.

**Verify.** The file is gone from the built app. `/review-brief` and `/Sam-review-brief.md` do not exist.

### P2-14. Fix lint errors and dependency alerts

**Problem.** `npm run lint` fails with 2 `no-empty` errors: empty `catch {}` blocks in `src/components/home/HomeCalendar.jsx` at lines 20 and 24. `npm audit --omit=dev` reports a **critical** issue in `dompurify` and a **high** issue in `follow-redirects`, plus moderate issues in `seroval` and `postcss-selector-parser`, and an XSS advisory in `quill` via `react-quill-new`.

**Required change.** Fix the two lint errors and make lint pass in CI. Run `npm audit fix`, then review `react-quill-new` / `quill` and upgrade or replace if the advisory remains.

**Verify.** `npm run lint` exits 0. `npm audit --omit=dev` no longer reports the critical `dompurify` or high `follow-redirects` issues. Note any remaining advisories and the decision on `quill`.

### P2-15. Privacy basics

**Problem.** The app has no privacy policy or terms, and does not say where data is stored (hosting is likely offshore, so Australian Privacy Principle 8 on cross-border disclosure applies). There is no per-client data export or deletion. Customer logos are uploaded as public files (`CustomerForm.jsx` calls `base44.integrations.Core.UploadPublicFile`). The Vite analytics tracker is on (`vite.config.js`, `analyticsTracker: true`).

**Required change.**

- Add Privacy Policy and Terms pages, linked from sign-in and from the app. I will supply or approve the legal copy; do not invent it. Leave clearly marked placeholders if the copy is not yet in your hands.
- Confirm in writing the data hosting country/region, backup frequency, backup retention, and whether one client's data can be exported or restored on its own (see Section 6).
- Add a per-client export and a per-client delete, both restricted to platform super admins, with a confirmation step on delete.
- Stop uploading customer logos as public files, or document that logos are public and get a decision from me before leaving them that way.
- Turn the Vite analytics tracker off unless you can show me what it sends, where, and that it is appropriate for client data.

**Verify.** Privacy and Terms links are visible. A platform admin can export one customer's data and can delete only that customer after confirming. Logos are not anonymously fetchable (unless I have agreed they may be public). Analytics is off, or documented.

### P2-16. Other polish

- Site saves in `TacticSection.jsx`, `PlanSection.jsx` and `ActionSection.jsx` do not catch errors. A permission refusal leaves the form open with no message. Catch errors and show a clear message (using the updated `notifySaveError` from P1-3).
- The tactic limit of 6 per site (`TacticSection.jsx`, `atLimit = tactics.length >= 6`) is not in the handbook. Remove it, or make it a soft warning, not a hard stop.
- `src/lib/cardProgress.js` loads "the first record for this product" (`filter({ product_key }, { limit: 1 })`). For a super admin, who can read everyone's progress, that may be someone else's record. Always filter by the current user.
- Master console text at 11–12px (`master.index.jsx` and related) breaks the app's own 15px minimum. Bring it up to 15px.
- Video slots for the GOSTPA layers are empty (`gospaContent.js`, `GOSPA_VIDEOS = {}`). Leave the slots, but do not present empty players as if a video exists.
- The `/flow` walkthrough is a useful demo, but it describes features that do not exist (workshop scheduling, invites from the card). Label it clearly as a demo so nobody mistakes it for the product.
- The page title is hard-coded "Sam — Managing Strategy" in `src/routes/__root.jsx`. Make it follow the current program when other programs are added (Section 5); for now, "Sam — Managing Strategy" is fine on Strategy screens.
- Remove unused heavy packages that are not referenced (`three`, `react-leaflet`, `jspdf`, `html2canvas`, `canvas-confetti`, `@tanstack/ai-openai`, and any other unused library you confirm is dead code). The `master.reports` server chunk is about 900 KB and should come down as a result.

---

## 5. Next phase (lower priority)

Do not let this delay Sections 2–4. When those are done, I want the platform ready for Safety Sam, Supervisors Sam and Superintendents Sam, without a rebuild.

Today, `Product`, `ProgramCard`, `Tool` and `CardProgress` are already generic, and the card runner (`CardRunner.jsx`) can carry reading, video, questions, quizzes and uploads. That is the right base. What is hard-coded is the Strategy journey: `strategy.start.jsx` is fixed to `product_key = "strategy"`, the deployment plan exists only for `strategy`, and `/program/$programId` is still fake (P1-5).

Please propose, then build, one shared model for every Sam program:

- **Program** (the existing Product) → **Stage** (type: Prime / Validation Lab / Apply / Verify, or, for Strategy, Steps A–E) with an unlock rule (by date, by facilitator, or after the previous stage) → **Cards**.
- **Cohort** (customer, site, program, Lab date, facilitator) and **Enrolment** (person, cohort, status).
- A **Facilitator** role that can see a cohort's Prime answers, run the Lab, and export those answers as CSV/PDF.
- **Apply tools that unlock only at the Lab**, not as soon as a card is reached.
- **Apply runs 6 to 8 weeks after the Lab** (Dawid's decision, 13 November 2026), then Verify. Make the Apply length a cohort setting (6, 7 or 8 weeks, default 6), and schedule Verify for the week after Apply ends. Do not hard-code "weeks 7 to 12" or "week 13".
- A **Verify** record: observation, sign-off, evidence.
- A generic "My program" runner driven by the product, so a new program is config and content, not a new set of routes.

For Supervisors Sam, build from the final Ops Part A set in `docs/`: the Prime Workbook (10 Prime tasks, no new roster structure before the Lab), the Apply Tools (Tools 1–9, card lines 1–44 plus "+" on every card; the line number is the line's ID), and the Supervisor Handbook. Note that Apply Tool 6 (Shift Report) is being brought into line with the handbook template before the Supervisors phase starts.

Strategy should then sit on this engine as one program whose stages are Steps A–E. The other programs use Prime → Validation Lab → Apply → Verify. Same engine for both.

---

## 6. Questions to answer back

Please answer these in writing when you send the plan and timing for Sections 2–4.

1. **Tenancy.** Will you add `customer_id` to every table with matching access rules (the multi-tenant path in P1-1), or do you recommend one app per client? What does each option cost in Base44 credits and in admin effort?
2. **Site boundary.** Can a non-admin user change `site_id`, `access` or `customer_id` on their own User record via `auth.updateMe`? Please prove that they cannot, using a real site-level test account, and send me the result.
3. **Invites.** After `users.inviteUser()`, does a User record exist before the person accepts? If not, where will the pending site, access and customer be stored, and at what point are they applied?
4. **Sign-up.** Is the live app invite-only, with public registration off? Anonymous requests to the live URL currently return 401, which suggests the platform gate is on, but `/register` is still in the code. Please confirm.
5. **Hosting and backups.** Where is the data hosted (country/region)? How often is it backed up, how long are backups kept, and can one client's data be exported or restored on its own?
6. **Ownership and exit.** Who owns the code and the Base44 account, and can I take a full export of code and data if I leave Base44?
7. **Test flag.** Why was everything created with `is_test: true`, and what is the clean-up plan for existing records before a client goes in?
8. **Offline.** What happens to queued offline changes when the login token has expired? Have you tested a shift of around 12 hours offline, then a sync after re-login?
9. **Running cost.** What does Base44 usage cost per active user per month at a scale of about 20 clients × 40 users, including any AI summary on the reports page?

Please confirm when Priority 1 and the handbook alignment will be in `main`, and when I can have three test logins (platform super admin, client administrator, and a site-level learner) on the live or preview app, against a demo customer with a program assigned, so the full flow can be walked through.

Thank you. The design is strong and the phone-first approach is right. I want the data model, the access rules, and the handbook alignment to be at the same standard before a client is invited in.
