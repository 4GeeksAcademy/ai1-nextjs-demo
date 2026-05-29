import Link from "next/link";

import { getGenres } from "@/data/library";
import type { IGenre } from "@/types";

export const dynamic = "force-dynamic";

function GenreTree({ genres }: { genres: IGenre[] }) {
  if (!genres.length) {
    return (
      <p className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-sm text-slate-300">
        No genres yet. Create one to get started.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {genres.map((genre) => (
        <li
          key={genre.id}
          className="rounded-xl border border-slate-700/80 bg-slate-900/70 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-100">
                {genre.name}
              </h2>
              <p className="text-sm text-slate-300">{genre.description}</p>
            </div>
            <Link
              href={`/genres/${genre.id}`}
              className="inline-flex items-center rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Edit
            </Link>
          </div>

          {genre.subgenres && genre.subgenres.length > 0 ? (
            <div className="mt-4 border-l border-slate-700 pl-4">
              <GenreTree genres={genre.subgenres} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function GenresPage() {
  const genres = getGenres();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <section className="w-full">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
              Genres
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Organize your catalog with a genre hierarchy.
            </p>
          </div>

          <Link
            href="/genres/new"
            className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Add Genre
          </Link>
        </header>

        <GenreTree genres={genres} />
      </section>
    </main>
  );
}
