import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
          Library Tracker
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          Track every book you loan
        </h1>
        <p className="mt-3 text-slate-300">
          Start by browsing your catalog, then connect each title to a friend
          and a loan date.
        </p>

        <Link
          href="/catalog"
          className="mt-8 inline-flex items-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
        >
          Open catalog
        </Link>
      </section>
    </main>
  );
}
