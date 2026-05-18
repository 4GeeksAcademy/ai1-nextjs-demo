import Link from "next/link";

export default function BookCatalogHeader() {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          My Catalog
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          All books currently available for lending.
        </p>
      </div>

      <Link
        href="/catalog/new"
        className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Add Book
      </Link>
    </header>
  );
}
