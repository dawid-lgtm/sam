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
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gold font-heading text-[24px] font-semibold text-gold-foreground">
            S
          </div>
          <p className="font-heading text-[38px] font-semibold leading-none">Sam</p>
          <p className="mt-1 text-[15px] font-semibold text-gold">Mine in a box™</p>
          <h1 className="mt-7 flex items-center justify-center gap-2 font-heading text-[26px] font-semibold tracking-tight">
            {Icon ? <Icon className="h-6 w-6 text-gold" aria-hidden="true" /> : null}
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-[15px] text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-lg sm:p-8">{children}</div>
        {footer && <p className="mt-6 text-center text-[15px] text-muted-foreground">{footer}</p>}
        <p className="mt-4 text-center text-[15px] text-muted-foreground">Powered by Raptortech</p>
      </div>
    </div>
  );
}