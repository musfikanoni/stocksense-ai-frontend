// Temporary home page for Step 1. Step 2 replaces this with the real landing page.
type Step = { name: string; done: boolean };

const steps: Step[] = [
  { name: "Project setup and theme", done: true },
  { name: "Landing page, login and sign up", done: false },
  { name: "Dashboard and watchlist", done: false },
  { name: "Stock detail page with chart", done: false },
  { name: "AI summary and price alerts", done: false },
  { name: "Admin view", done: false },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <div>
        <h1 className="text-4xl font-bold sm:text-5xl">
          Stock<span className="text-gold">Sense</span>
        </h1>
        <p className="mt-3 max-w-prose text-mute">
          Setup works. The black and gold theme from the Figma design is
          ready to use on every page.
        </p>
      </div>

      <section className="card">
        <h2 className="mb-4 text-lg font-semibold">Build progress</h2>
        <ul className="space-y-2">
          {steps.map((s) => (
            <li key={s.name} className="flex items-center gap-3 text-sm">
              <span className={s.done ? "text-up" : "text-mute"}>
                {s.done ? "Done" : "To do"}
              </span>
              <span>{s.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <div>
        <button className="btn-gold">Get started</button>
      </div>
    </main>
  );
}
