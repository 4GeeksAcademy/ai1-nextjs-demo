import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateBookGenres } from "@/data/actions";
import { findBookById, getGenres } from "@/data/library";
import type { IGenre } from "@/types";

type BookPageProps = {
  params: Promise<{ id: string }>;
};

type FlatGenreOption = {
  id: number;
  name: string;
  level: number;
};

function flattenGenres(genres: IGenre[], level = 0): FlatGenreOption[] {
  return genres.flatMap((genre) => {
    const current: FlatGenreOption = {
      id: genre.id,
      name: genre.name,
      level,
    };

    const children = genre.subgenres
      ? flattenGenres(genre.subgenres, level + 1)
      : [];

    return [current, ...children];
  });
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (!Number.isInteger(bookId)) {
    notFound();
  }

  const book = findBookById(bookId);
  const genreOptions = flattenGenres(getGenres());
  const selectedGenreIds = new Set(
    (book?.genres ?? []).map((genre) => genre.id),
  );

  if (!book) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <article className="grid w-full gap-8 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur md:grid-cols-[320px_1fr] md:gap-10 md:p-8">
        <div className="relative mx-auto w-full max-w-80 overflow-hidden rounded-xl bg-slate-800">
          <Image
            src={book.cover_img}
            alt={`${book.title} cover`}
            width={640}
            height={960}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-300/90">
              Book Detail
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              {book.title}
            </h1>
          </div>

          <p className="text-base leading-7 text-slate-300">{book.summary}</p>

          <dl className="grid gap-4 rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-sm text-slate-300 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-400">Book ID</dt>
              <dd className="mt-1">{book.id}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-400">ISBN</dt>
              <dd className="mt-1 font-mono">{book.isbn}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-400">Added</dt>
              <dd className="mt-1">{book.added.toLocaleDateString()}</dd>
            </div>
          </dl>

          <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-slate-100">Genres</h2>
              <p className="text-xs text-slate-400">
                Assign one or more genres to this book.
              </p>
            </div>

            <form action={updateBookGenres} className="space-y-3">
              <input type="hidden" name="book_id" value={book.id} />

              {genreOptions.length ? (
                <div className="grid max-h-56 gap-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                  {genreOptions.map((genre) => (
                    <label
                      key={genre.id}
                      className="flex items-center gap-2 text-sm text-slate-200"
                      style={{ paddingLeft: `${genre.level * 14}px` }}
                    >
                      <input
                        type="checkbox"
                        name="genre_ids"
                        value={genre.id}
                        defaultChecked={selectedGenreIds.has(genre.id)}
                        className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-cyan-400 focus:ring-cyan-500"
                      />
                      <span>{genre.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No genres available yet.
                </p>
              )}

              <button
                type="submit"
                className="inline-flex items-center rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Save Genres
              </button>
            </form>
          </section>

          <Link
            href="/catalog"
            className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Catalog
          </Link>
        </div>
      </article>
    </main>
  );
}
