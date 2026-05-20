import Link from "next/link";

import { createFriend } from "@/data/actions";

export default function NewFriendPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <section className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-8">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-300/90">
            Rolodex Admin
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Add a New Friend
          </h1>
          <p className="text-sm text-slate-300">
            This currently saves to an in-memory store. We can swap this to a
            database-backed repository later without changing the form.
          </p>
        </header>

        <form action={createFriend} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-200"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-slate-200"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
              placeholder="john.doe@email.com"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Save Friend
            </button>
            <Link
              href="/friends"
              className="inline-flex items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
