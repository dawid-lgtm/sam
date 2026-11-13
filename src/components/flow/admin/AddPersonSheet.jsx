import { Frame, MockCard, MockField, MockPill, MockRow, MockTap } from "@/components/flow/MockScreen";

// Tapping "People and roles" opens this sheet. The role cannot be skipped, and direct reports are asked for here.
export function AddPersonSheet() {
  return (
    <Frame label="Home · Administrator">
      <MockCard title="What you need to do next" note="1 · Load your people">
        <p className="text-muted-foreground">People and roles · 2 of 9 added</p>
      </MockCard>

      <div className="sam-glass rounded-xl p-2.5 ring-1 ring-gold">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold text-gold">Add a person</p>
          <span className="text-[13px] text-muted-foreground">×</span>
        </div>
        <div className="mt-1.5 space-y-1.5">
          <MockField label="Name" value="Mike Tau" />
          <MockField label="Email" value="mike.tao@mms.com.au" />
          <div>
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              Site <MockPill>required</MockPill>
            </p>
            <p className="rounded-lg bg-background px-2 py-1.5 text-[13px]">Kestrel Underground ▾</p>
            <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
              The dropdown holds only the sites set up for this customer, so nobody can be added to a site that was
              never set up. Sam will not save a person without one.
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              Role <MockPill>required</MockPill>
            </p>
            <p className="rounded-lg bg-background px-2 py-1.5 text-[13px]">Program manager ▾</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              The role decides what he can change. Sam will not save without it, and the invite email tells him what
              he is.
            </p>
          </div>
          <MockField label="Reports to" value="Sarah Bell · GM Ops" />
          <MockRow arrow>Direct reports · none added yet</MockRow>
        </div>
        <div className="mt-1.5 space-y-1">
          <MockTap>Save</MockTap>
          <p className="text-[12px] leading-snug text-muted-foreground">
            Saving adds him to your people list, on that site. His invite goes out with the workshop invite in Step 2,
            not now.
          </p>
        </div>
      </div>

      <MockRow arrow>See the org chart as it stands</MockRow>
    </Frame>
  );
}