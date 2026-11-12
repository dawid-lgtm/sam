import { useEffect, useState } from "react";
import { FlowDiagram } from "@/components/flow/FlowDiagram";

const KEY = "sam-test-flow-v1";
const blank = {
  st: { goals: [], briefing: false, meetings: [], regionals: [], strategies: [], regWorkshop: false, leaders: [], actions: [], monthly: [] },
  op: { on: false, briefing: false, people: [], labs: { supt: "", sup: "" }, wb: {}, attended: {} },
  outbox: [],
};
const PROMPTS = ["What does your crew commit to each shift, and how do you know?", "Where does your pit lose time in Block 1?", "Describe your last Drive-around: what did you see, what did you fix?"];

function useStore() {
  const [s, set] = useState(blank);
  useEffect(() => { try { const v = localStorage.getItem(KEY); if (v) set(JSON.parse(v)); } catch {} }, []);
  const save = (fn) => set((old) => { const n = fn(structuredClone(old)); try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} return n; });
  return [s, save];
}

const Card = ({ title, children, tag }) => (
  <div className="rounded-2xl bg-card p-4">
    <div className="mb-2 flex items-center justify-between"><h3 className="font-serif text-[17px] font-semibold">{title}</h3>{tag && <span className="rounded bg-gold px-2 text-[12px] font-bold text-background">{tag}</span>}</div>
    {children}
  </div>
);
const Btn = ({ children, ...p }) => <button {...p} className="mt-2 mr-2 rounded-lg bg-gold px-3 py-2 text-[14px] font-bold text-background disabled:opacity-40">{children}</button>;
const In = (p) => <input {...p} className="mt-1 mr-2 w-full rounded-lg bg-background px-3 py-2 text-[14px] sm:w-auto" />;

function Form({ fields, onAdd, label = "Add" }) {
  const [v, setV] = useState({});
  const ok = fields.every((f) => (v[f.k] || "").trim());
  return (
    <div className="flex flex-wrap items-end">
      {fields.map((f) => <In key={f.k} placeholder={f.p} type={f.t || "text"} value={v[f.k] || ""} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />)}
      <Btn disabled={!ok} onClick={() => { onAdd(v); setV({}); }}>{label}</Btn>
    </div>
  );
}
const List = ({ items, render }) => items.length ? <ul className="mt-2 space-y-1 text-[14px]">{items.map((x, i) => <li key={i} className="rounded-lg bg-background/60 px-3 py-1">{render(x, i)}</li>)}</ul> : <p className="mt-2 text-[13px] opacity-70">None yet.</p>;
const mail = (s, to, what) => s.outbox.unshift({ to, what, at: new Date().toLocaleString("en-AU") });

