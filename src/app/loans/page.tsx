import Link from "next/link";

import { getActiveLoans } from "@/data/loans";
import { findBookById } from "@/data/library";
import { findFriendById } from "@/data/rolodex";
import { markLoanReturned } from "@/data/actions";

export default function LoansPage() {
  const loans = getActiveLoans();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <div className="w-full space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
              Active Loans
            </h1>
            <p className="text-sm text-slate-300">
              Track which books are currently on loan
            </p>
          </div>
          <Link
            href="/loans/new"
            className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Loan a Book
          </Link>
        </header>

        {/* Loans List */}
        {loans.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-12 text-center shadow-2xl shadow-slate-950/60 backdrop-blur">
            <p className="text-slate-400">No active loans</p>
            <Link
              href="/loans/new"
              className="mt-4 inline-flex items-center text-sm text-cyan-300 hover:text-cyan-200"
            >
              Create your first loan →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {loans.map((loan) => {
              const book = findBookById(loan.bookId);
              const friend = findFriendById(loan.friendId);

              if (!book || !friend) return null;

              const daysSinceLoan = Math.floor(
                (new Date().getTime() - loan.checkedOut.getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <article
                  key={loan.id}
                  className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/40 backdrop-blur transition hover:border-slate-600"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-100">
                          {book.title}
                        </h2>
                        <p className="text-sm text-slate-400">
                          ISBN: {book.isbn}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Borrowed by: </span>
                          <Link
                            href={`/friends/${friend.id}`}
                            className="font-medium text-cyan-300 hover:text-cyan-200"
                          >
                            {friend.name}
                          </Link>
                        </div>
                        <div>
                          <span className="text-slate-400">Checked out: </span>
                          <span className="text-slate-200">
                            {loan.checkedOut.toLocaleDateString()}
                          </span>
                          <span className="ml-2 text-slate-400">
                            ({daysSinceLoan} day{daysSinceLoan !== 1 ? "s" : ""}{" "}
                            ago)
                          </span>
                        </div>
                      </div>
                    </div>

                    <form
                      action={async () => {
                        "use server";
                        await markLoanReturned(loan.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
                      >
                        Mark Returned
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
