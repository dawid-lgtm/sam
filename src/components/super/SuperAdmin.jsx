import { useState } from "react";
import { ArrowLeft, BookOpen, Building2, ChevronRight, ClipboardCheck, GraduationCap, Send, UserPlus, X } from "lucide-react";
import { companies as seedCompanies, masterPrograms, materials, enrolments } from "@/lib/superTestData";
import { Sandbox } from "@/components/super/Sandbox";

const btn = "min-h-[48px] w-full rounded-xl bg-gold px-4 font-semibold text-gold-foreground";
const field = "mt-1 h-12 w-full rounded-xl border border-border bg-card px-3 text-[15px] text-foreground";

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

export function SuperAdmin() {
  const [companies, setCompanies] = useState(seedCompanies);
  const [people, setPeople] = useState(enrolments);
  const [pushed, setPushed] = useState([]);
  const [program, setProgram] = useState(null);
  const [sheet, setSheet] = useState(null);

  if (program) {
    return <ProgramDetail p={program} people={people} pushed={pushed} onBack={() => setProgram(null)} onPush={(m, to) => setPushed((x) => [{ ...m, to, when: new Date().toLocaleString("en-AU") }, ...x])} companies={companies} />;
  }

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-card p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] text-gold">Super admin</p>
            <h1 className="font-heading text-[26px] font-semibold leading-tight">All customers and programs</h1>
            <p className="text-[14px]">Add companies and people. Open a program to see who is in it and push out material.</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {[[companies.length, "Companies"], [companies.reduce((n, c) => n + c.sites.length, 0), "Sites"], [new Set(people.map((p) => p.person)).size, "People"], [masterPrograms.length, "Programs"]].map(([n, l]) => (
            <div key={l} className="rounded-xl bg-background/40 p-2"><p className="text-[22px] font-semibold">{n}</p><p className="text-[13px] text-muted-foreground">{l}</p></div>
          ))}
        </div>
      </section>

      <Sandbox />

      <h2 className="px-1 font-heading text-[18px] font-semibold">Master programs</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {masterPrograms.map((p) => {
          const n = people.filter((e) => e.program === p.id).length;
          const cos = new Set(people.filter((e) => e.program === p.id).map((e) => e.company)).size;
          return (
            <Tile key={p.id} title={p.name} icon={GraduationCap} onOpen={() => setProgram(p)}>
              <span className="block">{n} enrolled · {cos} {cos === 1 ? "company" : "companies"}</span>
              <span className="block text-[13px] text-muted-foreground">{p.steps.length} steps · {materials.filter((m) => m.program === p.id).length} materials</span>
            </Tile>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Tile title="Companies" icon={Building2} onOpen={() => setSheet("companies")}>
          {companies.map((c) => <span key={c.id} className="block truncate"><b>{c.name}</b> · {c.sites.length} sites</span>)}
        </Tile>
        <Tile title="Add a company" icon={Building2} onOpen={() => setSheet("addCompany")}>
          <span className="block">New customer, its sites and its admin.</span>
        </Tile>
        <Tile title="Add a person" icon={UserPlus} onOpen={() => setSheet("addPerson")}>
          <span className="block">Enrol someone in a program.</span>
        </Tile>
      </div>

      {sheet === "companies" && (
        <Sheet title="Companies" onClose={() => setSheet(null)}>
          <ul className="space-y-2">{companies.map((c) => (
            <li key={c.id} className="rounded-xl bg-card p-3 text-[15px]">
              <p className="font-semibold">{c.name}</p>
              <p>Sites: {c.sites.join(", ")}</p>
              <p>Admin: {c.admin}</p>
              <p>Programs: {c.programs.map((id) => masterPrograms.find((m) => m.id === id)?.name).join(", ")}</p>
            </li>
          ))}</ul>
        </Sheet>
      )}
      {sheet === "addCompany" && (
        <Sheet title="Add a company" onClose={() => setSheet(null)}>
          <AddCompany onAdd={(c) => { setCompanies((x) => [...x, c]); setSheet("companies"); }} />
        </Sheet>
      )}
      {sheet === "addPerson" && (
        <Sheet title="Add a person" onClose={() => setSheet(null)}>
          <AddPerson companies={companies} onAdd={(p) => { setPeople((x) => [...x, p]); setSheet(null); }} />
        </Sheet>
      )}
    </div>
  );
}

function AddCompany({ onAdd }) {
  const [name, setName] = useState("");
  const [sites, setSites] = useState("");
  const [admin, setAdmin] = useState("");
  const [progs, setProgs] = useState([]);
  const toggle = (id) => setProgs((x) => (x.includes(id) ? x.filter((i) => i !== id) : [...x, id]));
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!name) return; onAdd({ id: `c${Date.now()}`, name, sites: sites.split(",").map((s) => s.trim()).filter(Boolean), admin, programs: progs }); }}>
      <label className="block text-[15px]">Company name<input className={field} value={name} onChange={(e) => setName(e.target.value)} required /></label>
      <label className="block text-[15px]">Sites (comma between)<input className={field} value={sites} onChange={(e) => setSites(e.target.value)} /></label>
      <label className="block text-[15px]">Their program admin<input className={field} value={admin} onChange={(e) => setAdmin(e.target.value)} /></label>
      <p className="text-[15px]">Programs they bought</p>
      <div className="grid grid-cols-2 gap-2">{masterPrograms.map((p) => (
        <button type="button" key={p.id} onClick={() => toggle(p.id)} className={`min-h-[48px] rounded-xl px-3 text-[15px] ${progs.includes(p.id) ? "bg-gold text-gold-foreground" : "bg-card"}`}>{p.name}</button>
      ))}</div>
      <button className={btn}>Add company</button>
      <p className="text-[13px] text-muted-foreground">Kept on this screen only, not saved yet.</p>
    </form>
  );
}

