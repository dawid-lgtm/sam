import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, GraduationCap, LayoutGrid, ShieldCheck, Target, TrendingUp, X } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { AccessSetup } from "@/components/home/AccessSetup";
import { HomeCalendar } from "@/components/home/HomeCalendar";
import { FourBlocks } from "@/components/home/FourBlocks";
import { SuperAdmin } from "@/components/super/SuperAdmin";
import { person, programs, sitePerformance, safetyFocus, keyDates } from "@/lib/homeTestData";

const HERO = "https://media.base44.com/images/public/6af15b436d05108c2128035d/0dc42b8b1_sam-hero.jpg";

export const Route = createFileRoute("/_authed/")({
  component: Home,
  head: () => ({ meta: [{ title: "Sam — Home" }] }),
});

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const shortDate = (s) => new Date(`${s}T00:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "short" });

// A small card on Home. Tap to open the full view.
function HomeCard({ title, icon: Icon, onOpen, children, className = "" }) {
  return (
    <button onClick={onOpen} className={`flex flex-col rounded-2xl bg-card p-3 text-left transition hover:ring-2 hover:ring-gold ${className}`}>
      <span className="mb-2 flex w-full items-center gap-1.5">
        <Icon className="h-4 w-4 text-gold" />
        <span className="font-heading text-[16px] font-semibold">{title}</span>
        <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
      </span>
      <span className="block w-full text-[14px] leading-snug">{children}</span>
    </button>
  );
}

function Sheet({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-background p-4 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-heading text-[22px] font-semibold">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-card"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Home() {
  const { user } = Route.useRouteContext();
  const { data } = useSamData();
  const now = useNow();
  const [open, setOpen] = useState(null);
  const hour = now.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const strategies = data?.strategies || [];
  const tactics = data?.tactics || [];
  const todayIso = now.toISOString().slice(0, 10);
  const upcoming = keyDates.filter((k) => k.date >= todayIso).slice(0, 3);
  const myName = user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";

  // The super admin lands on the master admin page: every customer and every program.
  if (user?.role === "admin") {
    return (
      <div className="space-y-3">
        <section className="rounded-2xl bg-gold p-3">
          <p className="text-[15px] font-medium text-gold-foreground">
            Signed in as {user.full_name || user.email} · super admin
          </p>
        </section>
        <SuperAdmin />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data && !user?.access ? <AccessSetup user={user} sites={data.sites} /> : null}

      {/* Welcome strip */}
      <section
        className="rounded-2xl bg-card bg-cover bg-center p-4"
        style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card) / 0.9) 50%, hsl(var(--card) / 0.4) 100%), url('${HERO}')` }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] text-gold">{hello}</p>
            <h1 className="font-heading text-[26px] font-semibold leading-tight">Welcome{myName ? `, ${myName}` : ""}</h1>
            <p className="text-[14px]">
              {now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })} ·{" "}
              {now.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[14px]">
          <b>{person.role}</b> · {person.site} · {person.crew} · {person.shift} · {person.roster} · Reports to {person.reports_to}
        </p>
      </section>

      {/* Cards: 2 across on phone, 3 across on tablet */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <HomeCard title="My programs" icon={GraduationCap} onOpen={() => setOpen("programs")}>
          {programs.map((p) => {
            const pct = Math.round((p.done / p.total) * 100);
            return (
              <span key={p.id} className="mb-2 block">
                <span className="block truncate font-medium">{p.name}</span>
                <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                  <span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                </span>
                <span className="text-[13px] text-muted-foreground">{pct}% · week {p.week} of {p.weeks}</span>
              </span>
            );
          })}
        </HomeCard>

        <HomeCard title="Key dates" icon={CalendarDays} onOpen={() => setOpen("dates")}>
          {upcoming.map((k) => (
            <span key={k.date} className="mb-1 flex gap-2">
              <span className="w-12 shrink-0 font-semibold text-gold">{shortDate(k.date)}</span>
              <span className="truncate">{k.title}</span>
            </span>
          ))}
          <span className="mt-1 block text-[13px] text-muted-foreground">Tap to book a Validation Lab</span>
        </HomeCard>

        <HomeCard title="Site this week" icon={TrendingUp} onOpen={() => setOpen("site")}>
          {sitePerformance.slice(0, 3).map((s) => (
            <span key={s.label} className="mb-1 flex justify-between gap-2">
              <span className="truncate">{s.label.replace(" (week)", "")}</span>
              <span className="font-semibold">{s.value}</span>
            </span>
          ))}
        </HomeCard>

        <HomeCard title="Safety focus" icon={ShieldCheck} onOpen={() => setOpen("safety")}>
          {safetyFocus.map((s) => (
            <span key={s.title} className="mb-0.5 block truncate">• {s.title}</span>
          ))}
        </HomeCard>

        <HomeCard title="This quarter" icon={Target} onOpen={() => setOpen("quarter")} className="md:col-span-2">
          {data?.company?.goal_sentence ? <span className="mb-1 block font-medium">{data.company.goal_sentence}</span> : null}
          <span className="block text-[13px] text-muted-foreground">
            {strategies.length} strategies · {tactics.length} site tactics
          </span>
          {strategies.slice(0, 2).map((s) => (
            <span key={s.id} className="block truncate">{s.code} {s.statement}</span>
          ))}
        </HomeCard>

        <HomeCard title="Your day in four blocks" icon={LayoutGrid} onOpen={() => setOpen("blocks")} className="col-span-2 md:col-span-3">
          <FourBlocks role={person.role} now={now} compact />
        </HomeCard>
      </div>

      {open === "programs" && (
        <Sheet title="My programs" onClose={() => setOpen(null)}>
          <ul className="space-y-2">
            {programs.map((p) => {
              const pct = Math.round((p.done / p.total) * 100);
              return (
                <li key={p.id}>
                  <Link to="/program/$programId" params={{ programId: p.id }} className="block rounded-xl bg-card p-3">
                    <span className="flex justify-between font-semibold">{p.name} <ChevronRight className="h-5 w-5" /></span>
                    <span className="mt-2 block h-2 overflow-hidden rounded-full bg-background/60"><span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} /></span>
                    <span className="mt-1 block text-[14px]">Week {p.week} of {p.weeks} · {pct}% · Next: {p.next_step}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Sheet>
      )}
      {open === "dates" && (
        <Sheet title="Key dates" onClose={() => setOpen(null)}>
          <HomeCalendar />
        </Sheet>
      )}
      {open === "site" && (
        <Sheet title={`${person.site} this week`} onClose={() => setOpen(null)}>
          <ul className="grid grid-cols-2 gap-2">
            {sitePerformance.map((s) => (
              <li key={s.label} className="rounded-xl bg-card p-3">
                <p className="text-[13px] text-muted-foreground">{s.label}</p>
                <p className="text-[20px] font-semibold">{s.value}</p>
                <p className="text-[13px] text-muted-foreground">Target {s.target}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[13px] text-muted-foreground">From the site's data reporting systems.</p>
        </Sheet>
      )}
      {open === "safety" && (
        <Sheet title="Safety focus" onClose={() => setOpen(null)}>
          <ul className="space-y-2">
            {safetyFocus.map((s) => (
              <li key={s.title} className="rounded-xl bg-card p-3"><p className="font-semibold">{s.title}</p><p className="text-[15px]">{s.detail}</p></li>
            ))}
          </ul>
        </Sheet>
      )}
      {open === "quarter" && (
        <Sheet title="Our focus this quarter" onClose={() => setOpen(null)}>
          {data?.company?.goal_sentence ? <p className="mb-2 rounded-xl bg-card p-3"><b>Goal:</b> {data.company.goal_sentence}</p> : null}
          <p className="mb-1 text-[13px] text-muted-foreground">Business strategies</p>
          <ul className="space-y-2">{strategies.map((s) => <li key={s.id} className="rounded-xl bg-card p-3 text-[15px]"><b>{s.code}</b> {s.statement}</li>)}</ul>
          <p className="mb-1 mt-3 text-[13px] text-muted-foreground">Site tactics</p>
          <ul className="space-y-2">{tactics.map((t) => <li key={t.id} className="rounded-xl bg-card p-3 text-[15px]"><b>{t.code}</b> {t.approach}</li>)}</ul>
          <Link to="/strategy" className="mt-3 block rounded-xl bg-gold p-3 text-center font-semibold text-gold-foreground">Open Strategy</Link>
        </Sheet>
      )}
      {open === "blocks" && (
        <Sheet title="Your day in four blocks" onClose={() => setOpen(null)}>
          <FourBlocks role={person.role} now={now} />
        </Sheet>
      )}
    </div>
  );
}