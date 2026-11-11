import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Lock, Check, ChevronDown } from "lucide-react";
import { productCardsQuery } from "@/lib/catalog";
import { useCardProgress } from "@/lib/cardProgress";
import { CardRunner } from "@/components/master/CardRunner";
import { PageHeader } from "@/components/ui-kit/PageHeader";

export const Route = createFileRoute("/_authed/strategy/start")({
  component: GetStarted,
  head: () => ({ meta: [{ title: "Sam — Get started" }] }),
});

const KEYS = ["strategy-start-before", "strategy-start-1", "strategy-start-2", "strategy-start-3"];

const GROUPS = [
  { n: 0, name: "Before you start", note: "Read this first." },
  { n: 1, name: "Step 1 · The executive session", note: "The goal, the objectives, one owner each." },
  { n: 2, name: "Step 2 · The leadership workshop", note: "Strategies designed, rhythm locked." },
  { n: 3, name: "Step 3 · Back at site", note: "Tactics, plans and actions — a name and a date." },
];

// "Step 2 · ..." → group 2. Anything else sits in "Before you start".
function groupOf(card) {
  const match = /^Step (\d) · /.exec(card.title || "");
  const n = match ? Number(match[1]) : 0;
  return GROUPS.some((g) => g.n === n) ? n : 0;
}

function GetStarted() {
  const { data: cards = [], isLoading } = useQuery(productCardsQuery("strategy"));
  const before = useCardProgress(KEYS[0]);
  const one = useCardProgress(KEYS[1]);
  const two = useCardProgress(KEYS[2]);
  const three = useCardProgress(KEYS[3]);
  const records = [before.record, one.record, two.record, three.record];
  const [open, setOpen] = useState(null);

  const grouped = GROUPS.map((g) => ({
    ...g,
    cards: cards.filter((c) => groupOf(c) === g.n),
  }));

  const doneFor = (i) => {
    const list = grouped[i].cards;
    return list.length > 0 && (records[i]?.done || 0) >= list.length;
  };

  const unlocked = (i) => i === 0 || doneFor(i - 1);
  const firstOpen = grouped.findIndex((g, i) => g.cards.length > 0 && !doneFor(i) && unlocked(i));
  const openIndex = open ?? (firstOpen === -1 ? 0 : firstOpen);

  if (isLoading) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  return (
    <div>
      <PageHeader
        title="Get started"
        intro="Work the steps in order. A step opens when the one before it is finished — nothing skips ahead."
      />

      {cards.length === 0 ? (
        <p className="sam-glass p-4 text-[15px] leading-snug text-foreground">
          No program cards are loaded for strategy yet. An administrator adds them in the program card builder, and they
          appear here in their step.
        </p>
      ) : (
        <div className="space-y-3">
          {grouped.map((g, i) => {
            const isOpen = openIndex === i;
            const isUnlocked = unlocked(i);
            const isDone = doneFor(i);
            const opened = grouped[i].cards.length;

            return (
              <section key={g.n} className="sam-glass overflow-hidden">
                <button
                  type="button"
                  onClick={() => isUnlocked && setOpen(isOpen ? -1 : i)}
                  disabled={!isUnlocked}
                  className="flex w-full items-center gap-3 p-3.5 text-left disabled:cursor-not-allowed"
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[15px] font-semibold ${
                      isDone
                        ? "bg-gold text-gold-foreground"
                        : isUnlocked
                          ? "bg-secondary text-foreground"
                          : "bg-background/60 text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check className="h-5 w-5" /> : isUnlocked ? g.n || "•" : <Lock className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold leading-snug text-foreground">{g.name}</span>
                    <span className="mt-0.5 block text-[15px] leading-snug text-muted-foreground">
                      {isUnlocked
                        ? `${g.note} · ${records[i]?.done || 0} of ${opened} cards done`
                        : "Finish the step before this one to unlock."}
                    </span>
                  </span>
                  {isUnlocked ? (
                    <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
                  ) : null}
                </button>

                {isOpen && isUnlocked ? (
                  <div className="border-t border-foreground/10 p-3.5">
                    <CardRunner cards={g.cards} productKey={KEYS[i]} />
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}