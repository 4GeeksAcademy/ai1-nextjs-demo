import Link from "next/link";
import { redirect } from "next/navigation";

import { addBookToLibrary } from "@/data/library";

async function createBook(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const isbn = String(formData.get("isbn") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const cover_img = String(formData.get("cover_img") ?? "").trim();

  if (!title || !isbn || !summary) {
    return;
  }

  const book = addBookToLibrary({
    title,
    isbn,
    summary,
    cover_img,
  });

  redirect(`/catalog/${book.id}`);
}

export default function NewBookPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <section className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-8">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-300/90">
            Library Admin
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Add a New Book
          </h1>
          <p className="text-sm text-slate-300">
            This currently saves to an in-memory store. We can swap this to a
            database-backed repository later without changing the form.
          </p>
        </header>

        <form action={createBook} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-slate-200"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
              placeholder="The Left Hand of Darkness"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="isbn"
              className="text-sm font-medium text-slate-200"
            >
              ISBN
            </label>
            <input
              id="isbn"
              name="isbn"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-500"
              placeholder="978-0-441-47812-5"
            />
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
              placeholder="https://placehold.co/640x960.png?text=Book+Cover"
            />
            <p className="text-xs text-slate-400">
              Optional. If left empty, a placehold.co image is used.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="summary"
              className="text-sm font-medium text-slate-200"
            >
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              required
              rows={5}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
              placeholder="A concise overview of the book."
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Save Book
            </button>
            <Link
              href="/catalog"
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
