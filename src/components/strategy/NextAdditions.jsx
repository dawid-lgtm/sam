import { Section } from "@/components/ui-kit/Section";

const additions = [
  {
    title: "Dynamic goal templates",
    body: "The goal builder changes its prompts by the phase the business is in — vision, safety, production — and drafts the sentence from the answers, so a supervisor can still repeat it.",
  },
  {
    title: "Action progress tracking",
    body: "Every strategy shows how many of its actions are done, overdue or still undated, so a strategy with nothing behind it is visible before the review, not at it.",
  },
];

export function NextAdditions() {
  return (
    <Section title="Suggested next for this section" subtitle="Two upgrades that turn the builders into a record of progress.">
      <div className="space-y-2">
        {additions.map((a) => (
          <div key={a.title} className="rounded-xl bg-background/40 p-3">
            <p className="text-[16px] font-semibold leading-snug text-foreground">{a.title}</p>
            <p className="mt-1 text-[15px] leading-snug text-muted-foreground">{a.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}