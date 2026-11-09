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

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  return (
    <div>
      <PageHeader
        title="The year"
        intro="Same rhythm every month. Months 3, 6, 9 and 12 are value-check months."
      />

      <div className="mb-4 grid grid-cols-2 gap-2">
        <Link
          to="/meetings"
          className="flex min-h-[48px] items-center justify-center rounded-xl bg-card text-[15px] font-semibold text-muted-foreground"
        >
          Calendar
        </Link>
        <span className="flex min-h-[48px] items-center justify-center rounded-xl bg-gold text-[15px] font-semibold text-gold-foreground">
          Year view
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-2xl bg-card px-3 py-2">
        <button
          onClick={() => setYear((y) => y - 1)}
          aria-label="Previous year"
          className="grid h-12 w-12 place-items-center rounded-xl text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <p className="font-heading text-[19px] font-semibold text-foreground">{year}</p>
        <button
          onClick={() => setYear((y) => y + 1)}
          aria-label="Next year"
          className="grid h-12 w-12 place-items-center rounded-xl text-foreground"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {MONTH_LABELS.map((label, i) => {
          const month = i + 1;
          const valueCheck = VALUE_CHECK_MONTHS.includes(month);
          return (
            <div key={label} className="rounded-2xl bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-heading text-[17px] font-semibold text-foreground">{label}</p>
                {valueCheck ? (
                  <span className="rounded-full bg-gold px-2.5 py-1 text-[15px] font-semibold text-gold-foreground">
                    Value check
                  </span>
                ) : null}
              </div>
              <ul className="mt-2 space-y-1 text-[15px] leading-snug text-muted-foreground">
                <li>Week 1: Head office ON</li>
                <li>Weeks 1 to 3: site IN, weekly</li>
                <li>Week 4: site ON, per site</li>
                <li>Every Friday: Head office IN</li>
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