export const RAPTORTECH_URL = "https://www.raptortech.com.au/";

export function RaptortechCredit({ className = "" }) {
  return (
    <p className={`text-center text-[15px] text-muted-foreground ${className}`}>
      Powered by{" "}
      <a
        href={RAPTORTECH_URL}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-gold underline decoration-gold underline-offset-2 transition hover:opacity-80"
      >
        Raptortech
      </a>
    </p>
  );
}