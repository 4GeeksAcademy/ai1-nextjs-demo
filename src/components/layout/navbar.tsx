import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-slate-100 transition hover:text-cyan-300"
        >
          Next.js Demo
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/catalog"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-300"
          >
            Catalog
          </Link>
          <Link
            href="/catalog/new"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-300"
          >
            Add Book
          </Link>
          <Link
            href="/genres"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-300"
          >
            Genres
          </Link>
          <Link
            href="/genres/new"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-300"
          >
            Add Genre
          </Link>
          <Link
            href="/friends"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-300"
          >
            Friends
          </Link>
          <Link
            href="/friends/new"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-300"
          >
            Add Friend
          </Link>
          <Link
            href="/loans"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-300"
          >
            Loans
          </Link>
          <Link
            href="/loans/new"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-300"
          >
            Loan Book
          </Link>
        </div>
      </div>
    </nav>
  );
}
