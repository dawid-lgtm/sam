# Sam — deep-dive review brief

**Prepared for:** Grok (independent review)
**App:** Sam — a leadership operating system for mine sites
**Live app:** https://sam-2128035d.base44.app
**Code:** the repository this file sits in (TanStack Start + React 19, JavaScript, Base44 backend)
**Date of this brief:** 13 November 2026

---

## 0. What I am asking you to do

Read this brief, then the code and the data model it points at. Judge the product and the build, not the prose.

I want:

1. **Is the model right?** Does the GOSPA chain (Goal → Objectives → Strategies → Plans → Actions) as it is modelled here actually force line-of-sight from a CEO's three-year goal down to a supervisor's action on a Tuesday, and does anything in the schema let that chain break silently?
2. **Is the access model safe?** Row-level security is defined per entity (section 7). Find any place a site-level user could read or write another site's data, or where a rule is so tight a legitimate user is locked out.
3. **Is the invitation logic correct?** Section 11.2. It is a two-path flow with a hard rule about when email leaves the building. Find the holes.
4. **Is the offline story honest?** Section 11.5 and section 12. What fails underground, and what would a mine site notice first?
5. **What is over-built, under-built, or wrong for the customer?** Be blunt. Name things to delete, not just things to add.
6. **Sequencing.** Given the open items in section 12, what is the next three weeks of work, in order?

Format your answer as: findings (severity: blocker / should fix / nice to have), then a recommended next three moves.

Everything you need is in this file plus the repository. There are no secrets involved, and nothing here depends on a paid third-party account.

---

## 1. The business, in one paragraph

Sam is built by **Raptortech** (mining operations consultancy) as the delivery vehicle for **Decision Architecture**: a fixed, repeatable way of installing a leadership operating system into a mine site. The product is sold per customer, delivered by Raptortech, and cascaded by the customer's own leaders. The software's job is not to be the strategy — it is to make the customer's agreed strategy impossible to drift away from, and to make delivery measurable so Raptortech can show progress per customer and per site.

The commercial model shapes the software:

- Raptortech controls the **catalogue** (Products), the **materials** (Tools: handbooks, agendas, coaching cards, workbooks) and the **card content** of every program.
- The customer's **administrator / project lead** loads their people, runs the workshops and enters the Goal, Objectives and Strategies.
- The customer's **site leaders** cascade into tactics, plans and actions, and run the meeting rhythm that keeps it alive.
- Nothing in the app ranks people. That is a deliberate constraint (see 11.4).

---

## 2. The thesis the app encodes

