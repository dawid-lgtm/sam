import { useEffect, useState } from "react";
import { Check, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { CARD_FORMATS, formatMeta } from "@/lib/cardFormats";
import { CardToolLink } from "@/components/master/CardToolLink";

const stepName = (s) => s.name?.replace(/^Step \d+ · /, "") || "Activities";

function ActivityRow({ card, locked, done, onToggle, onEdit, onDelete }) {
  const meta = formatMeta(card.format);
  return (
    <div className="flex items-start gap-2 rounded-xl bg-background/40 p-3">
      <button
        type="button"
        onClick={onToggle}
        disabled={locked}
        aria-pressed={done}
        title={done ? "Untick this activity" : "Tick this activity off"}
        className="mt-0.5 shrink-0 disabled:opacity-40"
      >
        <span
          className={`grid h-6 w-6 place-items-center rounded-md border-2 ${
            done ? "border-gold bg-gold text-gold-foreground" : "border-muted-foreground/60"
          }`}
        >
          {done ? <Check className="h-4 w-4" /> : null}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold leading-snug text-foreground">{card.title || meta.label}</p>
        <p className="text-[14px] leading-snug text-muted-foreground">{meta.label}</p>
        {card.tool_id ? <CardToolLink toolId={card.tool_id} /> : null}
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${card.title || "activity"}`}
          className="grid h-9 w-9 place-items-center rounded-lg bg-card"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Remove ${card.title || "activity"}`}
          className="grid h-9 w-9 place-items-center rounded-lg bg-card"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Launch the program: three steps, each with its own activities, gated in order. */
export function ProgramSteps({ cards, steps, productKey = "strategy", onAdd, onEdit, onDelete }) {
  const storageKey = `sam-program-steps:${productKey}`;
  const [done, setDone] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    setDone(raw ? JSON.parse(raw) : []);
  }, [storageKey]);

  const toggle = (id) => {
    const next = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
    setDone(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const stages = steps?.length ? steps : [{ n: 1, name: "Activities" }];
  let previousComplete = true;
  const groups = stages.map((s) => {
    const list = cards.filter((c) => (c.step || 1) === s.n);
    const complete = list.length > 0 && list.every((c) => done.includes(c.id));
    const group = { s, list, locked: !previousComplete, complete };
    previousComplete = complete;
    return group;
  });

  return (
    <div className="space-y-4">
      {groups.map(({ s, list, locked, complete }, index) => (
        <div key={s.n} className={`rounded-2xl p-3 ${locked ? "bg-background/20" : "bg-background/40"}`}>
          <div className="flex items-start gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold font-heading text-[16px] font-semibold text-gold-foreground">
              {s.n}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-[18px] font-semibold leading-snug text-foreground">{stepName(s)}</p>
              <p className="text-[14px] leading-snug text-muted-foreground">
                {list.length ? `${list.filter((c) => done.includes(c.id)).length} of ${list.length} done` : "No activities yet"}
              </p>
            </div>
            {locked ? <Lock className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" /> : null}
            {complete ? <Check className="mt-1 h-5 w-5 shrink-0 text-gold" /> : null}
          </div>

          {locked ? (
            <p className="mt-2 rounded-xl bg-background/50 p-3 text-[15px] leading-snug text-muted-foreground">
              Locked until step {index} is marked complete.
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              {list.length ? (
                list.map((card) => (
                  <ActivityRow
                    key={card.id}
                    card={card}
                    locked={false}
                    done={done.includes(card.id)}
                    onToggle={() => toggle(card.id)}
                    onEdit={() => onEdit(card)}
                    onDelete={() => onDelete(card)}
                  />
                ))
              ) : (
                <p className="rounded-xl bg-background/50 p-3 text-[15px] leading-snug text-muted-foreground">
                  Nothing in this step yet. Add an activity below and set its step.
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[15px] font-semibold text-foreground">
          <Plus className="h-4 w-4 text-gold" /> Add an activity
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {CARD_FORMATS.map((format) => (
            <button
              key={format.key}
              type="button"
              onClick={() => onAdd(format.key)}
              className="rounded-xl bg-background/40 p-3 text-left transition hover:ring-2 hover:ring-gold"
            >
              <span className="block text-[15px] font-semibold text-foreground">{format.label}</span>
              <span className="mt-0.5 block text-[14px] leading-snug text-muted-foreground">{format.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}