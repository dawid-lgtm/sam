import { useState } from "react";
import { Pencil, RotateCcw, ShieldCheck, X } from "lucide-react";
import { SANDBOX_PROGRAMS, useSandbox } from "@/lib/sandboxStore";

const field = "mt-1 h-12 w-full rounded-xl border border-border bg-card px-3 text-[15px] text-foreground";
const btn = "mt-3 min-h-[48px] w-full rounded-xl bg-gold px-4 font-semibold text-gold-foreground";

export function Sandbox() {
  const [admins, saveAdmin, resetAdmin] = useSandbox();
  const [editing, setEditing] = useState(null);

  return (
    <div className="space-y-3">
      <section className="rounded-2xl bg-card p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] text-gold">Sandbox</p>
            <h2 className="font-heading text-[22px] font-semibold leading-tight">Program admins</h2>
            <p className="text-[15px]">One admin per program to start. They are the first person in each program and add everyone below them.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        {SANDBOX_PROGRAMS.map((p) => {
          const a = admins[p.id];
          return (
            <section key={p.id} className="rounded-2xl bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold" />
                <h3 className="font-heading text-[18px] font-semibold">{p.name}</h3>
              </div>
              <div className="rounded-xl bg-background/40 p-3">
                <p className="text-[15px] font-semibold">{a.person}</p>
                <p className="text-[15px] text-gold">Program admin</p>
                <p className="text-[15px] break-all">{a.email}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(p)} className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-3 font-semibold text-gold-foreground">
                  <Pencil className="h-4 w-4" /> Change admin
                </button>
                <button onClick={() => resetAdmin(p.id)} aria-label="Reset name" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-foreground">
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <p className="px-1 text-[13px] text-muted-foreground">
        Names only. These are not real logins yet and nothing is emailed.
      </p>

      {editing && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-background p-4 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-heading text-[22px] font-semibold">{editing.name} admin</h2>
              <button aria-label="Close" onClick={() => setEditing(null)} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-card"><X className="h-5 w-5" /></button>
            </div>
            <EditAdmin
              admin={admins[editing.id]}
              onSave={(admin) => {
                saveAdmin(editing.id, admin);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EditAdmin({ admin, onSave }) {
  const [person, setPerson] = useState(admin.person);
  const [email, setEmail] = useState(admin.email);
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!person.trim()) return;
        onSave({ person: person.trim(), email: email.trim() });
      }}
    >
      <label className="block text-[15px]">
        Name
        <input className={field} value={person} onChange={(e) => setPerson(e.target.value)} required />
      </label>
      <label className="block text-[15px]">
        Email
        <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button className={btn}>Save admin</button>
      <p className="text-[13px] text-muted-foreground">Kept on this browser only for now.</p>
    </form>
  );
}