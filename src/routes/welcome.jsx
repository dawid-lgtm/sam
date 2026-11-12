import { createFileRoute, Link } from "@tanstack/react-router";
import { RaptortechCredit } from "@/components/RaptortechCredit";

const HERO = "https://base44.app/api/apps/6af15b436d05108c2128035d/files/mp/public/6af15b436d05108c2128035d/7892daf24_sam-hero-aeroplane.jpg";

// Programs this person has been enrolled into.
const ENROLLED = [
  { name: "Managing Strategy", note: "Part of the Mine in a Box™ product suite" },
];

export const Route = createFileRoute("/welcome")({ ssr: false, component: Welcome });

function Welcome() {
  const search = Route.useSearch();
  const returnTo = typeof search?.returnTo === "string" ? search.returnTo : undefined;
  return (
    <div className="relative flex min-h-screen flex-col bg-[#2c4775] text-white">
      <header className="px-6 pt-10">
        <p className="font-serif text-5xl font-semibold tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>Sam</p>
        <p className="mt-1 text-base" style={{ color: "#e2ad2f" }}>Mine in a box™</p>
      </header>
      {/* Hero, cropped just below the girl and plane: no mountains */}
      <div className="mx-auto mt-6 w-full max-w-[900px] flex-1 flex items-center">
        <div
          className="relative w-full"
          style={{ aspectRatio: "1.45", backgroundImage: `url('${HERO}')`, backgroundSize: "150% auto", backgroundPosition: "80% 18%", backgroundRepeat: "no-repeat" }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(44,71,117,0.9) 0%, rgba(44,71,117,0) 18%, rgba(44,71,117,0) 80%, rgba(44,71,117,1) 100%), linear-gradient(90deg, rgba(44,71,117,1) 0%, rgba(44,71,117,0) 14%, rgba(44,71,117,0) 86%, rgba(44,71,117,1) 100%)" }} />
        </div>
      </div>
      <main className="mx-auto w-full max-w-md px-6 pb-14">
        <h1 className="text-3xl font-semibold leading-tight" style={{ fontFamily: "Fraunces, serif" }}>
          Your site, your shift, one place.
        </h1>
        <p className="mt-3 text-lg text-white/90">Strategy, plans and meetings for site leaders.</p>
        <div className="mt-6 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
          <p className="text-sm font-semibold" style={{ color: "#e2ad2f" }}>You are enrolled in</p>
          <ul className="mt-2 space-y-2">
            {ENROLLED.map((program) => (
              <li key={program.name}>
                <p className="text-lg font-semibold">{program.name}</p>
                <p className="text-sm text-white/80">{program.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <Link
          to="/login"
          search={returnTo ? { returnTo } : undefined}
          className="mt-8 block w-full rounded-xl py-4 text-center text-lg font-semibold"
          style={{ backgroundColor: "#e2ad2f", color: "#2c4775" }}
        >
          Log in
        </Link>
        <p className="mt-6 text-center text-sm text-white/80">Invite only · Mine in a box™</p>
        <RaptortechCredit className="mt-2 text-white/70" />
      </main>
    </div>
  );
}