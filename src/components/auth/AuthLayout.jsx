import { AuthTagline } from "@/components/auth/AuthTagline";
import { RaptortechCredit } from "@/components/RaptortechCredit";
import { Image } from "@/components/ui/image";
import { BRAND_MARK } from "@/lib/brand";

// Full-screen card shared by the auth pages. It sets its own color tokens so it stays readable under any theme.
export function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background bg-no-repeat px-4 py-8 text-foreground"
      style={{
        backgroundImage:
          "linear-gradient(180deg, hsl(var(--background) / 0.72) 0%, hsl(var(--background) / 0.95) 100%), url('https://media.base44.com/images/public/6af15b436d05108c2128035d/0dc42b8b1_sam-hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 35%",
      }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full bg-gold p-[3px] shadow-lg">
            <Image src={BRAND_MARK} alt="Sam" className="h-full w-full rounded-full" />
          </div>
          <p className="font-heading text-[38px] font-semibold leading-none">Sam</p>
          <p className="mt-1 text-[15px] font-semibold text-gold">Mine-In-A-Box™</p>
          <AuthTagline />
          <h1 className="mt-2 flex items-center justify-center gap-2 font-heading text-[26px] font-semibold tracking-tight">
            {Icon ? <Icon className="h-6 w-6 text-gold" aria-hidden="true" /> : null}
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-[15px] text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-lg sm:p-8">{children}</div>
        {footer && <p className="mt-6 text-center text-[15px] text-muted-foreground">{footer}</p>}
        <RaptortechCredit className="mt-4" />
      </div>
    </div>
  );
}