function AddPerson({ companies, onAdd }) {
  const [person, setPerson] = useState("");
  const [job, setJob] = useState("Supervisor");
  const [company, setCompany] = useState(companies[0]?.name || "");
  const co = companies.find((c) => c.name === company);
  const [site, setSite] = useState(co?.sites[0] || "");
  const [program, setProgram] = useState(masterPrograms[0].id);
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!person) return; onAdd({ person, job, company, site, program, step: 0 }); }}>
      <label className="block text-[15px]">Name<input className={field} value={person} onChange={(e) => setPerson(e.target.value)} required /></label>
      <label className="block text-[15px]">Job<select className={field} value={job} onChange={(e) => setJob(e.target.value)}>
        {["Supervisor", "Superintendent", "Operations Manager", "Site Project Manager"].map((j) => <option key={j}>{j}</option>)}</select></label>
      <label className="block text-[15px]">Company<select className={field} value={company} onChange={(e) => { setCompany(e.target.value); setSite(companies.find((c) => c.name === e.target.value)?.sites[0] || ""); }}>
        {companies.map((c) => <option key={c.id}>{c.name}</option>)}</select></label>
      <label className="block text-[15px]">Site<select className={field} value={site} onChange={(e) => setSite(e.target.value)}>
        {(co?.sites || []).map((s) => <option key={s}>{s}</option>)}</select></label>
      <label className="block text-[15px]">Program<select className={field} value={program} onChange={(e) => setProgram(e.target.value)}>
        {masterPrograms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <button className={btn}>Add and enrol</button>
      <p className="text-[13px] text-muted-foreground">Nothing is sent and nothing is saved yet.</p>
    </form>
  );
}

function ProgramDetail({ p, people, pushed, onBack, onPush, companies }) {
  const enrolled = people.filter((e) => e.program === p.id);
  const mats = materials.filter((m) => m.program === p.id);
  const [pushing, setPushing] = useState(null);
  const [to, setTo] = useState("All enrolled");
  const targets = ["All enrolled", ...companies.map((c) => c.name), ...companies.flatMap((c) => c.sites)];
  const icon = { Workbook: BookOpen, Handbook: BookOpen, Audit: ClipboardCheck };
  return (
    <div className="space-y-3">
      <button onClick={onBack} className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium"><ArrowLeft className="h-5 w-5" /> All programs</button>
      <section className="rounded-2xl bg-card p-4">
        <div className="flex items-start justify-between gap-2">
          <div><p className="text-[14px] text-gold">Master program</p><h1 className="font-heading text-[26px] font-semibold">{p.name}</h1></div>
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">Program sequence</p>
        <ol className="mt-1 flex flex-wrap gap-2">
          {p.steps.map((s, i) => <li key={s} className="rounded-lg bg-background/40 px-2.5 py-1.5 text-[14px]"><b>{i + 1}</b> {s}</li>)}
        </ol>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <section className="rounded-2xl bg-card p-3">
          <h2 className="mb-2 font-heading text-[18px] font-semibold">Who is enrolled ({enrolled.length})</h2>
          <ul className="space-y-1.5">{enrolled.map((e, i) => (
            <li key={i} className="rounded-xl bg-background/40 p-2.5 text-[14px]">
              <p className="font-semibold">{e.person} · {e.job}</p>
              <p>{e.company} · {e.site}</p>
              <p className="text-gold">Up to step {e.step + 1}: {p.steps[e.step]}</p>
            </li>
          ))}</ul>
        </section>
        <section className="rounded-2xl bg-card p-3">
          <h2 className="mb-2 font-heading text-[18px] font-semibold">Material to push out</h2>
          <ul className="space-y-1.5">{mats.map((m) => {
            const I = icon[m.type] || BookOpen;
            return (
              <li key={m.id} className="flex items-center gap-2 rounded-xl bg-background/40 p-2.5 text-[14px]">
                <I className="h-4 w-4 shrink-0 text-gold" /><span className="flex-1"><b>{m.type}</b> · {m.title}</span>
                <button onClick={() => setPushing(m)} className="inline-flex min-h-[40px] items-center gap-1 rounded-lg bg-gold px-3 font-semibold text-gold-foreground"><Send className="h-4 w-4" /> Push</button>
              </li>
            );
          })}</ul>
          {pushed.filter((x) => x.program === p.id).length ? (
            <div className="mt-3"><p className="text-[13px] text-muted-foreground">Pushed out</p>
              {pushed.filter((x) => x.program === p.id).map((x, i) => <p key={i} className="text-[14px]">{x.title} → {x.to}</p>)}</div>
          ) : null}
        </section>
      </div>

      {pushing && (
        <Sheet title={`Push out: ${pushing.title}`} onClose={() => setPushing(null)}>
          <label className="block text-[15px]">Send to<select className={field} value={to} onChange={(e) => setTo(e.target.value)}>{targets.map((t) => <option key={t}>{t}</option>)}</select></label>
          <button className={`${btn} mt-3`} onClick={() => { onPush(pushing, to); setPushing(null); }}>Push out now</button>
          <p className="mt-2 text-[13px] text-muted-foreground">Shows here only. Nothing is sent to anyone.</p>
        </Sheet>
      )}
    </div>
  );
}