import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { LogOut, Users } from "lucide-react";
import { AppNav } from "@/components/AppNav";

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const company = "Ridgeback Minerals (test)";

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-sm font-bold text-white">
              S
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-semibold text-navy">Sam</p>
              <p className="text-xs text-muted-foreground">{company}</p>
            </div>
          </div>
          <div className="flex items-center">
            {user?.role === "admin" ? (
              <Link
                to="/people"
                aria-label="People and access"
                className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-navy"
              >
                <Users className="h-5 w-5" />
              </Link>
            ) : null}
            <button
              onClick={() => logout()}
              aria-label="Sign out"
              className="grid h-11 w-11 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-navy"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mx-auto hidden max-w-3xl px-4 md:block">
          <AppNav variant="top" />
        </div>
      </header>

      <div className="bg-gold/15">
        <p className="mx-auto max-w-3xl px-4 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a6114]">
          Test data — sample sites, people and numbers
        </p>
      </div>

      <main className="mx-auto w-full max-w-3xl px-4 pb-32 pt-5 md:pb-16">{children}</main>

      <div className="fixed inset-x-0 bottom-0 z-30 md:hidden">
        <AppNav variant="bottom" />
      </div>
    </div>
  );
}