import { PlayCircle } from "lucide-react";

/**
 * Video slots. Paste a URL (mp4 or a hosted embed file) beside a layer key and
 * the player appears in that row. Keys: intro, g, o, s, p, a.
 */
const VIDEOS = {};

const layers = [
  {
    key: "g",
    letter: "G",
    name: "Goal",
    question: "Where are we going, in one sentence everybody can repeat?",
    where: "Written by the executive, at the top of this page",
    one: true,
  },
  {
    key: "o",
    letter: "O",
    name: "Objectives",
    question: "What must be true in the business for the Goal to happen?",
    where: "Five at most, on this page",
    one: false,
  },
  {
    key: "s",
    letter: "S",
    name: "Strategies",
    question: "What are we doing about each Objective?",
    where: "Strategy → Strategies, designed as a group in the workshop",
    one: false,
  },
  {
    key: "p",
    letter: "P",
    name: "Plans",
    question: "Who, what, where and when, at this site?",
    where: "On each site's page",
    one: false,
  },
  {
    key: "a",
    letter: "A",
    name: "Actions",
    question: "Who does what, by which date?",
    where: "On each site's page, tracked in the Action register",
    one: false,
  },
];

const steps = [
  {
    n: "1",
    title: "The executive session",
    body: "The Goal and up to five Objectives. Each gets an ELT owner, a success metric, a value and a deliver date.",
  },
  {
    n: "2",
    title: "The leadership workshop",
    body: "Strategies are designed together, with an owner from the wider leadership team, a success metric, a value and a deliver date.",
  },
  {
    n: "3",
    title: "Back at site",
    body: "Each site turns its share into Tactics, Plans and Actions. The Goal, Objectives and Strategies are already there.",
  },
];

function VideoSlot({ src }) {
  if (!src) return null;
  return (
    <div className="mt-2 overflow-hidden rounded-xl bg-background/60">
      <video src={src} controls playsInline className="w-full" />
    </div>
  );
}

export function GospaExplainer() {
  return (
    <section className="sam-glass p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-heading text-[19px] font-semibold text-foreground">How the model works</h2>
        <span className="rounded-full bg-gold px-2.5 py-1 text-[14px] font-semibold text-gold-foreground">
          GOSPA
        </span>
      </div>
      <p className="mt-2 text-[15px] leading-snug text-foreground">
        One Goal, a small number of Objectives, and a Strategy for each. Below that, every site's Plans and
        Actions. Nothing skips a level: an Action with no Strategy behind it is work, not progress.
      </p>

      <VideoSlot src={VIDEOS.intro} />

      <div className="mt-3 space-y-2">
        {layers.map((l) => (
          <div key={l.key} className="rounded-xl bg-background/40 p-3">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold font-heading text-[17px] font-semibold text-gold-foreground">
                {l.letter}
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-foreground">
                  {l.name}
                  {l.one ? <span className="ml-2 text-[14px] font-medium text-muted-foreground">one only</span> : null}
                </p>
                <p className="mt-0.5 text-[15px] leading-snug text-foreground">{l.question}</p>
                <p className="mt-0.5 text-[15px] leading-snug text-muted-foreground">{l.where}</p>
              </div>
            </div>
            <VideoSlot src={VIDEOS[l.key]} />
          </div>
        ))}
      </div>

      <h3 className="mt-4 font-heading text-[17px] font-semibold text-foreground">How it runs</h3>
      <div className="mt-2 space-y-2">
        {steps.map((s) => (
          <div key={s.n} className="flex items-start gap-3 rounded-xl bg-background/40 p-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-[15px] font-semibold text-gold-foreground">
              {s.n}
            </span>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-foreground">{s.title}</p>
              <p className="mt-0.5 text-[15px] leading-snug text-muted-foreground">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 flex items-start gap-2 rounded-xl bg-background/40 p-3 text-[15px] leading-snug text-muted-foreground">
        <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
        Walkthrough videos are being made for each layer and will appear in this section.
      </p>
    </section>
  );
}