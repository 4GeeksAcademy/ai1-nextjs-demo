import Link from "next/link";

import { createGenre } from "@/data/actions";
import { getGenres } from "@/data/library";
import type { IGenre } from "@/types";

export const dynamic = "force-dynamic";

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

export default async function NewGenrePage() {
  const genres = await getGenres();
  const parentOptions = flattenGenres(genres);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <section className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-8">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-300/90">
            Catalog Admin
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Create Genre
          </h1>
          <p className="text-sm text-slate-300">
            Add top-level genres or nest subgenres under existing categories.
          </p>
        </header>

        <form action={createGenre} className="space-y-5">
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
              placeholder="Cyberpunk"
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
              defaultValue=""
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
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
              placeholder="https://placehold.co/640x960.png?text=Genre"
            />
            <p className="text-xs text-slate-400">
              Optional. A default cover image is used when left empty.
            </p>
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
              rows={4}
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
              placeholder="High-tech, low-life speculative fiction."
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Save Genre
            </button>
            <Link
              href="/genres"
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
