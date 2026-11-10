
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

export function FourBlocks({ role, now, compact = false }) {
  const cur = currentBlock(now);
  if (compact) {
    return (
      <span className="grid grid-cols-4 gap-2">
        {blocks.map((b) => (
          <span key={b.n} className={`block rounded-lg px-2 py-1.5 ${cur === b.n ? "bg-gold text-gold-foreground" : "bg-background/40"}`}>
            <span className="block text-[12px]">{b.n} · {cur === b.n ? "Now" : b.label}</span>
            <span className="block truncate text-[14px] font-semibold">{b.title}</span>
          </span>
        ))}
      </span>
    );
  }
  return (
    <div>
      <p className="text-[15px] text-muted-foreground">{role} · day shift · {cur ? `now in Block ${cur}` : "off shift"}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {blocks.map((b) => (
          <div key={b.n} className={`rounded-xl p-3 ${cur === b.n ? "bg-gold text-gold-foreground" : "bg-card"}`}>
            <p className="text-[13px]">Block {b.n} · {cur === b.n ? "Now" : b.label}</p>
            <p className="text-[16px] font-semibold">{b.title}</p>
            <p className="text-[14px] italic">{b.aim}</p>
            <ul className="mt-1 list-disc pl-5 text-[14px]">{b.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}
