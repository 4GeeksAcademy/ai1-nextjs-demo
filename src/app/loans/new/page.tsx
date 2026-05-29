import Link from "next/link";

import { getLibrary } from "@/data/library";
import { getRolodex } from "@/data/rolodex";
import { loanBook } from "@/data/actions";

export default async function NewLoanPage() {
  const books = await getLibrary();
  const friends = await getRolodex();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <section className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-8">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-300/90">
            Loan Management
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Loan a Book
          </h1>
          <p className="text-sm text-slate-300">
            Select a friend and a book to create a new loan.
          </p>
        </header>

        <form action={loanBook} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="friendId"
              className="text-sm font-medium text-slate-200"
            >
              Friend
            </label>
            <select
              id="friendId"
              name="friendId"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
            >
              <option value="">Select a friend...</option>
              {friends.map((friend) => (
                <option key={friend.id} value={friend.id}>
                  {friend.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400">
              Choose the friend who will borrow the book
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="bookId"
              className="text-sm font-medium text-slate-200"
            >
              Book
            </label>
            <select
              id="bookId"
              name="bookId"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
            >
              <option value="">Select a book...</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400">
              Choose the book to loan out
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Create Loan
            </button>
            <Link
              href="/loans"
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
