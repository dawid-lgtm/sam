import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`sam-glass mb-3 inline-flex min-h-[48px] items-center gap-2 rounded-xl px-3.5 text-[15px] font-semibold text-foreground transition hover:ring-2 hover:ring-gold ${className}`}
    >
      <ArrowLeft className="h-5 w-5 text-gold" />
      {children}
    </Link>
  );
}