function Strategy({ s, save, role }) {
  const t = s.st;
  if (role === "lead") return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card title="1 · Enterprise Goals and Objectives" tag="Form">
        <Form fields={[{ k: "goal", p: "Goal" }, { k: "obj", p: "Objective" }]} onAdd={(v) => save((n) => { n.st.goals.push(v); return n; })} />
        <List items={t.goals} render={(g) => <><b>{g.goal}</b> · {g.obj}</>} />
      </Card>
      <Card title="2 · Briefing Workshop" tag="Agenda">
        <p className="text-[14px]">Agenda and coaching cards: <span className="text-gold underline">open (sample)</span></p>
        <label className="mt-2 flex items-center gap-2 text-[15px]"><input type="checkbox" checked={t.briefing} onChange={(e) => save((n) => { n.st.briefing = e.target.checked; return n; })} /> The master briefing is done</label>
      </Card>
      <Card title="3 · Monthly On the Business meetings" tag="Calendar">
        <Form fields={[{ k: "date", p: "Date", t: "date" }]} label="Add date" onAdd={(v) => save((n) => { n.st.monthly.push({ date: v.date, done: false, reg: false }); return n; })} />
        <List items={t.monthly} render={(m) => m.date} />
      </Card>
      <Card title="4 · Hand on to the Regional GMs / Ops Managers">
        {!t.briefing || !t.goals.length ? <p className="text-[13px] opacity-80">Enter at least one goal and tick the briefing first.</p> :
          <Form fields={[{ k: "name", p: "Name" }, { k: "email", p: "Email (test)" }, { k: "region", p: "Region" }]} onAdd={(v) => save((n) => { n.st.regionals.push(v); mail(n, v.email, "Login details and your task: Strategies and Tactics for " + v.region); return n; })} />}
        <List items={t.regionals} render={(r) => <>{r.name} · {r.region}</>} />
      </Card>
    </div>
  );
  if (role === "regional") return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card title="Your tasks"><ol className="list-decimal pl-5 text-[14px]"><li>Run a workshop with your Project Managers</li><li>Enter Strategies and Tactics</li><li>Tick the workshop done</li></ol><p className="mt-2 text-[13px]">Handbook · Tools · <span className="text-gold underline">What is GOSTPA?</span></p></Card>
      <Card title="Goals and Objectives (from the Program Lead)"><List items={t.goals} render={(g) => <><b>{g.goal}</b> · {g.obj}</>} /></Card>
      <Card title="Strategies and Tactics" tag="Form">
        <Form fields={[{ k: "strategy", p: "Strategy" }, { k: "tactic", p: "Tactic" }]} onAdd={(v) => save((n) => { n.st.strategies.push(v); return n; })} />
        <List items={t.strategies} render={(x) => <><b>{x.strategy}</b> · {x.tactic}</>} />
      </Card>
      <Card title="Workshop">
        <label className="flex items-center gap-2 text-[15px]"><input type="checkbox" checked={t.regWorkshop} onChange={(e) => save((n) => { n.st.regWorkshop = e.target.checked; if (e.target.checked) mail(n, "Program Lead", "Combined Goals, Objectives, Strategies and Tactics (download attached)"); return n; })} /> Workshop with Project Managers done</label>
      </Card>
    </div>
  );
  if (role === "pm") return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card title="Add your site leaders">
        <Form fields={[{ k: "name", p: "Name" }, { k: "title", p: "Title" }, { k: "email", p: "Email (test)" }, { k: "reports", p: "Reports to" }]} onAdd={(v) => save((n) => { n.st.leaders.push(v); mail(n, v.email, "Invitation and welcome to the site strategy workshop"); return n; })} />
        <List items={t.leaders} render={(l) => <>{l.name} · {l.title} · reports to {l.reports}</>} />
      </Card>
      <Card title="Tactics, Plans and Actions" tag="Form">
        {!t.strategies.length ? <p className="text-[13px] opacity-80">Waiting for the regional Strategies and Tactics.</p> :
          <Form fields={[{ k: "tactic", p: "Tactic" }, { k: "plan", p: "Plan" }, { k: "action", p: "Action" }, { k: "owner", p: "Owner" }, { k: "date", p: "Date", t: "date" }, { k: "measure", p: "Measure" }]} onAdd={(v) => save((n) => { n.st.actions.push(v); return n; })} />}
        <List items={t.actions} render={(a) => <>{a.action} · {a.owner} · {a.date} · {a.measure}</>} />
      </Card>
      <Card title="Monthly On the Business" tag="Nudges">
        <List items={t.monthly} render={(m, i) => (
          <span className="flex flex-wrap gap-3">{m.date}
            <label><input type="checkbox" checked={m.done} onChange={(e) => save((n) => { n.st.monthly[i].done = e.target.checked; return n; })} /> held</label>
            <label><input type="checkbox" checked={m.reg} onChange={(e) => save((n) => { n.st.monthly[i].reg = e.target.checked; return n; })} /> Action Register updated</label>
            {(!m.done || !m.reg) && new Date(m.date) < new Date() && <span className="text-gold">Overdue: Ops Manager and Program Lead alerted</span>}
          </span>)} />
      </Card>
    </div>
  );
  return null;
}



