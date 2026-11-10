import { useState } from "react";

// Superintendent's day, from the Mine in a box knowledge base (superintendents-day.md). Day shift times.
const blocks = [
  { n: 1, from: 5, label: "05:00", title: "Start up", aim: "Observe, then the checks",
    items: ["Handover and pre-start observed", "Office checks: people, plan, contingencies", "Drive-around with each supervisor from 09:00"] },
  { n: 2, from: 10, label: "10:00", title: "The meetings", aim: "Fixes back to the pit before the shift is lost",
    items: ["Daily Department Review 10:00", "Daily Site Review 10:30", "Check-in with each supervisor 11:30"] },
  { n: 3, from: 12, label: "11:45", title: "People and plan", aim: "Work that outlives this swing",
    items: ["Two-week plan and the month", "Training and supervisor development", "Check-in with each supervisor 14:30"] },
  { n: 4, from: 14.75, label: "14:45", title: "Time in field", aim: "Inspect, verify, coach on the ground",
    items: ["Work area inspections", "Night shift set up", "Shift Debrief, then 17:00 handover"] },
];

function currentBlock(now) {
  const h = now.getHours() + now.getMinutes() / 60;
  if (h < 5 || h >= 17) return 0;
  return [...blocks].reverse().find((b) => h >= b.from).n;
}

export function FourBlocks({ role, now }) {
  const cur = currentBlock(now);
  const [open, setOpen] = useState(cur || 1);
  return (
    <section className="mt-3 rounded-2xl bg-card p-4 sm:p-5">
      <h2 className="font-heading text-[20px] font-semibold">Your day in four blocks</h2>
      <p className="mt-1 text-[15px] text-muted-foreground">{role} · day shift · {cur ? `now in Block ${cur}` : "off shift"}</p>

      {/* Phone: one row per block, tap to open */}
      <ul className="mt-3 space-y-2 md:hidden">
        {blocks.map((b) => {
          const isOpen = open === b.n;
          const isNow = cur === b.n;
          return (
            <li key={b.n}>
              <button
                onClick={() => setOpen(isOpen ? 0 : b.n)}
                className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl px-3 text-left ${isNow ? "bg-gold text-gold-foreground" : "bg-background/40"}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-current text-[15px] font-bold">{b.n}</span>
                <span className="text-[15px] font-semibold">{b.title}</span>
                <span className="ml-auto text-[13px]">{isNow ? "Now" : b.label}</span>
              </button>
              {isOpen ? (
                <div className="px-3 pb-1 pt-2">
                  <p className="text-[15px] italic">{b.aim}</p>
                  <ul className="mt-1 list-disc pl-5 text-[15px]">{b.items.map((i) => <li key={i}>{i}</li>)}</ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* Tablet and up: four columns */}
      <div className="mt-3 hidden grid-cols-4 gap-3 md:grid">
        {blocks.map((b) => {
          const isNow = cur === b.n;
          return (
            <div key={b.n} className={`rounded-xl p-3 ${isNow ? "bg-gold text-gold-foreground" : "bg-background/40"}`}>
              <p className="text-[13px]">Block {b.n} · {b.label}{isNow ? " · Now" : ""}</p>
              <p className="mt-1 text-[16px] font-semibold">{b.title}</p>
              <p className="mt-1 text-[14px] italic">{b.aim}</p>
              <ul className="mt-2 list-disc pl-4 text-[14px]">{b.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
