import { ProgressBar, StatusChip } from "@/components/master/bits";
import { shortDate } from "@/lib/raptortechData";

export function RaptortechCustomerCard({ customer }) {
  return (
    <article className="sam-glass p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-heading text-[16px] font-semibold leading-snug">{customer.name}</h3>
          <p className="text-[12px] text-muted-foreground">{customer.site}</p>
        </div>
        <StatusChip status={customer.status} />
      </div>

      <p className="mt-2 text-[13px] font-medium text-gold">{customer.program}</p>

      <div className="mt-2">
        <ProgressBar value={customer.progress} label="Program completion" />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="sam-inset">
          <p className="text-[12px] text-muted-foreground">People in training</p>
          <p className="font-heading text-[16px] font-semibold leading-tight">{customer.people}</p>
        </div>
        <div className="sam-inset">
          <p className="text-[12px] text-muted-foreground">Next session</p>
          <p className="font-heading text-[16px] font-semibold leading-tight">{shortDate(customer.next)}</p>
        </div>
      </div>

      <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
        {customer.lead} · {customer.note}
      </p>
    </article>
  );
}