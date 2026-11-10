import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CalendarDays, ChevronRight, FileBarChart, GraduationCap, ShieldCheck, UserPlus, Users, X } from "lucide-react";
import { TestDataBadge } from "@/components/TestDataBadge";
import { labSessions } from "@/lib/homeTestData";

// TEST DATA ONLY.
const customers = [
  { name: "Test Mining Co", sites: ["North Pit (test)", "South Pit (test)"], status: "Deploying" },
  { name: "Sample Resources (test)", sites: ["East Mine (test)"], status: "Setting up" },
];
const people = [
  { name: "John Carter (test)", job: "Superintendent", site: "North Pit (test)", invite: "Active" },
  { name: "Mia Ross (test)", job: "Supervisor", site: "North Pit (test)", invite: "Active" },
  { name: "Liam Hart (test)", job: "Supervisor", site: "South Pit (test)", invite: "Invite sent" },
  { name: "Ava Chen (test)", job: "Site Project Manager", site: "South Pit (test)", invite: "Active" },
  { name: "Noah Reid (test)", job: "Superintendent", site: "East Mine (test)", invite: "Not invited" },
];
const progress = [
  { site: "North Pit (test)", program: "Superintendent program", week: 6, weeks: 13, pct: 46 },
  { site: "South Pit (test)", program: "Superintendent program", week: 3, weeks: 13, pct: 21 },
  { site: "East Mine (test)", program: "Managing Strategy", week: 1, weeks: 8, pct: 5 },
];
const nice = (s) => new Date(`${s}T00:00:00`).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });

export const Route = createFileRoute("/_authed/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Sam — Admin" }] }),
});

