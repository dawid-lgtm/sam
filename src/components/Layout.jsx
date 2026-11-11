import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { LogOut, Users } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background">
        <div className="relative mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold font-heading text-[18px] font-semibold text-gold-foreground">
              S
            </span>
            <div className="min-w-0 leading-tight">
              <p className="font-heading text-[19px] font-semibold text-foreground">Sam</p>
              <p className="whitespace-nowrap text-[15px] text-muted-foreground">Mine in a box™</p>
              <p className="whitespace-nowrap text-[13px] text-muted-foreground/80">Powered by Raptortech</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center">
            <ThemeToggle />
            {user?.role === "admin" ? (
              <Link
                to="/people"
                aria-label="People and access"
                className="grid h-12 w-12 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <Users className="h-6 w-6" />
              </Link>
            ) : null}
            <button
              onClick={() => logout()}
              aria-label="Sign out"
              className="grid h-12 w-12 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="relative mx-auto hidden max-w-3xl px-4 md:block">
          <AppNav variant="top" />
        </div>
      </header>

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(var(--background) / 0.74) 0%, hsl(var(--background) / 0.9) 55%, hsl(var(--background)) 100%), url('https://base44.app/api/apps/6af15b436d05108c2128035d/files/mp/public/6af15b436d05108c2128035d/7892daf24_sam-hero-aeroplane.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <main className="relative mx-auto w-full max-w-3xl px-4 pb-6 pt-5">{children}</main>
        <footer className="relative mx-auto w-full max-w-3xl px-4 pb-28 md:pb-10">
          <p className="text-center text-[15px] text-muted-foreground">Powered by Raptortech</p>
        </footer>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 md:hidden">
        <AppNav variant="bottom" />
      </div>
    </div>
  );
}