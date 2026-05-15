import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Library Tracker
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Track every book you loan
        </h1>
        <p className="mt-3 text-zinc-600">
          Start by browsing your catalog, then connect each title to a friend
          and a loan date.
        </p>

        <Link
          href="/catalog"
          className="mt-8 inline-flex items-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Open catalog
        </Link>
      </section>
    </main>
  );
}
