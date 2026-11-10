import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { keyDates, labSessions } from "@/lib/homeTestData";

const KEY = "sam-test-lab-booking";
const pad = (n) => String(n).padStart(2, "0");
const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const nice = (s) =>
  new Date(`${s}T00:00:00`).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });

export function HomeCalendar() {
  const [month, setMonth] = useState(() => {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth() };
  });
  const [booked, setBooked] = useState(null);
  const [open, setOpen] = useState(null); // date string

  useEffect(() => {
    try { setBooked(localStorage.getItem(KEY)); } catch {}
  }, []);
  const book = (id) => {
    setBooked(id);
    try { id ? localStorage.setItem(KEY, id) : localStorage.removeItem(KEY); } catch {}
  };

  const events = useMemo(() => {
    const list = keyDates.map((k) => ({ ...k }));
    labSessions.forEach((l) =>
      list.push({ date: l.date, title: booked === l.id ? "Validation Lab (you're booked)" : "Validation Lab (open)", type: "lab", lab: l }),
    );
    return list;
  }, [booked]);

  const first = new Date(month.y, month.m, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday first
  const days = new Date(month.y, month.m + 1, 0).getDate();
  const today = new Date();
  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());
  const move = (d) => setMonth(({ y, m }) => { const n = new Date(y, m + d, 1); return { y: n.getFullYear(), m: n.getMonth() }; });

  const dayEvents = (d) => events.filter((e) => e.date === d);
  const bookedLab = labSessions.find((l) => l.id === booked);

  return (
    <section className="rounded-2xl bg-card p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-[18px] font-semibold text-foreground">Key dates</h2>
        <div className="flex items-center gap-1">
          <button aria-label="Previous month" onClick={() => move(-1)} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-background/40"><ChevronLeft className="h-5 w-5" /></button>
          <span className="min-w-[110px] text-center text-[15px] font-semibold">
            {first.toLocaleDateString("en-AU", { month: "long", year: "numeric" })}
          </span>
          <button aria-label="Next month" onClick={() => move(1)} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-background/40"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[13px] text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: startPad }).map((_, i) => <div key={`p${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const d = iso(month.y, month.m, i + 1);
          const ev = dayEvents(d);
          const lab = ev.some((e) => e.type === "lab");
          const mine = ev.some((e) => e.lab && e.lab.id === booked);
          const cls = mine
            ? "bg-gold text-gold-foreground font-bold"
            : lab
            ? "border-2 border-gold text-foreground font-semibold"
            : ev.length
            ? "bg-secondary text-foreground font-semibold"
            : "text-foreground/80";
          return (
            <button
              key={d}
              onClick={() => ev.length && setOpen(d)}
              disabled={!ev.length}
              className={`relative grid h-11 place-items-center rounded-lg text-[15px] ${cls} ${d === todayIso ? "ring-2 ring-white" : ""}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-secondary" /> Key date</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-gold" /> Validation Lab</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gold" /> Your Lab</span>
      </div>

      <div className="mt-3 rounded-xl bg-background/40 px-3 py-3 text-[15px]">
        {bookedLab ? (
          <>Your Validation Lab: <b>{nice(bookedLab.date)}</b>, {bookedLab.place}. Tap the date to change it.</>
        ) : (
          <>You're not booked into a Validation Lab yet. Tap a gold-edged date to enrol.</>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setOpen(null)}>
          <div className="w-full max-w-md rounded-t-2xl bg-card p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-heading text-[20px] font-semibold">{nice(open)}</h3>
              <button aria-label="Close" onClick={() => setOpen(null)} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-background/40"><X className="h-5 w-5" /></button>
            </div>
            <ul className="space-y-3">
              {dayEvents(open).map((e, i) => (
                <li key={i} className="rounded-xl bg-background/40 p-3">
                  <p className="text-[15px] font-semibold">{e.title}</p>
                  {e.lab ? (
                    <>
                      <p className="mt-1 text-[15px] text-muted-foreground">{e.lab.place} · {e.lab.seats} seats left</p>
                      {booked === e.lab.id ? (
                        <button onClick={() => book(null)} className="mt-3 min-h-[48px] w-full rounded-xl border-2 border-foreground text-[15px] font-semibold">Cancel my place</button>
                      ) : (
                        <button onClick={() => { book(e.lab.id); setOpen(null); }} className="mt-3 min-h-[48px] w-full rounded-xl bg-gold text-[15px] font-semibold text-gold-foreground">
                          {booked ? "Move my place to this date" : "Enrol on this date"}
                        </button>
                      )}
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}