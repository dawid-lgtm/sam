import { Frame, MockCard, MockField, MockPill, MockRow, MockTap } from "@/components/flow/MockScreen";
import { PhoneDash } from "@/components/flow/DashboardMock";
import { AdminLanding } from "@/components/flow/AdminLanding";
import { AddPersonSheet } from "@/components/flow/admin/AddPersonSheet";
import { OrgChart } from "@/components/flow/admin/OrgChart";
import { LaunchProgram } from "@/components/flow/admin/LaunchProgram";
import { LoadGoals } from "@/components/flow/admin/LoadGoals";
import { ScheduleWorkshop } from "@/components/flow/admin/ScheduleWorkshop";
import { MethodologyPage } from "@/components/flow/admin/MethodologyPage";
import { ToolsPage } from "@/components/flow/admin/ToolsPage";
import { AdminDashboard } from "@/components/flow/admin/AdminDashboard";

export const PEOPLE = {
  vahid: { name: "Vahid", role: "Project lead", blurb: "He runs the workshop and puts the Goal, Objectives and Strategies into the tool while the room talks." },
  mike: { name: "Mike", role: "Project manager", blurb: "He cascades the agreed Goal, Objectives and Strategies onto his site: tactics, plans and actions." },
};

export const SCREENS = {
  vahid: [
    {
      group: "The dashboard",
      title: "Where signing in lands him",
      where: "Home · Administrator",
      does: "Exactly what the welcome email promised: the administrator page. Two steps sit at the top, load his people and set their roles, then launch the program. Under them are the deployment methodology, the tools and artifacts, and the dashboards, which stay empty until the program is launched.",
      view: <AdminLanding />,
    },
    {
      group: "Setting up the program",
      title: "Step 1 · he taps People and roles",
      where: "Home · Add a person",
      does: "A sheet opens over the page. Name, email, site, role and who they report to. The role is required: Sam refuses to save without it, because the role is what the invite email promises and what the person can change. Direct reports are offered here, so the org chart is built as he goes, and a link shows the chart as it stands.",
      view: <AddPersonSheet />,
    },
    {
      group: "Setting up the program",
      title: "The org chart he has entered",
      where: "Home · Org chart",
      does: "The same people, once, where they report. Anyone he has not given a role to is flagged, because Sam cannot invite them. He can add a person straight into any box.",
      view: <OrgChart />,
    },
    {
      group: "Setting up the program",
      title: "Step 2 · Launch the program",
      where: "Home · Launch the program",
      does: "The tick sits at the top: has the session been held? Left empty, he dates the first workshop and Sam puts it in Meetings. Ticked, the date is not asked for at all.",
      view: <LaunchProgram />,
    },
    {
      group: "Setting up the program",
      title: "Ticked: he enters the Goal and Objectives",
      where: "Home · Enter the Goal and Objectives",
      does: "He cannot launch on an empty frame. One three-year Goal, typed as the room wrote it, then up to five Objectives, each with its executive owner and the metric it moves. Sam refuses to save an objective with no owner, and Save is the only button.",
      view: <LoadGoals />,
    },
    {
      group: "Setting up the program",
      title: "Save turns into the next question",
      where: "Home · Schedule the second workshop",
      does: "The moment he saves, Sam asks for the second workshop: the full day that reviews the Goal and Objectives and defines the Strategies. The room is pre-ticked from the roles he has entered, program managers, GMs and the ELT, and any role his org does not have yet is shown with a way to add it.",
      view: <ScheduleWorkshop />,
    },
    {
      group: "Setting up the program",
      title: "Deployment methodology, step by step",
      where: "Home · Deployment methodology",
      does: "The three steps of the program, in order, with the gate each one has to pass and where he is in it right now.",
      view: <MethodologyPage />,
    },
    {
      group: "Setting up the program",
      title: "The tools and artifacts page",
      where: "Home · Tools and artifacts",
      does: "What the program hands out, each carrying its program and version: the handbook, the workshop agenda, the site coaching card. A row opens on screen, so he can read it or send it to the room.",
      view: <ToolsPage />,
    },
    {
      title: "Which step is next",
      where: "Program · Managing Strategy",
      does: "The program tells him exactly which step he is in and what the step needs. He taps the step that is up next.",
      view: (
        <Frame label="Managing Strategy">
          <MockCard title="Week 3 of 12 · 42%">
            <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
              <div className="h-full w-[42%] rounded-full bg-gold" />
            </div>
          </MockCard>
          <MockRow>Goal · done ✓</MockRow>
          <MockRow>
            <span className="font-semibold text-gold">Objectives · up next</span>
          </MockRow>
          <MockRow>Strategies</MockRow>
          <MockRow>Cascade to site</MockRow>
        </Frame>
      ),
    },
    {
      title: "In the meeting, on the agenda",
      where: "Meetings",
      does: "The workshop is dated in Meetings. The agenda names the tool that is used, so the data is entered in the meeting, not afterwards.",
      view: (
        <Frame label="Meetings">
          <MockCard title="ON the business · leadership workshop" note="Full day · CEO, ELT, Ops, GMs, PMs">
            <p>1 · Goal confirmed</p>
            <p>2 · Objectives, one owner each</p>
            <p className="text-gold">3 · Strategies, entered in Sam →</p>
          </MockCard>
          <MockRow arrow>Open the GOSPA sheet</MockRow>
          <MockRow arrow>The four rules</MockRow>
        </Frame>
      ),
    },
    {
      title: "Where each answer goes",
      where: "Strategy · The GOSPA model",
      does: "The ladder is the map. Whatever is agreed in the room goes into one of the five rows, in that order.",
      view: (
        <Frame label="The GOSPA model">
          <MockCard title="1 · Goal" note="One three-year goal" />
          <MockCard title="2 · Objectives" note="Up to five, one executive owner each" />
          <MockCard gold title="3 · Strategies" note="Deliver the objectives · owner and value" />
          <MockCard title="4 · Plans" note="Site level: who, what, where, when" />
          <MockCard title="5 · Actions" note="A name and a date" />
        </Frame>
      ),
    },
    {
      title: "Goal, written down in the room",
      where: "Strategy · Goal",
      does: "He types the goal the room agreed and saves it. It is now the sentence every site will see on its home screen.",
      view: (
        <Frame label="Goal">
          <MockCard title="The goal">
            <MockField
              value="Be the safest, lowest cost 2 Mt a year underground mine in the region by 2029."
            />
            <p className="text-[12px] text-muted-foreground">Changed by Vahid · 12 Nov · in the change log</p>
          </MockCard>
          <MockTap>Save goal</MockTap>
        </Frame>
      ),
    },
    {
      title: "Objectives, one owner each",
      where: "Strategy · Objectives",
      does: "He adds each objective with its outcome, its metric and the executive who owns it. Five is the ceiling and the tool stops him at five.",
      view: (
        <Frame label="Objectives · 3 of 5">
          <MockCard title="O1 · Zero serious incidents" note="Owner: COO · metric: TRIFR">
            <MockField label="The outcome" value="Every crew home safe, every shift." />
          </MockCard>
          <MockCard title="O2 · 90% fleet availability" note="Owner: GM Ops" />
          <MockCard title="O3 · 12% lower cost per tonne" note="Owner: CFO" />
          <MockTap>Add objective</MockTap>
        </Frame>
      ),
    },
    {
      title: "Strategies, with an example on screen",
      where: "Strategy · Strategies",
      does: "The workshop writes the strategies that deliver the objectives. The instruction card shows what a good one looks like before he types.",
      view: (
        <Frame label="Strategies">
          <MockCard gold title="What a strategy must have" note="Example, not a template">
            <p>A choice, not a wish: &ldquo;Move to a single fleet loader strategy so availability stops being the bottleneck.&rdquo;</p>
            <p className="text-muted-foreground">Owner, value and the metric it moves.</p>
          </MockCard>
          <MockCard title="S2 · Single fleet loaders">
            <p>Owner: GM Ops · Value: 6% availability</p>
          </MockCard>
          <MockTap>Add strategy</MockTap>
        </Frame>
      ),
    },
    {
      title: "The gate before it goes to site",
      where: "Program · Managing Strategy",
      does: "Nothing cascades until every objective has a strategy, an owner and a value. Then Vahid opens the gate and the sites are told.",
      view: (
        <Frame label="Cascade to site">
          <MockCard title="Ready to cascade">
            <p>✓ Goal saved</p>
            <p>✓ 3 objectives, each with an owner</p>
            <p>✓ Every objective has a strategy and a value</p>
            <p>✓ Site meeting dated before head office</p>
          </MockCard>
          <MockTap>Send to the sites</MockTap>
        </Frame>
      ),
    },
    {
      group: "The dashboard",
      title: "Set up, so the setup page is gone",
      where: "Home · Administrator",
      does: "Once the people are loaded, the program is launched and the second workshop is dated, the checklist disappears and his normal admin dashboard loads: the programs with real progress, the sites and their cascade, and what is due this week. No reporting dashboards early, no empty charts.",
      view: <AdminDashboard />,
    },
  ],

  mike: [
    {
      group: "The dashboard",
      title: "Where signing in lands him",
      where: "Home",
      does: "The same app, his own numbers. The agreed Goal is already on his home screen and My programs says the cascade is his next step.",
      view: (
        <PhoneDash
          name="Mike"
          role="Project manager"
          site="Kestrel Underground"
          goal="Be the safest, lowest cost 2 Mt a year underground mine in the region by 2029."
          quarter="4 strategies · 1 site tactic"
          programs={[
            { label: "Managing Strategy", pct: 68, note: "cascade to site" },
            { label: "Ops & Maintenance", pct: 0, note: "not started" },
          ]}
        />
      ),
    },
    {
      title: "The goal and objectives, in full",
      where: "Home · This quarter",
      does: "He taps This quarter. The goal and the objectives are already there, agreed at head office, with a button through to his site.",
      view: (
        <Frame label="Our focus this quarter">
          <MockCard title="Goal">
            <p>Be the safest, lowest cost 2 Mt a year underground mine in the region by 2029.</p>
          </MockCard>
          <MockCard title="Objectives">
            <p>O1 · Zero serious incidents</p>
            <p>O2 · 90% fleet availability</p>
            <p>O3 · 12% lower cost per tonne</p>
          </MockCard>
          <MockTap>Open Strategy</MockTap>
        </Frame>
      ),
    },
    {
      title: "His site, and the gap",
      where: "Site · Kestrel Underground",
      does: "The chain is waiting: the goal, the objectives and the strategies are in place. Under Strategy there is nothing yet, and that is his work.",
      view: (
        <Frame label="Kestrel Underground">
          <MockCard title="The chain">
            <p>Goal ✓</p>
            <p>O2 · 90% fleet availability ✓</p>
            <MockPill>S2</MockPill>
            <p className="ml-1 inline text-gold">No tactic yet</p>
          </MockCard>
          <MockCard title="Tactics" note="0 of 6">
            <p className="text-muted-foreground">No tactics yet.</p>
          </MockCard>
          <MockTap>Add tactic</MockTap>
        </Frame>
      ),
    },
    {
      title: "The instruction card, with an example",
      where: "Site · Tactics",
      does: "The card says what a tactic has to contain and shows a worked example, so he is not guessing at the standard.",
      view: (
        <Frame label="What a tactic must have">
          <MockCard gold title="A tactic is what we do here">
            <p>The approach, the strategy it delivers, an owner, a 90-day review and the trigger that says it is not working.</p>
          </MockCard>
          <MockCard title="Example of an effective tactic">
            <p>Pair each loader with a dedicated crew and a ten minute handover at the face.</p>
            <p className="text-muted-foreground">Delivers S2 · owner: shift superintendent · review 12 Feb</p>
            <p className="text-muted-foreground">Not working if availability is under 85% two months running.</p>
          </MockCard>
        </Frame>
      ),
    },
    {
      title: "The tool arrives pre-filled",
      where: "Site · Add tactic",
      does: "He does not retype the strategy. The dropdown holds the agreed strategies, so his tactic is tied to the chain by choosing one.",
      view: (
        <Frame label="Add tactic">
          <MockCard title="T1">
            <MockField value="Pair each loader with a dedicated crew and a ten minute handover at the face." />
            <MockField label="Delivers strategy" value="S2 · Single fleet loaders" />
            <MockField label="Owner" value="Mike · project manager" />
            <MockField label="90-day review" value="12 Feb" />
            <MockField label="Not working if" value="Availability under 85% two months running" />
          </MockCard>
          <MockTap>Save tactic</MockTap>
        </Frame>
      ),
    },
    {
      title: "Plans: who, what, where, when",
      where: "Site · Plans",
      does: "Each plan says how the tactic is actually done, in his words, with a person, a place and a time attached to it.",
      view: (
        <Frame label="Plans">
          <MockCard title="Example of an effective plan">
            <p>What: handover checklist at the face</p>
            <p>Who: shift supervisor</p>
            <p>Where: 4 North face</p>
            <p>When: every shift from 1 Dec</p>
            <p className="text-muted-foreground">Delivers T1</p>
          </MockCard>
          <MockTap>Add plan</MockTap>
        </Frame>
      ),
    },
    {
      title: "Actions: a name and a date",
      where: "Site · Actions",
      does: "The last row is the smallest. One line, one person, one date, and a tick when it is done.",
      view: (
        <Frame label="Actions">
          <MockCard title="Example of an effective action">
            <p>Print the checklist to the loader cab and brief the crew · Mike · 28 Nov</p>
          </MockCard>
          <MockRow arrow>A2 · Brief the crew · Mike · 28 Nov</MockRow>
          <MockTap>Add action</MockTap>
        </Frame>
      ),
    },
    {
      title: "His meeting runs off his own data",
      where: "Meetings · Site ON the business",
      does: "The site ON the business agenda is his chain: the tactics, plans and actions he just wrote. The exercise is finished when they are all owned and dated.",
      view: (
        <Frame label="Site ON the business · 20 Nov">
          <MockCard title="Agenda">
            <p>1 · Are our people safe</p>
            <p>2 · Money, quality, people</p>
            <p>3 · T1 loader crews · availability 87% vs 90%</p>
            <p>4 · A2 overdue · re-date or close</p>
          </MockCard>
          <MockRow arrow>Open the site chain</MockRow>
        </Frame>
      ),
    },
    {
      title: "Progress shows where he stands",
      where: "Home · My programs",
      does: "Back on home the program has moved on, and head office can see the site has cascaded rather than assuming it.",
      view: (
        <Frame label="My programs">
          <MockCard title="Managing Strategy">
            <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
              <div className="h-full w-[68%] rounded-full bg-gold" />
            </div>
            <p className="mt-1 text-muted-foreground">68% · tactics, plans and actions in place</p>
          </MockCard>
          <MockRow arrow>Kestrel Underground · chain complete</MockRow>
        </Frame>
      ),
    },
  ],
};