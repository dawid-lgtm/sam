import { useState } from "react";
import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

const PEOPLE = [
  { name: "Sarah Bell", role: "CEO" },
  { name: "Elle Wong", role: "CFO" },
  { name: "Dave Kerr", role: "COO" },
  { name: "Priya Nair", role: "GM Ops" },
  { name: "Mike Tau", role: "program manager" },
];

function Tick({ on, children }) {
  return (
    <span className="flex w-full items-center gap-2 rounded-lg bg-background/40 px-2.5 py-2 text-left text-[13px] font-semibold">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[11px] ${
          on ? "border-gold bg-gold text-gold-foreground" : "border-foreground/50 bg-background/60"
        }`}
      >
        {on ? "✓" : ""}
      </span>
      <span className="min-w-0">{children}</span>
    </span>
  );
}

// First card of Step 2. If the workshop has not been held, the people he ticks are invited the moment he
// saves it, once he has read the email. If it has already been held, nothing is sent from this card at all.
export function FirstWorkshop() {
  const [held, setHeld] = useState(false);
  const [invited, setInvited] = useState(PEOPLE.map((p) => p.name));
  const [checked, setChecked] = useState(false);

  const togglePerson = (name) =>
    setInvited((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]));

  const canSend = checked && invited.length > 0;

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

      <button type="button" onClick={() => setHeld((v) => !v)} className="w-full text-left">
        <Tick on={held}>This workshop has already been held</Tick>
      </button>

      <p className="px-0.5 text-[12px] leading-snug">
        Ticking it means you will be required to add the approved Goal and Objectives before you can continue. Leave it
        empty if the workshop has not happened yet.
      </p>

      {held ? (
        <MockCard gold title="No invite goes out from this card" note="Ticked: the workshop has already been held">
          <p>Nothing is sent to anyone here.</p>
          <p>
            The next invitation to the team is the second workshop: when you schedule that, the email invites them onto
            the platform with the completed Goal, Objectives and Strategies already inside it.
          </p>
        </MockCard>
      ) : (
        <div className="space-y-2">
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

          <MockCard title="The email they will get" note="Read it before anything is sent">
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
                  You have been enrolled in the Decision Architecture Managing Strategy program. This program is
                  designed to structure how the business manages its core strategies, from head office to the front
                  line.
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
                The gold fields fill in on their own for each person ticked above: their own name, and the workshop
                date.
              </p>
            </div>
            <MockRow arrow>Edit the email text</MockRow>
          </MockCard>

          <button type="button" onClick={() => setChecked((v) => !v)} className="w-full text-left">
            <Tick on={checked}>I have checked the email text</Tick>
          </button>

          <MockTap locked={!canSend}>
            {canSend ? `Save and invite ${invited.length}` : "Check the email text first"}
          </MockTap>

          <p className="px-0.5 text-[12px] leading-snug text-muted-foreground">
            Saving sends the invite to exactly the people ticked above, and puts the workshop in their Meetings. No
            email leaves before you tick that you have read it.
          </p>
        </div>
      )}
    </Frame>
  );
}