function Workbook({ s, save, who }) {
  const w = s.op.wb[who.name] || { a: {}, sub: false, ok: false };
  const set = (fn) => save((n) => { n.op.wb[who.name] = fn(n.op.wb[who.name] || { a: {}, sub: false, ok: false }); return n; });
  return (
    <Card title={`Prime workbook: ${who.name}`} tag={w.ok ? "Signed off" : w.sub ? "Waiting sign-off" : "Nudge: due this week"}>
      {PROMPTS.map((p, i) => <div key={i} className="mb-2 text-[14px]">{i + 1}. {p}<textarea disabled={w.sub} className="mt-1 w-full rounded-lg bg-background p-2" rows={2} value={w.a[i] || ""} onChange={(e) => set((x) => { x.a[i] = e.target.value; return x; })} /></div>)}
      <p className="text-[12px] opacity-70">Sample activities. The real workbook comes from the program team.</p>
      {!w.sub && <Btn disabled={PROMPTS.some((_, i) => !(w.a[i] || "").trim())} onClick={() => set((x) => { x.sub = true; return x; })}>Submit for sign-off</Btn>}
    </Card>
  );
}

function Ops({ s, save, role, actAs, setActAs }) {
  const o = s.op;
  const supts = o.people.filter((p) => p.level === "Superintendent");
  const sups = o.people.filter((p) => p.level === "Supervisor");
  const wb = (n) => o.wb[n] || {};
  if (role === "super") return null;
  if (role === "pm") return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card title="Briefing"><label className="flex items-center gap-2 text-[15px]"><input type="checkbox" checked={o.briefing} onChange={(e) => save((n) => { n.op.briefing = e.target.checked; return n; })} /> Briefing held; Project Managers have access</label></Card>
      <Card title="Validation Labs" tag="Calendar">
        <label className="block text-[14px]">Superintendents' day <In type="date" value={o.labs.supt} onChange={(e) => save((n) => { n.op.labs.supt = e.target.value; return n; })} /></label>
        <label className="block text-[14px]">Supervisors' day (Superintendents attend too) <In type="date" value={o.labs.sup} onChange={(e) => save((n) => { n.op.labs.sup = e.target.value; return n; })} /></label>
      </Card>
      <Card title="Add Superintendents (who reports to you)">
        <Form fields={[{ k: "name", p: "Name" }, { k: "email", p: "Email (test)" }, { k: "stream", p: "Production or Maintenance" }, { k: "reports", p: "Reports to (Project Manager)" }]} onAdd={(v) => save((n) => { n.op.people.push({ ...v, level: "Superintendent" }); mail(n, v.email, "Login, your workbook, and your supervisors' workbooks"); return n; })} />
        <List items={supts} render={(p) => <>{p.name} · {p.stream} · reports to {p.reports}</>} />
      </Card>
      <Card title="Sign off Superintendents' workbooks" tag="Sign-off">
        <List items={supts} render={(p) => <span className="flex flex-wrap gap-2">{p.name}: {wb(p.name).ok ? "signed off ✓" : wb(p.name).sub ? <Btn onClick={() => save((n) => { n.op.wb[p.name].ok = true; return n; })}>Approve</Btn> : "not submitted (nudged)"}</span>} />
      </Card>
    </div>
  );
  if (role === "supt" || role === "sup") {
    const pool = role === "supt" ? supts : sups;
    const me = pool.find((p) => p.name === actAs) || pool[0];
    if (!me) return <Card title="Nobody here yet"><p className="text-[14px]">{role === "supt" ? "The Project Manager adds Superintendents first." : "A Superintendent adds Supervisors first."}</p></Card>;
    const mine = sups.filter((p) => p.reports === me.name);
    const signed = wb(me.name).ok;
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <Card title="Signed in as"><select className="w-full rounded-lg bg-background p-2" value={me.name} onChange={(e) => setActAs(e.target.value)}>{pool.map((p) => <option key={p.name}>{p.name}</option>)}</select></Card>
        <Workbook s={s} save={save} who={me} />
        {role === "supt" && <>
          <Card title="Add your Supervisors (shift details)">
            <Form fields={[{ k: "name", p: "Name" }, { k: "email", p: "Email (test)" }, { k: "crew", p: "Crew" }, { k: "shift", p: "Shift times" }, { k: "roster", p: "Roster" }, { k: "target", p: "Target" }]} onAdd={(v) => save((n) => { n.op.people.push({ ...v, level: "Supervisor", reports: me.name, stream: me.stream }); mail(n, v.email, "Login, your workbook, and Validation Lab booking"); return n; })} />
            <List items={mine} render={(p) => <>{p.name} · {p.crew} · {p.shift} · {p.target}</>} />
          </Card>
          <Card title="Confirm Supervisors' workbooks to standard" tag="Sign-off">
            <List items={mine} render={(p) => <span className="flex flex-wrap gap-2">{p.name}: {wb(p.name).ok ? "to standard ✓" : wb(p.name).sub ? <Btn onClick={() => save((n) => { n.op.wb[p.name].ok = true; return n; })}>Confirm to standard</Btn> : "not submitted (nudged)"}</span>} />
          </Card>
        </>}
        <Card title="Validation Lab and handbooks" tag={signed ? "Unlocked" : "Locked"}>
          {signed ? <><p className="text-[14px]">Lab: {role === "supt" ? o.labs.supt || "date not set" : o.labs.sup || "date not set"}</p><Btn>Book my seat</Btn><Btn>Download handbook</Btn>
            {o.attended[me.name] && <p className="mt-2 text-[14px] text-gold">Attended ✓ Apply workbook unlocked</p>}</> :
            <p className="text-[14px]">Unlocks once your workbook is signed off.</p>}
        </Card>
      </div>
    );
  }
  if (role === "facilitator") return (
    <Card title="Validation Lab attendance" tag="Unlocks Apply">
      <List items={o.people.filter((p) => wb(p.name).ok)} render={(p) => <label className="flex gap-2"><input type="checkbox" checked={!!o.attended[p.name]} onChange={(e) => save((n) => { n.op.attended[p.name] = e.target.checked; return n; })} />{p.name} · {p.level}</label>} />
    </Card>
  );
  return null;
}

