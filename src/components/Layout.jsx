import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { LogOut, Users } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const company = "Ridgeback Minerals (test)";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold font-heading text-[18px] font-semibold text-gold-foreground">
              S
            </span>
            <div className="min-w-0 leading-tight">
              <p className="font-heading text-[19px] font-semibold text-foreground">Sam</p>
              <p className="text-[15px] text-muted-foreground">{company}</p>
              <p className="text-[15px] text-muted-foreground">Mine in a box™</p>
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
        <div className="mx-auto hidden max-w-3xl px-4 md:block">
          <AppNav variant="top" />
        </div>
      </header>

      <div className="bg-gold">
        <p className="mx-auto max-w-3xl px-4 py-2 text-center text-[15px] font-medium text-gold-foreground">
          Test data: sample sites, people and numbers
        </p>
      </div>

      <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-5 md:pb-12">{children}</main>

      <div className="fixed inset-x-0 bottom-0 z-30 md:hidden">
        <AppNav variant="bottom" />
      </div>
    </div>
  );
}