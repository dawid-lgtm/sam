import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { programs } from "@/lib/homeTestData";
import { TestDataBadge } from "@/components/TestDataBadge";

export const Route = createFileRoute("/_authed/program/$programId")({
  component: Program,
  head: () => ({ meta: [{ title: "Sam — Program" }] }),
});

function Program() {
  const { programId } = Route.useParams();
  const p = programs.find((x) => x.id === programId);
  if (!p) return <p className="text-[15px]">Program not found. <Link to="/" className="underline">Back home</Link></p>;
  const pct = Math.round((p.done / p.total) * 100);
  return (
    <div>
      <Link to="/" className="mb-3 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium"><ArrowLeft className="h-5 w-5" /> Home</Link>
      <section className="rounded-2xl bg-card p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[15px] text-gold">{p.level}</p>
          <TestDataBadge />
        </div>
        <h1 className="mt-1 font-heading text-[26px] font-semibold">{p.name}</h1>
        <p className="mt-2 text-[15px]">Week {p.week} of {p.weeks} · {p.done} of {p.total} steps done</p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-background/50">
          <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
        </div>
      </section>
      <section className="mt-3 rounded-2xl bg-card p-5">
        <h2 className="mb-3 font-heading text-[20px] font-semibold">Your steps</h2>
        <ul className="space-y-2">
          {p.steps.map((s, i) => {
            const Icon = s.status === "done" ? CheckCircle2 : s.status === "next" ? PlayCircle : Circle;
            return (
              <li key={i} className={`flex items-center gap-3 rounded-xl p-3 ${s.status === "next" ? "bg-gold text-gold-foreground" : "bg-background/40"}`}>
                <Icon className="h-6 w-6 shrink-0" />
                <span className="text-[15px] font-medium">{s.title}</span>
                <span className="ml-auto text-[13px]">{s.status === "done" ? "Done" : s.status === "next" ? "Up next" : ""}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
