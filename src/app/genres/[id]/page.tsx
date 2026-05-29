import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteGenre, updateGenre } from "@/data/actions";
import { findGenreById, getGenres } from "@/data/library";
import type { IGenre } from "@/types";
import ConfirmDeleteGenreButton from "./confirm-delete-genre-button";

export const dynamic = "force-dynamic";

type GenrePageProps = {
  params: Promise<{ id: string }>;
};

type FlatGenreOption = {
  id: number;
  label: string;
};

function flattenGenres(genres: IGenre[], prefix = ""): FlatGenreOption[] {
  return genres.flatMap((genre) => {
    const current: FlatGenreOption = {
      id: genre.id,
      label: `${prefix}${genre.name}`,
    };

    const children = genre.subgenres
      ? flattenGenres(genre.subgenres, `${prefix}${genre.name} / `)
      : [];

    return [current, ...children];
  });
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { id } = await params;
  const genreId = Number(id);

  if (!Number.isInteger(genreId)) {
    notFound();
  }

  const genre = findGenreById(genreId);

  if (!genre) {
    notFound();
  }

  const genres = getGenres();
  const parentOptions = flattenGenres(genres).filter(
    (option) => option.id !== genre.id,
  );

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <section className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-8">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-300/90">
            Genre Detail
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Edit Genre
          </h1>
          <p className="text-sm text-slate-300">
            Update naming, hierarchy, and description for this genre.
          </p>
        </header>

        <form action={updateGenre} className="space-y-5">
          <input type="hidden" name="id" value={genre.id} />

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
              defaultValue={genre.name}
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="parent_genre_id"
              className="text-sm font-medium text-slate-200"
            >
              Parent Genre
            </label>
            <select
              id="parent_genre_id"
              name="parent_genre_id"
              defaultValue={genre.parent_genre_id?.toString() ?? ""}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
            >
              <option value="">None (Top-level genre)</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="cover_img"
              className="text-sm font-medium text-slate-200"
            >
              Cover Image URL
            </label>
            <input
              id="cover_img"
              name="cover_img"
              type="url"
              defaultValue={genre.cover_img}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-200"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={genre.description}
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Save Changes
            </button>

            <ConfirmDeleteGenreButton
              formAction={deleteGenre}
              className="inline-flex items-center rounded-lg border border-rose-500/60 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-950/40"
            />

            <Link
              href="/genres"
              className="inline-flex items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Back to Genres
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
