import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { LogOut, Users } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ButtonHints } from "@/components/ButtonHints";
import { RaptortechCredit } from "@/components/RaptortechCredit";

export function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <ButtonHints />
      <header className="sticky top-0 z-30 bg-background">
        <div className="relative mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 shrink-0 place-items-center rounded-xl bg-gold px-3 font-heading text-[18px] font-semibold text-gold-foreground">
              Sam
            </span>
            <div className="min-w-0 leading-tight">
              <p className="whitespace-nowrap text-[15px] text-muted-foreground">Mine in a box™</p>
              <p className="whitespace-nowrap text-[15px] text-muted-foreground">
                Powered by{" "}
                <a
                  href="https://www.raptortech.com.au/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-foreground underline decoration-gold underline-offset-2"
                >
                  Raptortech
                </a>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center">
            <ThemeToggle />
            {user?.role === "admin" ? (
              <Link
                to="/people"
                aria-label="People and access"
                title="People and access — invite people and set their role"
                className="grid h-12 w-12 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <Users className="h-6 w-6" />
              </Link>
            ) : null}
            <button
              onClick={() => logout()}
              aria-label="Sign out"
              title="Sign out of Sam"
              className="grid h-12 w-12 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="relative mx-auto hidden max-w-6xl px-4 md:block">
          <AppNav variant="top" />
        </div>
      </header>

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[34rem]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsl(var(--background) / 0.1) 0%, hsl(var(--background) / 0.35) 55%, hsl(var(--background)) 100%), url('https://base44.app/api/apps/6af15b436d05108c2128035d/files/mp/public/6af15b436d05108c2128035d/7892daf24_sam-hero-aeroplane.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />
        <main className="relative mx-auto w-full max-w-3xl px-4 pb-6 pt-5">{children}</main>
        <footer className="relative mx-auto w-full max-w-3xl px-4 pb-28 md:pb-10">
          <RaptortechCredit />
        </footer>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 md:hidden">
        <AppNav variant="bottom" />
      </div>
    </div>
  );
}