// Full-screen card shared by the auth pages; it sets its own color tokens so it stays readable under any theme.
export function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2c4775] bg-no-repeat px-4 py-8 text-foreground" style={{ backgroundImage: "linear-gradient(180deg, rgba(44,71,117,0.55) 0%, rgba(20,32,56,0.8) 100%), url('https://media.base44.com/images/public/6af15b436d05108c2128035d/0dc42b8b1_sam-hero.jpg')", backgroundSize: "100% 100%, min(100%, 900px) auto", backgroundPosition: "center, center 35%", backgroundRepeat: "no-repeat" }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-heading text-5xl font-semibold text-white">Sam</p>
          <p className="mb-6 mt-1 text-base" style={{ color: "#e2ad2f" }}>Mine in a box™</p>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-sm">{children}</div>
        {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
      </div>
    </div>
  );
}