const FLOWS = {
  strategy: {
    steps: [
      { label: "Goal", who: "CEO and ELT" },
      { label: "Objectives", who: "CEO and ELT" },
      { label: "Briefing workshop", who: "Program Lead" },
      { label: "Strategies", who: "Regional GM with the PMs" },
      { label: "Tactics", who: "Project Manager" },
      { label: "Plans", who: "Site leaders" },
      { label: "Actions", who: "Site leaders, name and date" },
      { label: "ON the business", who: "Monthly, site then head office" },
    ],
    at: { lead: 2, regional: 3, pm: 6 },
  },
  ops: {
    steps: [
      { label: "Briefing", who: "Project Manager" },
      { label: "Prime workbook", who: "Superintendent and Supervisor" },
      { label: "Sign-off", who: "Superintendent, then PM" },
      { label: "Validation Lab", who: "Facilitator" },
      { label: "Apply on site", who: "Everyone" },
    ],
    at: { pm: 0, supt: 1, sup: 1, facilitator: 3 },
  },
};

const ROLES = {
  strategy: [["lead", "Program Lead / Ops Manager"], ["regional", "Regional GM"], ["pm", "Project Manager (site)"]],
  ops: [["pm", "Project Manager"], ["supt", "Superintendent"], ["sup", "Supervisor"], ["facilitator", "Lab facilitator"]],
};

export function FlowTest() {
  const [s, save] = useStore();
  const [prog, setProg] = useState("strategy");
  const [role, setRole] = useState("lead");
  const [actAs, setActAs] = useState("");
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-card p-4">
        <h2 className="font-serif text-[22px] font-semibold">Test the MMS set-up</h2>
        <p className="text-[14px] opacity-80">Test names only. Pick a program, then act as each person in turn. Nothing is emailed.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[["strategy", "Managing Strategy (GOSTPA)"], ["ops", "Ops and Maintenance Phase 1 (CML)"]].map(([k, l]) => <button key={k} onClick={() => { setProg(k); setRole(ROLES[k][0][0]); }} className={`rounded-lg px-3 py-2 text-[14px] font-bold ${prog === k ? "bg-gold text-background" : "bg-background"}`}>{l}</button>)}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {ROLES[prog].map(([k, l]) => <button key={k} onClick={() => setRole(k)} className={`rounded-lg px-3 py-1 text-[13px] ${role === k ? "bg-gold text-background font-bold" : "bg-background"}`}>{l}</button>)}
        </div>
      </div>
      <FlowDiagram steps={FLOWS[prog].steps} active={FLOWS[prog].at[role] ?? -1} />
      {prog === "strategy" ? <Strategy s={s} save={save} role={role} /> : <Ops s={s} save={save} role={role} actAs={actAs} setActAs={setActAs} />}
    </div>
  );
}