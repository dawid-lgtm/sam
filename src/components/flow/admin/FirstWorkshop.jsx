import { useState } from "react";
import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

const PEOPLE = [
  { name: "Sarah Bell", role: "CEO" },
  { name: "Elle Wong", role: "CFO" },
  { name: "Dave Kerr", role: "COO" },
  { name: "Priya Nair", role: "GM Ops" },
  { name: "Mike Tau", role: "program manager" },
];

// First card of Step 2: he either ticks the workshop as held, or dates it and picks the invitees.
export function FirstWorkshop() {
  const [held, setHeld] = useState(false);
  const [invited, setInvited] = useState(PEOPLE.map((p) => p.name));

  const togglePerson = (name) =>
    setInvited((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]));

  return (
    <Frame label="Launch the program · the first workshop">
      <MockCard title="What this workshop is for" note="Half a day · in the room or online">
        <p>
          Agreeing the single three-year Goal, and the objectives that carry it, in your words, with the people who
          own the work.
        </p>
        <p className="text-muted-foreground">
          In the room: the CEO, the CFO, the COO, the GM Ops, your program managers and each site lead.
        </p>
      </MockCard>

      <p className="px-0.5 text-[12px] leading-snug">If this workshop has already been held, tick the box.</p>

      <button
        type="button"
        onClick={() => setHeld((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg bg-background/40 px-2.5 py-2 text-left text-[13px] font-semibold"
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[11px] ${
            held ? "border-gold bg-gold text-gold-foreground" : "border-foreground/50 bg-background/60"
          }`}
        >
          {held ? "✓" : ""}
        </span>
        <span>This workshop has been completed</span>
      </button>

      <p className="px-0.5 text-[12px] leading-snug">
        Ticking it means you will be required to add the approved Goal and Objectives before you can continue. If it
        has not been held yet, leave it empty, schedule the workshop below and save who is invited.
      </p>

      {held ? (
        <MockCard gold title="No invite goes out for this workshop" note="It has already been held">
          <p>All invites will now be sent as part of the Step 2 meeting set up.</p>
        </MockCard>
      ) : null}

      <div className={held ? "pointer-events-none space-y-2 opacity-40" : "space-y-2"}>
        <MockCard title="Schedule the workshop" note="Step 1 of the launch">
          <MockField label="Workshop date and time" value="Tue 18 Nov · 8:00 am to 12:00 pm" />
          <MockRow arrow>Pick another date</MockRow>
        </MockCard>

        <MockCard
          title="Who gets the invite"
          note={`${invited.length} of ${PEOPLE.length} ticked · from the people you loaded`}
        >
          {PEOPLE.map((person) => {
            const on = invited.includes(person.name);
            return (
              <button
                key={person.name}
                type="button"
                onClick={() => togglePerson(person.name)}
                className="flex w-full items-center gap-2 rounded-lg bg-background/40 px-2 py-1.5 text-left text-[13px]"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[11px] ${
                    on ? "border-gold bg-gold text-gold-foreground" : "border-foreground/50 bg-background/60"
                  }`}
                >
                  {on ? "✓" : ""}
                </span>
                <span className="min-w-0">
                  {person.name} · {person.role}
                </span>
              </button>
            );
          })}
          <MockRow arrow>Add a new person</MockRow>
        </MockCard>

        <MockTap>Save</MockTap>

        <MockTap quiet>See the email they will get</MockTap>

        <MockCard title="The email · you can change the words" note="Sent from the program, in your name">
          <MockField label="Subject" value="You have been enrolled · Managing Strategy program" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Message</p>
            <div className="space-y-1.5 rounded-lg bg-background/60 px-2 py-1.5 text-[12px] leading-snug">
              <p>
                Welcome{" "}
                <span className="rounded bg-gold px-1 text-[11px] font-semibold text-gold-foreground">
                  each person's name
                </span>
                ,
              </p>
              <p>
                You have been enrolled in the Decision Architecture Managing Strategy program. This program is designed
                to structure how the business manages its core strategies, from head office to the front line.
              </p>
              <p>
                The first meeting to kick off the program is scheduled for{" "}
                <span className="rounded bg-gold px-1 text-[11px] font-semibold text-gold-foreground">
                  the date above
                </span>
                . We look forward to seeing you there.
              </p>
            </div>
            <p className="text-[11px] leading-snug text-muted-foreground">
              The gold fields fill in on their own for every person you tick above: their own name, and the workshop
              date. The same list rolls into the invite for the second meeting.
            </p>
          </div>
          <MockRow arrow>Edit the email text</MockRow>
        </MockCard>
      </div>
    </Frame>
  );
}