1. **One goal, five objectives maximum, one executive owner each.** If everything is a priority, nothing is. The tool refuses a sixth objective and refuses an objective with no owner.
2. **A strategy is a choice, not a wish.** Each strategy carries an owner, a value (volume and/or dollars) and the metric it moves. A strategy with no tactics, plans or actions behind it is treated as *not delivered*, not as "in progress".
3. **The cascade is the product.** A strategy that never becomes a site tactic is decoration. Sam shows, per strategy per site, whether the chain continues or stops.
4. **Meetings are the delivery mechanism.** The rhythm is explicit: weekly **IN the business** (the site's own leadership team), monthly **ON the business** (the manager joins), quarterly **enterprise ON the business** (the report is read). Meetings have a cadence, weeks, a day, a duration, an owner, and what they decide.
5. **Maturity is assessed, not assumed.** The maturity staircase (Creativity → Direction → Delegation → Coordination → Collaboration) and the maturity ladder (Reactive → Structured → Measured → Self-improving) are assessed across five dimensions: strategies, meetings, site–head office, behaviours, and the goal itself.
6. **Data does not exist until it is written in the room.** The workshops are agenda items that open the tool; the person running the workshop types as the room talks. That is why the walkthrough (section 10) is a presentation artefact of the *actual* screens.

---

## 3. Who uses it, and what each person can do

Two layers of identity:

- **Platform role** (`User.role`): `admin` or `user`. Platform-level: who may administer the app itself and invite people.
- **Access level** (`User.access`, app-defined): what the person may change inside Sam.

| Access level | Can change | Cannot |
|---|---|---|
| `administrator` | Everything: goal, objectives, strategies, change log, any site's tactics/plans/actions, people's access, customers, products, tools | — |
| `executive` | Goal, objectives, strategies, change log | Site tactics/plans/actions |
| `project_lead` | Goal, objectives, strategies, change log (completes the setup steps) | Site tactics/plans/actions |
| `project_manager` | Tactics, plans, actions, tracker — **only on their own `site_id`** | Strategy layer |
| `site_lead` | Same as project manager, own site only | Strategy layer |

Implemented in `src/lib/access.js` (`canEditStrategy`, `canEditSite`, `isAdministrator`) and enforced again at the database by RLS (section 7) — the UI is not the security boundary.

**Site scoping is the commercial control.** A site-level person belongs to exactly one site. The site list comes from the setup the operator completed, never from free text, so an operator cannot expand the customer's group beyond the sites that were sold and set up.

---

## 4. Design language and constraints

Non-negotiables given by the client, all visible in the code:

- **Navy and gold** on a navy screen. Tokens in `src/index.css` (`--background`, `--card`, `--gold`, `--navy`); `.light` class provides a light mode. Gold is the only accent and means "act / agreed / your next step".
- **Phone first, then desktop.** Underground supervisors use a phone with gloves on. Nothing reads smaller than 15px (`.text-xs`/`.text-sm` are overridden to 0.9375rem), tap targets are 48px minimum (`.sam-btn`), and the bottom bar is the primary navigation on mobile (`src/components/AppNav.jsx`; desktop gets a top row instead).
- **Fraunces** for headings, **Figtree** for body.
- **Glass surfaces**: `.sam-glass` — translucent card, 12px blur, 1px hairline — is the one surface used by every mock-up and walkthrough screen, so the whole product looks like one thing.
- **No small-caps eyebrows, no ranking of people, no vanity dashboards.** Empty reporting widgets were deliberately removed from the setup state; an empty chart is worse than no chart.
- **"Mine in a box™"** sits under the company name. The "Powered by Raptortech" credit links to the company site (`src/components/RaptortechCredit.jsx`).
- **Brand mark**: an aviator girl with a golden plane, rendered through `BrandMark` on auth screens. It must fill its gold circle without scaling artefacts.

---

## 5. Technical shape

- **TanStack Start** (file-based routes, server-rendered by default), React 19, Tailwind, JavaScript/JSX. Deployed on Base44 (Cloudflare Workers).
- **Routes** in `src/routes` — one file per screen (section 9).
- **Entities** (database tables) in `base44/entities/*.jsonc` — schema + row-level security in the same file (section 7).
- **Data access**: the Base44 SDK (`@/api/base44Client`). Reads are filtered, counted and aggregated server-side, never by loading everything and doing it in JavaScript.
- **Auth**: platform-owned. Email/password plus optional MFA, Google sign-in, reset and verification pages (`login.jsx`, `register.jsx`, `mfa.jsx`, `forgot-password.jsx`, `reset-password.jsx`). `_authed.jsx` is a pathless layout that gates everything behind sign-in and exposes `user` to its children.
- **State**: TanStack Query. `useSamData()` (`src/lib/useSamData.js`) is the single read for the entire strategy chain and is cached to the device (section 11.5).
- **Offline layer**: `src/lib/offline.js` + `src/lib/useOffline.js` + `src/components/OfflineStatus.jsx` (section 11.5).

---

## 6. The method the data model mirrors

**GOSPA**, in order, one row per layer:

| Layer | Question | Owner | Sam table |
|---|---|---|---|
| **G**oal | Where are we going in three years? | CEO / ELT | `CompanySetting` |
| **O**bjectives | What must be true to get there? (max 5) | One ELT member each | `Objective` |
| **S**trategies | How will we make it true? (choice + value) | ELT / regional GM | `Strategy` |
| **P**lans | Who does what, where, when? | Site | `Plan` |
| **A**ctions | Who does this, by when? | Site / crew | `SiteAction` |

Two layers sit outside GOSPA but are part of delivery:

- **Tactics** (`Tactic`) — the site's approach that delivers a named strategy. This is the bridge between head office and the face; it is where "90% fleet availability" becomes "pair each loader with a dedicated crew".
- **Asks** (`SiteAsk`) — a site saying "we cannot deliver this strategy, and here is what it would take". This is the mechanism that stops a cascade being a one-way instruction.

Supporting tables: `Meeting` (the rhythm), `Assessment` (maturity), `StrategyTracker` (12-month per-site tracking of each strategy), `ObjectiveChangeLog` (a goal change is a logged event, not a quiet edit), `Tool` (materials), `Product` + `ProgramCard` + `CardProgress` (the programme content and each person's progress through it), `Customer` + `Site` (the commercial layer), `SafetyTask` and `FourBlockDay` (operational rituals).

---

## 7. Data model, entity by entity

Every entity has built-in `id`, `created_date`, `updated_date`, `created_by_id`. RLS below is the actual rule in `base44/entities/*.jsonc`; treat those files as the authority.

### 7.1 Strategy layer

**CompanySetting** — the single goal sentence. Fields: `company_name`, `goal_sentence`, `goal_repeatable`, `goal_changed_by`, `goal_changed_date`, `is_test`.
RLS: read = admin or user; write = admin only. One record exists.

**Objective** — `code` (O1…), `statement`, `outcome`, `value_to_business`, `metric`, `target_date`, `exec_owner`, `load_bearing_note`, `progress`, `sort`, `is_test`.
RLS: read = any signed-in; write = admin only.
Business rule: **five is the ceiling**, and `exec_owner` is required — enforced in the editor UI (`ObjectiveEditor`), not in the schema.

**Strategy** — `code` (S1…), `statement`, `objective_code`, `owner`, `success_metric`, `value_volume`, `value_dollars`, `deliver_date`, `deliver_month`, `sites[]`, `review_date`, `sort`, `is_test`.
RLS: read = any signed-in; write = admin only.

**ObjectiveChangeLog** — `log_date`, `objective_code`, `change`, `cause`, `board_approval_date`, `logged_by`.
RLS: read = any signed-in; **create = admin; update = nobody; delete = nobody**. A change to the goal is permanent record. This is deliberate and worth reviewing (section 13, Q6).

**StrategyTracker** — one row per strategy per site per year: `strategy_code`, `site_id`, `site_name`, `m1`…`m12` (monthly state), and `q1_volume/q1_value` … `q4_volume/q4_value`.
RLS: read = any signed-in; create/update/delete = admin **or** `data.site_id == {{user.data.site_id}}`.

### 7.2 Site layer (all site-scoped)

**Tactic** — `site_id`, `site_name`, `code` (T1…), `approach`, `delivers_strategy` (strategy code), `owner`, `not_working_trigger`, `review_date`, `deliver_month`, `sort`, `is_test`.
RLS: read = any signed-in; write = admin or own-site.

**Plan** — `site_id`, `site_name`, `code` (P1…), `what`, `delivers_tactic`, `who`, `where`, `when`, `sort`, `is_test`. Same RLS shape.

**SiteAction** — `site_id`, `site_name`, `code` (A1…), `action`, `for_plan`, `owner`, `due`, `done`, `sort`, `is_test`. Same RLS shape.

**SiteAsk** — `site_id`, `site_name`, `strategy_code`, `objective_code`, `ask`, `can_deliver`, `reason`, `what_it_would_take`. Same RLS shape.

### 7.3 Delivery rhythm

**Meeting** — `title`, `scope` (Head office | Site), `site_id`/`site_name`, `cadence` (**IN** | **ON**), `weeks[]` (which weeks of the quarter it runs), `day_of_week`, `start_time`, `duration_min`, `owner`, `decides`, `rules`, `sort`.
RLS: read = any signed-in; write = admin only. Six meetings are seeded.

**Assessment** — `assessee`, `assessment_date`, `staircase_step` (Creativity…Collaboration), `turning_point`, five maturity fields (`maturity_goal`, `maturity_strategies`, `maturity_meetings`, `maturity_site_head_office`, `maturity_behaviours`; each Reactive → Self-improving), `gaps`, `meetings_review[]`, `evidence[]`.
RLS: **per creator** — you see and change only your own assessments; an admin sees all. Deliberate: an assessment is about a person, so it is not shared data. Worth challenging in review (section 13, Q7).

### 7.4 Commercial layer

**Customer** — `name`, `code`, `status` (Prospect / Onboarding / Active / Paused), `products[]`, `contact_name`, `contact_email`, `region`, `address`, `logo_url`, `sites[]`, `start_date`, `notes`, `delivered_by` (Raptortech team | Another team), and four progress percentages: `progress_sam`, `progress_ops`, `progress_maintenance`, `progress_strategy`.
RLS: **admin only, all four operations.** The customer record is Raptortech's, not the customer's.

**Site** — `name`, `kind` (Open pit | Underground), `superintendent`, `sort`, `is_test`.
RLS: read = any signed-in; write = admin only.
This is the list the operator's setup produces, and the only source for "which site does this person work at".

**Product** — `key`, `name`, `description`, `for_whom`, `inside`, `status` (Available | Later), `progress_field`, `sort`. The catalogue: Managing Strategy, Managing Ops & Maintenance, etc. Ten records seeded.

**Tool** — `title`, `category` (Handbook / Agenda / Coaching card / Workbook / Slide pack / Other), `summary`, `content`, `file_uri`, `file_name`, `version`, `assigned_products[]`, `sort`. The materials that go with each product.

**ProgramCard** — the content of a program, one card per screen step: `product_key`, `format` (text / video / question / multiple_choice / upload / quiz / poll), `title`, `body`, `media_url`, `options[]`, `correct_option`, `upload_kind`, `tool_id`, `step`, `is_welcome`, `sort`. 22 cards seeded.

**CardProgress** — per person, per program: `product_key`, `entries[]` (the filled-in answers), `day`, `done`, `total`.
RLS: own records (creator) or admin.

**SafetyTask** / **FourBlockDay** — the two operational rituals tracked per customer/site (safety tasks designed and implemented; four-block day logged per supervisor/superintendent). Admin-only RLS.

**User** (platform built-in, extended) — `role` (`admin`/`user`), `access` (the five access levels), `site_id`, `customer_id`. Never created from code; people join by invitation.

---

## 8. Live data, as at this brief

Read from the app's database when this file was written. Use it to sanity-check the model against real content.

| Entity | Records | Note |
|---|---|---|
| CompanySetting | 1 | one goal |
| Objective | 4 | under the 5 ceiling |
| Strategy | 6 | |
| ObjectiveChangeLog | 1 | |
| Site | 2 | Kestrel Underground (underground), North Pit (open pit) |
| Tactic | 6 | site tactics |
| Plan | 4 | |
| SiteAction | 5 | |
| SiteAsk | 4 | |
| StrategyTracker | 9 | strategy × site rows |
| Meeting | 6 | IN and ON the business, head office and site |
| Customer | 1 | "Falck Test", status Active |
| Product | 10 | catalogue |
| Tool | 2 | materials |
| ProgramCard | 22 | program content |
| CardProgress | 0 | nobody has started a program in-app yet |
| Assessment | 0 | no maturity assessment taken yet |
| SafetyTask / FourBlockDay | 0 | rituals not yet used |
| App users | 1 | a single administrator; no site-level users yet |

### Data hygiene problems we already know about (do not report these as discoveries)

1. `Customer.sites` for "Falck Test" holds `["Home","Office","Bedroom"]` while the `Site` table holds *Kestrel Underground* and *North Pit*. The customer's site list is free text and has drifted from the site table. **This is a real modelling fault**: `Customer.sites` should reference `Site.id`, not names. Reviewer: say so if you agree.
2. No site-level user exists yet, so no site-scoped RLS rule has ever been exercised against a real non-admin account. Treat section 7 as *unproven in production*.
3. `is_test` exists on most records and everything currently in the app is test data.

---

## 9. Screen map

Root (public): `login`, `register`, `mfa`, `forgot-password`, `reset-password`, `welcome`.
Authenticated (`src/routes/_authed/*`):

| Route | Screen | Purpose |
|---|---|---|
| `/` | Home | Goal hero, this quarter's objectives, next meeting, four-block day |
| `/assess` | Assess | Maturity staircase + five-dimension matrix + evidence questions + meeting review |
| `/strategy` | Strategy shell | Tabs onto the strategy layer |
| `/strategy/start` | Start here | Where a project lead begins |
| `/strategy/gospa` | The GOSPA model | The five layers, explained, with the sheet that captures each |
| `/strategy/strategies` | Strategies | The strategies that deliver each objective |
| `/strategy/tracker` | Tracker | The 12-month, per-site grid per strategy |
| `/strategy/changelog` | Change log | Every change to the goal and objectives, with cause and board approval |
| `/strategy/deploy` | Deployment | The delivery methodology, step by step, with gates |
| `/strategy/rhythm` | The rhythm | IN/ON the business explained |
| `/strategy/actions` | Action register | Every action, by site and owner |
| `/site` | Sites | Site list with chain completeness |
| `/site/$siteId` | One site | The chain: goal → objective → strategy → tactic → plan → action, plus asks |
| `/meetings` | Meetings | The calendar |
| `/meetings/year` | Year view | Twelve months of the rhythm |
| `/program/$programId` | A program | The card runner |
| `/people` | People | Admin: set each person's access level and site |
| `/admin` | Admin | App settings |
| `/master/*` | Master admin | Raptortech's own console: customers, products + training design, core materials, safety, reports, users, Raptortech team |
| `/flow` | **Test the card flow** | The guided walkthrough (section 10). Super-admin only |

---

## 10. The walkthrough — the heart of the spec

`/flow` (`src/components/flow/`) is not decoration. It is the **specification of the two user journeys, rendered as the actual screens**, with the reasoning written beside each. The client walks customers through it. Two journeys, in page order:

### 10.1 Vahid — administrator / project lead (21 screens)

1. The welcome email he gets → 2. He sets his password → 3. He signs in → 4. Where signing in lands him (a two-step guided setup, not a dashboard) → **4A** Step 1: add a person → **4B** the org chart → **4C** Step 2 locked until Step 1 is done → 5. Step 2, the first workshop → **5A** he enters the finalised Goal and Objectives → **5A1** the add-objective sheet → **5B** save turns into "schedule the second workshop" → **5C** deployment methodology → **5D** tools and artifacts → **5E** set up, so the setup page is gone (the real dashboard) → 6. Which step is next → **6A** the cascade gate → 7. Where each answer goes (GOSPA) → **7A** the goal, written in the room → **7B** objectives, one owner each → **7C** strategies, with a worked example → 8. In the meeting, on the agenda.

Numbering is deliberate (`src/lib/slideOrder.js`): a page that opens over another carries the parent's number plus a letter. 4 is home, 4A is a sheet over it.

### 10.2 Mike — site lead / project manager (13 screens)

1–3. Invite, password, sign in → 4. He lands on a **welcome**, not a dashboard: the goal, the objectives and the strategies head office has just cascaded, and the meeting rhythm drawn as a chain → **4A** the rhythm as a pop-up flow → **4B** the goal and objectives in full → **4C** progress on his programs → 5. His site and the gap (the chain stops at strategy; tactics are his work) → **5A** the instruction card, with a worked example → **5B** the tool arrives pre-filled (the strategy is a dropdown, never retyped) → **5C** plans: who, what, where, when → **5D** actions: a name and a date → 6. His meeting runs off his own data.

### 10.3 Why it is built this way

- **A setup checklist, not a dashboard, is the first screen.** Vahid has no data yet; an empty dashboard teaches him the product is empty. Two steps with a lock between them teach him the method.
- **The lock is real.** Step 2 refuses to open until people have roles, because the role is what the invite promises and what the person can do.
- **Saving is a transition, not a confirmation.** Saving the Goal and Objectives immediately asks for the second workshop. The product never returns a user to a dead end.
- **Examples sit inside the tools.** Every input field is preceded by what a good answer looks like: a strategy is "a choice, not a wish", a tactic is "what we do here", an action is "a name and a date". This is the difference between a form and a method.
- **Pre-fill over retype.** A site never retypes the strategy to link its work: the dropdown holds the agreed strategies. The link is the point.

---

## 11. Business rules that are actually encoded

### 11.1 The chain cannot be skipped
A site tactic must name the strategy it delivers; a plan must name its tactic; an action must name its plan. Everything reads upward, so head office can see exactly where a cascade stops.

### 11.2 Invitations — two paths, one rule
This is the logic most recently changed and the one most worth your review.

- **First workshop not yet held.** The operator dates it, ticks the people they have loaded who must be in the room, reads the invitation email, and ticks **"I have checked the email text."** Saving is what sends the invite, to exactly those ticked people. Nothing leaves the building before that tick. The button stays locked ("Check the email text first") until then.
- **First workshop already held (ticked as completed).** *No invite goes out from that card at all.* The next invitation is the **second** workshop: scheduling it is what invites the team onto the platform, with the completed Goal, Objectives and Strategies inside the email.
- **Why.** Some customers have already run their leadership team meeting, or have already locked in their Goal and Objectives, and want to go straight to Strategies and cascade. Under the old logic they would have invited people to a meeting that already happened. This path exists so nobody is invited twice and no one receives a meeting invitation for a past event.
- **Deferred invitations are deliberate elsewhere too.** Adding a person to the org never sends their invite; the invite rides with the workshop email.

### 11.3 A person cannot exist without a site
Name, email, **site**, role and who they report to. Site and role are both mandatory:

- The site dropdown offers **only the sites from the operator's setup** — never free text.
- Save/invite is refused without a site (an admin/super-admin account is the only exception, because they administer rather than work a site).
- **Why:** the site list is the commercial boundary. It stops the customer expanding their user group past the sites that were sold and set up, and it is what makes site-scoped permissions meaningful.

### 11.4 Constraints that are product decisions
- **Maximum five objectives.** Enforced in the editor.
- **No ranking of people.** There is no leaderboard, no score ordering, no comparison of one person to another — the assessment is about a system's maturity, not a person's worth.
- **Strategies and objectives belong to head office.** Site people read them, never edit them.
- **A strategy with no tactics/plans/actions is "not delivered", never "in progress".**
- **A changed goal is an auditable event**, not an edit (ObjectiveChangeLog is append-only).

### 11.5 Offline — built, and honest about its limits
Underground crews have no signal. So:

- **Reads**: the whole strategy chain is cached on the device after any successful load (`localStorage`, key `sam.offline.cache.v1`). With no signal, the app renders that cache.
- **Writes**: every site write (tactic, plan, action, ask, tracker cell, action tick) goes through `saveOffline()`. With signal it writes straight to the app; without it, the change is appended to a device queue (`sam.offline.queue.v1`) and laid over the cached data immediately, so the person sees their own work.
- **A record created offline gets a local id** (`local-…`); later edits and deletes of that record are folded into the queued create rather than emitting a second operation.
- **Sync**: replaying the queue is automatic on the `online` event and on app load, plus a manual "Sync now". Replay is in order; if signal drops mid-replay it stops and keeps the remainder.
- **A change the app refuses** (validation or permission, not a network error) is skipped, counted, and reported: "N changes could not be saved and were dropped." It does not block the rest of the queue forever.
- **The bar** (`OfflineStatus`) sits under the header: it says there is no signal, how many changes are held, and how many are waiting to sync. It disappears when everything is clean.
- **What is NOT done:** there is no service worker, so the app shell itself is not cached — the app must have been opened once with signal before it will open offline, and a hard reload underground fails. There is no PWA install. There is no conflict resolution: last write wins, because a site's data is written by its own people. Reviewer: this is the honest boundary of the feature today.

---

## 12. What is built, what is not

### Built and working
Auth (password, Google, MFA, reset, verification), role + access model with RLS, the full GOSPA chain with cascade views, goal and objective editors with the 5-objective ceiling, strategies with value and owner, site tactics/plans/actions/asks with site scoping, the 12-month strategy tracker grid, the change log, meetings and the year view, maturity assessment (staircase, matrix, evidence, meeting review), the program card runner with per-person progress, the master console (customers, products, tools, safety, reports, users), people management with site allocation, the guided walkthrough, and the offline layer described above.

### Not built, in the client's words
- Weekly automated emails for outstanding action items; scheduled meeting reminders carrying fresh GOSPA/tracker/tool links; in-app nudges.
- Making agendas and coaching cards downloadable alongside handbooks.
- A follow-up email when a second program is selected.
- An onboarding explainer on first sign-in.
- Full offline: service worker / installable app shell (see 11.5).
- Real workshop scheduling and real invite sending from the flow screens — the flow currently *documents* this behaviour; the production invitation is issued from the master console. (See section 13, Q3: this gap is the most important open design decision.)
- Video URLs for the GOSPA layer slots are still pending from the client.

### Known issues
- The Sam logo has not been uploaded to the app dashboard; the home page placeholder shows an empty box. Brand mark artwork exists in code.
- `Customer.sites` is free text and has drifted (section 8).
- Only one app user exists, so nothing site-scoped has been tested with a real site-level account.

---

## 13. Questions I specifically want your judgement on

1. **Cascade integrity.** Should the schema itself refuse a `Tactic` whose `delivers_strategy` does not exist, or is that a UI rule? Where else does the chain rely on convention rather than constraint?
2. **Site scoping across entities.** `StrategyTracker`, `Tactic`, `Plan`, `SiteAction`, `SiteAsk` all scope writes by `data.site_id == {{user.data.site_id}}`. Is there a read or write path where an `undefined` `site_id` on a user's record would widen access rather than narrow it?
3. **The invitation gap.** Product rules say invites leave when a workshop is scheduled, after the email is checked. Today the flow screens describe it and the master console issues invites. Should the workshop scheduling become a real feature with real sends, and if so, what is the minimum trustworthy implementation?
4. **Offline.** Is a queue with last-write-wins acceptable for site data, and would you add a service worker now or after the first pilot? What is the smallest thing that makes "open the app underground" true?
5. **Data model.** `Customer.sites` as strings, `StrategyTracker` as 12 monthly columns plus 8 quarterly numbers, `ProgramCard.entries` as an array on `CardProgress` — which of these will hurt first at scale, and what replaces them?
6. **The append-only change log** blocks all updates (`update: false`). Is that the right shape for a regulated customer, or does it need an amendment path?
7. **Assessment privacy.** Assessments are per-creator or admin-only. For a tool whose selling point is a common view of the business, is that the right call, or should assessments be visible to the assessed person's manager?
8. **The five-objective ceiling** is a UI rule, not a schema rule. Should it be enforced in the database?
9. **Over-build.** Master console, programs/cards, safety tasks, four blocks — which of these is not earning its place in a first pilot, and should be cut or hidden?
10. **What is missing** from a mine site's actual Tuesday that this product assumes away?

---

## 14. How to explore the code

| Path | What is there |
|---|---|
| `base44/entities/*.jsonc` | Every table: fields, enums, required, and its row-level security |
| `src/routes/**` | One file per screen; the file name is the URL |
| `src/components/flow/**` | The walkthrough — the product spec rendered as screens |
| `src/components/flow/userFlowScreens.jsx` | The written reasoning for every walkthrough screen |
| `src/lib/access.js` | The access model |
| `src/lib/offline.js`, `src/lib/useOffline.js` | The offline queue and sync |
| `src/lib/useSamData.js` | The single read of the whole chain, and its device cache |
| `src/lib/deploymentPlan.js` | The delivery methodology, phase by phase, with gates |
| `src/lib/gospaContent.js`, `src/lib/assessContent.js` | The method's own words |
| `src/lib/slideOrder.js` | Slide numbering for the walkthrough |
| `src/index.css` | The design tokens and the `.sam-glass` surface |
| `src/components/AppNav.jsx`, `src/components/Layout.jsx` | Navigation and shell |

**To see the app:** https://sam-2128035d.base44.app — signing in requires an invited account; the single existing account is the administrator's. You do not need it: everything in section 10 is readable in code, and the live data is summarised in section 8.

---

## 15. Constraints on your recommendations

- **Do not propose adding a ranking or scoring of people.** It is excluded by the client, on purpose.
- **Do not propose replacing the phone-first, large-type, navy-and-gold design.** It is a field requirement, not a taste.
- **Keep the site boundary intact.** Anything that lets a customer create sites or people outside their setup is a commercial breach, not a feature.
- **The method (GOSPA, the meeting rhythm, the maturity ladder) is the client's intellectual property.** Recommendations should make it harder to drift from, not simplify it away.
- Prefer deleting to adding. The client's own instinct has consistently been "less on screen, fewer empty widgets, no reporting before there is data".

---

*If something in this brief disagrees with the code, the code and the entity files are right — and that disagreement is itself a finding worth reporting.*
