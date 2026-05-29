import Link from "next/link";

import { getActiveLoans } from "@/data/loans";
import { LoanListItem } from "@/components";

export default async function LoansPage() {
  const loans = await getActiveLoans();

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
            {loans.map((loan) => (
              <LoanListItem key={loan.id} loan={loan} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