function Tile({ title, icon: Icon, onOpen, children, className = "" }) {
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

function Admin() {
  const { user } = Route.useRouteContext();
  if (user?.role !== "admin") {
    return <p className="rounded-2xl bg-card p-4 text-[15px]">This page is for administrators. <Link to="/" className="text-gold underline">Back home</Link></p>;
  }
  return <AdminDashboard />;
}

export function AdminDashboard() {
  const [open, setOpen] = useState(null);
  const [staff, setStaff] = useState(people);
  const invited = staff.filter((p) => p.invite !== "Active").length;
  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-card p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] text-gold">Administrator</p>
            <h1 className="font-heading text-[26px] font-semibold leading-tight">Admin dashboard</h1>
            <p className="text-[14px]">Customers, sites, people, Labs and program progress.</p>
          </div>
          <TestDataBadge />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {[[customers.length, "Customers"], [customers.reduce((n, c) => n + c.sites.length, 0), "Sites"], [staff.length, "People"], [labSessions.length, "Lab dates"]].map(([n, l]) => (
            <div key={l} className="rounded-xl bg-background/40 p-2"><p className="text-[22px] font-semibold">{n}</p><p className="text-[13px] text-muted-foreground">{l}</p></div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Tile title="Customers and sites" icon={Building2} onOpen={() => setOpen("customers")}>
          {customers.map((c) => <span key={c.name} className="mb-1 block truncate"><b>{c.name}</b> · {c.sites.length} sites</span>)}
        </Tile>
        <Tile title="People and invites" icon={Users} onOpen={() => setOpen("people")}>
          <span className="block">{staff.length} people</span>
          <span className="block text-gold">{invited} still to accept or invite</span>
        </Tile>
        <Tile title="Validation Labs" icon={CalendarDays} onOpen={() => setOpen("labs")}>
          {labSessions.map((l) => <span key={l.id} className="block truncate">{nice(l.date)} · {l.seats} seats left</span>)}
        </Tile>
        <Tile title="Program progress by site" icon={GraduationCap} onOpen={() => setOpen("progress")} className="col-span-2 md:col-span-2">
          {progress.map((p) => (
            <span key={p.site} className="mb-1.5 block">
              <span className="flex justify-between"><span className="truncate">{p.site}</span><span>{p.pct}%</span></span>
              <span className="mt-0.5 block h-1.5 overflow-hidden rounded-full bg-background/60"><span className="block h-full rounded-full bg-gold" style={{ width: `${p.pct}%` }} /></span>
            </span>
          ))}
        </Tile>
        <Tile title="Security" icon={ShieldCheck} onOpen={() => setOpen("security")}>
          <span className="block">Two-step sign-in: on for all</span>
          <span className="block">Data: test only</span>
        </Tile>
        <Tile title="Add a person" icon={UserPlus} onOpen={() => setOpen("add")}>
          <span className="block">Name, job, site, program. Then invite.</span>
        </Tile>
        <Tile title="Completion reports" icon={FileBarChart} onOpen={() => setOpen("report")} className="md:col-span-2">
          <span className="block">Who has finished each step, by program and site.</span>
        </Tile>
      </div>

      {open === "customers" && (
        <Sheet title="Customers and sites" onClose={() => setOpen(null)}>
          <ul className="space-y-2">{customers.map((c) => (
            <li key={c.name} className="rounded-xl bg-card p-3"><p className="font-semibold">{c.name} · <span className="text-gold">{c.status}</span></p><p className="text-[15px]">{c.sites.join(" · ")}</p></li>
          ))}</ul>
          <button className="mt-3 min-h-[48px] w-full rounded-xl bg-gold font-semibold text-gold-foreground" disabled>Add a customer (coming next)</button>
        </Sheet>
      )}
      {open === "people" && (
        <Sheet title="People and invites" onClose={() => setOpen(null)}>
          <ul className="space-y-2">{staff.map((p) => (
            <li key={p.name} className="flex items-center justify-between gap-2 rounded-xl bg-card p-3 text-[15px]">
              <span><b>{p.name}</b><br />{p.job} · {p.site}</span>
              <span className={p.invite === "Active" ? "" : "text-gold"}>{p.invite}</span>
            </li>
          ))}</ul>
          <button onClick={() => setOpen("add")} className="mt-3 min-h-[48px] w-full rounded-xl bg-gold font-semibold text-gold-foreground">Add a person</button>
        </Sheet>
      )}
      {open === "labs" && (
        <Sheet title="Validation Labs" onClose={() => setOpen(null)}>
          <ul className="space-y-2">{labSessions.map((l) => (
            <li key={l.id} className="rounded-xl bg-card p-3 text-[15px]"><b>{nice(l.date)}</b> · {l.place} · {l.seats} seats left</li>
          ))}</ul>
        </Sheet>
      )}
      {open === "progress" && (
        <Sheet title="Program progress by site" onClose={() => setOpen(null)}>
          <ul className="space-y-2">{progress.map((p) => (
            <li key={p.site} className="rounded-xl bg-card p-3 text-[15px]"><b>{p.site}</b> · {p.program}<br />Week {p.week} of {p.weeks} · {p.pct}% done</li>
          ))}</ul>
          <p className="mt-2 text-[13px] text-muted-foreground">Site level only. Nobody is ranked or named here.</p>
        </Sheet>
      )}
      {open === "security" && (
        <Sheet title="Security" onClose={() => setOpen(null)}>
          <ul className="list-disc space-y-1 pl-5 text-[15px]">
            <li>Two-step sign-in (MFA) required for everyone.</li>
            <li>Sign-up is hidden; access is by invite.</li>
            <li>Test data only. No real people or mine data.</li>
          </ul>
        </Sheet>
      )}
      {open === "add" && (
        <Sheet title="Add a person" onClose={() => setOpen(null)}>
          <AddPersonForm onAdd={(p) => { setStaff((x) => [...x, p]); setOpen("people"); }} />
        </Sheet>
      )}
      {open === "report" && (
        <Sheet title="Completion report" onClose={() => setOpen(null)}>
          <CompletionReport />
        </Sheet>
      )}
    </div>
  );
}


const STEPS = ["Workbook", "Lab", "Apply", "Validation Lab", "Verify"];
const report = [
  { person: "John Carter (test)", site: "North Pit (test)", done: 2 },
  { person: "Mia Ross (test)", site: "North Pit (test)", done: 1 },
  { person: "Liam Hart (test)", site: "South Pit (test)", done: 0 },
  { person: "Ava Chen (test)", site: "South Pit (test)", done: 3 },
];

function CompletionReport() {
  const csv = () => {
    const rows = [["Person", "Site", ...STEPS], ...report.map((r) => [r.person, r.site, ...STEPS.map((_, i) => (i < r.done ? "Done" : ""))])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "completion-report-test.csv";
    a.click();
  };
  return (
    <div>
      <p className="mb-2 text-[15px]">Superintendent program · Test Mining Co</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead><tr><th className="p-2">Person</th><th className="p-2">Site</th>{STEPS.map((s) => <th key={s} className="p-2 text-center">{s}</th>)}</tr></thead>
          <tbody>{report.map((r) => (
            <tr key={r.person} className="border-t border-border">
              <td className="p-2 font-medium">{r.person}</td><td className="p-2">{r.site}</td>
              {STEPS.map((s, i) => <td key={s} className="p-2 text-center">{i < r.done ? <span className="text-gold">✔</span> : "·"}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">For the program admin only. Never shown on a group screen.</p>
      <button onClick={csv} className="mt-3 min-h-[48px] w-full rounded-xl bg-gold font-semibold text-gold-foreground">Download report (CSV)</button>
    </div>
  );
}

function AddPersonForm({ onAdd }) {
  const f = "mt-1 h-12 w-full rounded-xl border border-border bg-card px-3 text-[15px] text-foreground";
  const [name, setName] = useState("");
  const [job, setJob] = useState("Supervisor");
  const [site, setSite] = useState("North Pit (test)");
  const [program, setProgram] = useState("Superintendent program");
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!name) return; onAdd({ name, job, site, program, invite: "Invite ready" }); }}>
      <label className="block text-[15px]">Name<input className={f} value={name} onChange={(e) => setName(e.target.value)} required /></label>
      <label className="block text-[15px]">Job<select className={f} value={job} onChange={(e) => setJob(e.target.value)}>{["Supervisor", "Superintendent", "Operations Manager", "Site Project Manager"].map((j) => <option key={j}>{j}</option>)}</select></label>
      <label className="block text-[15px]">Site<select className={f} value={site} onChange={(e) => setSite(e.target.value)}>{["North Pit (test)", "South Pit (test)"].map((j) => <option key={j}>{j}</option>)}</select></label>
      <label className="block text-[15px]">Program<select className={f} value={program} onChange={(e) => setProgram(e.target.value)}>{["Superintendent program", "Supervisor program", "Managing Strategy"].map((j) => <option key={j}>{j}</option>)}</select></label>
      <button className="min-h-[48px] w-full rounded-xl bg-gold font-semibold text-gold-foreground">Add and enrol</button>
      <p className="text-[13px] text-muted-foreground">Test version: no invite is sent and nothing is saved yet.</p>
    </form>
  );
}
