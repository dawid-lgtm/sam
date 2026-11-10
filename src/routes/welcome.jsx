import { createFileRoute, Link } from "@tanstack/react-router";

const HERO = "https://media.base44.com/images/public/6af15b436d05108c2128035d/0dc42b8b1_sam-hero.jpg";

export const Route = createFileRoute("/welcome")({ ssr: false, component: Welcome });

function Welcome() {
  const search = Route.useSearch();
  const returnTo = typeof search?.returnTo === "string" ? search.returnTo : undefined;
  return (
    <div
      className="relative flex min-h-screen flex-col justify-between bg-cover bg-center text-white"
      style={{ backgroundImage: `linear-gradient(180deg, rgba(44,71,117,0.55) 0%, rgba(44,71,117,0.25) 40%, rgba(20,32,56,0.9) 100%), url('${HERO}')` }}
    >
      <header className="px-6 pt-10">
        <p className="font-serif text-5xl font-semibold tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>Sam</p>
        <p className="mt-1 text-base" style={{ color: "#e2ad2f" }}>Mine in a box™</p>
      </header>
      <main className="mx-auto w-full max-w-md px-6 pb-14">
        <h1 className="text-3xl font-semibold leading-tight" style={{ fontFamily: "Fraunces, serif" }}>
          Your site, your shift, one place.
        </h1>
        <p className="mt-3 text-lg text-white/90">Strategy, plans and meetings for site leaders.</p>
        <Link
          to="/login"
          search={returnTo ? { returnTo } : undefined}
          className="mt-8 block w-full rounded-xl py-4 text-center text-lg font-semibold"
          style={{ backgroundColor: "#e2ad2f", color: "#2c4775" }}
        >
          Log in
        </Link>
        <p className="mt-6 text-center text-sm text-white/80">Invite only · Test data · Mine in a box™</p>
      </main>
    </div>
  );
}
