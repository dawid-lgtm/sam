import { Section } from "@/components/ui-kit/Section";

const rhythm = {
  rows: [
    {
      who: "At site (PM, coached by the Ops Manager or GM)",
      cells: [
        "IN · Weekly site review",
        "IN · Weekly site review",
        "IN · Weekly site review",
        "ON · ON the business (half a day)",
      ],
    },
    {
      who: "Head office (CEO and ELT)",
      cells: [
        "ON · ON the business (full day, same four questions)",
        "IN · Executive hour",
        "IN · Executive hour",
        "IN · Executive hour",
      ],
    },
  ],
  onIndex: { 0: [3], 1: [0] },
};

function Mark({ children }) {
  return <span className="font-semibold text-gold">{children}</span>;
}

const terms = [
  {
    label: "IN the business",
    body: (
      <>
        A standing operational meeting. It deals with the issues and concerns from the last week and looks at the week
        ahead: mitigating risk, making the plans to address it, or changing the plans accordingly. It has a week that
        was and a week that follows: are we going to hit our number, this month's focus?
      </>
    ),
  },
  {
    label: "ON the business",
    body: "Running our business, where we ask the same core questions every time, always starting with safety.",
    questions: [
      "Are our people safe? Safety stats, and the safety and risk plans to improve.",
      "Are we making money, and can we make more? Fiscal performance review.",
      "Are we running a quality business? The implementation of the four block model, the utility of our meetings, the performance of our frontline staff, our adherence to the mine plan and the face positions, and the trend and performance analysis.",
      "Are our people happy? Culture and churn.",
    ],
    after:
      "The site meeting answers these in half a day. The head office meeting answers the same questions in a full day, once a month.",
  },
];

export function RhythmExplained() {
  return (
    <div className="space-y-4">
      <Section
        title="IN, IN, IN, ON"
        subtitle={
          <>
            Three weeks <Mark>IN</Mark> the business, then one <Mark>ON</Mark> it. The same four week shape at site and
            at head office.
          </>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {terms.map((t) => (
            <div key={t.label} className="rounded-xl bg-background/40 p-3">
              <p className="text-[16px] font-semibold text-gold">{t.label}</p>
              <p className="mt-1 text-[15px] leading-snug text-foreground">{t.body}</p>
              {t.questions ? (
                <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-[15px] leading-snug text-gold marker:text-gold">
                  {t.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              ) : null}
              {t.after ? (
                <p className="mt-1.5 text-[15px] leading-snug text-muted-foreground">{t.after}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="The four weeks, as they sit"
        subtitle={
          <>
            Each site's <Mark>ON</Mark> the business meeting sits in the week, or a couple of days, before the head
            office one, because one informs the other.
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-1 text-[15px]">
            <thead>
              <tr>
                <th />
                {[1, 2, 3, 4].map((w) => (
                  <th key={w} className="px-2 py-1 text-left font-semibold">
                    Week {w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rhythm.rows.map((r, ri) => (
                <tr key={r.who}>
                  <th className="px-2 py-1 text-left font-semibold">{r.who}</th>
                  {r.cells.map((c, ci) => (
                    <td
                      key={ci}
                      className={`rounded-lg px-2 py-2 ${
                        (rhythm.onIndex[ri] || []).includes(ci)
                          ? "bg-gold font-semibold text-gold-foreground"
                          : "bg-background/40"
                      }`}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 space-y-1.5">
          {[
            "The site ON the business meeting is held before the head office ON the business meeting, never after.",
            "The head office monthly ON the business meeting is dated for twelve months at the leadership workshop.",
            "The six-monthly strategy and performance review is held off site, and is dated at the same time.",
            "ELT checks every site is holding the rhythm, not just that it was agreed.",
          ].map((line) => (
            <p key={line} className="rounded-lg bg-background/40 p-2.5 text-[15px] leading-snug text-foreground">
              {line}
            </p>
          ))}
        </div>

        <p className="mt-3 text-[15px] leading-snug text-muted-foreground">
          The three weekly site reviews that precede the site ON meeting are the Enterprise Foundations rhythm, not this
          program.
        </p>
      </Section>
    </div>
  );
}