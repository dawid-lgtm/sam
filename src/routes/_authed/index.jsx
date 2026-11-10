import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { AccessSetup } from "@/components/home/AccessSetup";
import { HomeCalendar } from "@/components/home/HomeCalendar";
import { TestDataBadge } from "@/components/TestDataBadge";
import { person, programs, sitePerformance, safetyFocus } from "@/lib/homeTestData";

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

function Card({ title, icon: Icon, children, action }) {
  return (
    <section className="mt-3 rounded-2xl bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-heading text-[20px] font-semibold text-foreground">
          {Icon ? <Icon className="h-5 w-5 text-gold" /> : null}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Home() {
  const { user } = Route.useRouteContext();
  const { data } = useSamData();
  const now = useNow();
  const hour = now.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const strategies = (data?.strategies || []).slice(0, 3);
  const tactics = (data?.tactics || []).slice(0, 3);

  return (
    <div>
      {data && !user?.access ? <AccessSetup user={user} sites={data.sites} /> : null}

      {/* Welcome and details */}
      <section className="rounded-2xl bg-card p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[15px] text-gold">{hello}</p>
          <TestDataBadge />
        </div>
        <h1 className="mt-1 font-heading text-[30px] font-semibold leading-tight">Welcome, {person.first_name}</h1>
        <p className="mt-1 text-[15px]">
          {now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} ·{" "}
          {now.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[15px]">
          {[
            ["Role", person.role],
            ["Site", person.site],
            ["Crew", person.crew],
            ["Shift", person.shift],
            ["Roster", person.roster],
            ["Reports to", person.reports_to],
            ["Your team", person.team],
            ["Company", person.company],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[13px] text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Programs */}
      <Card title="My programs">
        <ul className="space-y-3">
          {programs.map((p) => {
            const pct = Math.round((p.done / p.total) * 100);
            return (
              <li key={p.id}>
                <Link
                  to="/program/$programId"
                  params={{ programId: p.id }}
                  className="block rounded-xl bg-background/40 p-4 transition hover:bg-background/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[16px] font-semibold">{p.name}</p>
                      <p className="text-[13px] text-muted-foreground">Week {p.week} of {p.weeks} · {pct}% done</p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0" />
                  </div>
                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-background/60">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-[15px]">Next: {p.next_step}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Calendar */}
      <HomeCalendar />

      {/* Site performance (site level only, nobody named) */}
      <Card title={`${person.site} this week`} icon={TrendingUp}>
        <ul className="grid grid-cols-2 gap-3">
          {sitePerformance.map((s) => (
            <li key={s.label} className="rounded-xl bg-background/40 p-3">
              <p className="text-[13px] text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-[22px] font-semibold">{s.value}</p>
              <p className="text-[13px] text-muted-foreground">Target {s.target}</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background/60">
                <div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(s.pct, 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[13px] text-muted-foreground">From the site's data reporting systems (test numbers).</p>
      </Card>

      {/* Safety */}
      <Card title="Safety focus" icon={ShieldCheck}>
        <ul className="space-y-2">
          {safetyFocus.map((s) => (
            <li key={s.title} className="rounded-xl bg-background/40 p-3">
              <p className="text-[15px] font-semibold">{s.title}</p>
              <p className="text-[15px] text-foreground/90">{s.detail}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Strategy this quarter */}
      <Card
        title="Our focus this quarter"
        icon={Target}
        action={<Link to="/strategy" className="flex min-h-[44px] items-center text-[15px] font-medium text-gold">All <ChevronRight className="h-4 w-4" /></Link>}
      >
        {data?.company?.goal_sentence ? (
          <p className="mb-3 rounded-xl bg-background/40 p-3 text-[15px]"><span className="font-semibold">Goal: </span>{data.company.goal_sentence}</p>
        ) : null}
        <p className="mb-2 text-[13px] text-muted-foreground">Business strategies</p>
        <ul className="space-y-2">
          {strategies.map((s) => (
            <li key={s.id} className="rounded-xl bg-background/40 p-3 text-[15px]"><b>{s.code}</b> {s.statement}</li>
          ))}
        </ul>
        <p className="mb-2 mt-4 text-[13px] text-muted-foreground">Site tactics</p>
        <ul className="space-y-2">
          {tactics.map((t) => (
            <li key={t.id} className="rounded-xl bg-background/40 p-3 text-[15px]"><b>{t.code}</b> {t.approach}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
