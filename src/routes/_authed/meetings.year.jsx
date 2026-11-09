import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { MONTH_LABELS } from "@/lib/meetings";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section } from "@/components/ui-kit/Section";
import { RulesList } from "@/components/meetings/MeetingCard";

export const Route = createFileRoute("/_authed/meetings/year")({
  component: YearView,
  head: () => ({ meta: [{ title: "Sam — Meetings, year view" }] }),
});

const VALUE_CHECK_MONTHS = [3, 6, 9, 12];

function YearView() {
  const { data, isLoading } = useSamData();
  const [year, setYear] = useState(() => moment.utc().year());

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-white" />;

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader eyebrow="Tool 4" title="The year" intro="Same rhythm every month. Months 3, 6, 9 and 12 are value-check months." />

      <div className="mb-4 flex gap-2">
        <Link to="/meetings" className="flex min-h-[40px] items-center rounded-full bg-white px-4 text-sm font-medium text-muted-foreground">
          Calendar
        </Link>
        <span className="flex min-h-[40px] items-center rounded-full bg-navy px-4 text-sm font-medium text-white">Year view</span>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-border bg-white px-3 py-2">
        <button onClick={() => setYear((y) => y - 1)} aria-label="Previous year" className="grid h-10 w-10 place-items-center rounded-xl text-navy">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-[15px] font-semibold text-navy">{year}</p>
        <button onClick={() => setYear((y) => y + 1)} aria-label="Next year" className="grid h-10 w-10 place-items-center rounded-xl text-navy">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {MONTH_LABELS.map((label, i) => {
          const month = i + 1;
          const valueCheck = VALUE_CHECK_MONTHS.includes(month);
          return (
            <div
              key={label}
              className={`rounded-2xl border p-3 ${valueCheck ? "border-gold bg-gold/10" : "border-border bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold text-navy">{label}</p>
                {valueCheck ? (
                  <span className="rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-navy">
                    Value check
                  </span>
                ) : null}
              </div>
              <ul className="mt-2 space-y-1 text-[11px] leading-snug text-muted-foreground">
                <li>Wk 1 · Head office ON</li>
                <li>Wk 1-3 · Site IN, weekly</li>
                <li>Wk 4 · Site ON, per site</li>
                <li>Every Friday · Head office IN</li>
              </ul>
            </div>
          );
        })}
      </div>

      <Section className="mt-4" title="The four rules">
        <RulesList />
      </Section>
    </div>
  );
}