"use client";

import Link from "next/link";
import { useState } from "react";

import { BookPreview } from "@/components/book";
import {
  createBook,
  getOpenLibraryBookData,
  searchOpenLibraryCatalog,
} from "@/data/actions";
import type { OpenLibraryBookSearchResult } from "@/data/open-library";

export default function NewBookPage() {
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [openLibraryId, setOpenLibraryId] = useState("");
  const [summary, setSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUpBook, setIsLookingUpBook] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<
    OpenLibraryBookSearchResult[]
  >([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !isbn.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createBook(formData);
    } catch (error) {
      console.error("Failed to create book:", error);
      setIsSubmitting(false);
    }
  };

  const handleLookupBook = async () => {
    if (!isbn.trim()) {
      setLookupError("Add an ISBN to look up Open Library data.");
      return;
    }

    setLookupError("");
    setIsLookingUpBook(true);

    try {
      const openLibraryData = await getOpenLibraryBookData(isbn);

      if (!openLibraryData) {
        setLookupError("No Open Library record found for that ISBN.");
        return;
      }

      if (!title.trim() && openLibraryData.title) {
        setTitle(openLibraryData.title);
      }

      if (!summary.trim() && openLibraryData.summary) {
        setSummary(openLibraryData.summary);
      }

      if (!coverImg.trim() && openLibraryData.cover_img) {
        setCoverImg(openLibraryData.cover_img);
      }
    } catch {
      setLookupError("Open Library lookup failed. Try again.");
    } finally {
      setIsLookingUpBook(false);
    }
  };

  const handleSearchOpenLibrary = async () => {
    if (!searchQuery.trim()) {
      setSearchError("Enter a title or author to search Open Library.");
      setSearchResults([]);
      return;
    }

    setSearchError("");
    setIsSearching(true);

    try {
      const results = await searchOpenLibraryCatalog(searchQuery);

      if (!results.length) {
        setSearchError("No matching books found.");
        setSearchResults([]);
        return;
      }

      setSearchResults(results);
    } catch {
      setSearchError("Open Library search failed. Try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = async (
    book: OpenLibraryBookSearchResult,
  ) => {
    setTitle(book.title);
    setIsbn(book.isbn);
    setCoverImg(book.cover_img);
    setOpenLibraryId(book.key);
    setLookupError("");

    setIsLookingUpBook(true);
    try {
      const detailedBook = await getOpenLibraryBookData(book.isbn);

      if (detailedBook?.summary) {
        setSummary(detailedBook.summary);
      } else {
        setSummary("");
      }
    } catch {
      setLookupError("Book selected, but summary lookup failed.");
    } finally {
      setIsLookingUpBook(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <div className="grid w-full gap-8 lg:grid-cols-2">
        {/* Form Column */}
        <section className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-8">
          <header className="mb-8 space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-300/90">
              Library Admin
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
              Add a New Book
            </h1>
            <p className="text-sm text-slate-300">
              Fill out the form and see a live preview of how your book will
              appear.
            </p>
          </header>

          <section className="mb-8 space-y-3 rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300/90">
              Find in Open Library
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-500"
                placeholder="Search by title or author"
              />
              <button
                type="button"
                onClick={handleSearchOpenLibrary}
                disabled={isSearching}
                className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>

            {searchError ? (
              <p className="text-xs text-rose-300">{searchError}</p>
            ) : null}

            {searchResults.length ? (
              <div className="grid gap-2">
                {searchResults.slice(0, 6).map((result) => (
                  <button
                    key={result.key}
                    type="button"
                    onClick={() => handleSelectSearchResult(result)}
                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-left transition hover:border-cyan-500/50 hover:bg-slate-900"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-100">
                        {result.title}
                      </span>
                      <span className="block truncate text-xs text-slate-400">
                        {result.author} • ISBN {result.isbn}
                      </span>
                    </span>
                    <span className="ml-4 shrink-0 text-xs font-semibold text-cyan-300">
                      Use
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="hidden"
              name="open_library_id"
              value={openLibraryId}
            />

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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-500"
                placeholder="978-0-441-47812-5"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLookupBook}
                  disabled={isLookingUpBook}
                  className="inline-flex items-center rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {isLookingUpBook
                    ? "Looking up Open Library..."
                    : "Autofill from Open Library"}
                </button>
                {lookupError ? (
                  <span className="text-xs text-rose-300">{lookupError}</span>
                ) : (
                  <span className="text-xs text-slate-400">
                    Fills empty fields only.
                  </span>
                )}
              </div>
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
                value={coverImg}
                onChange={(e) => setCoverImg(e.target.value)}
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
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-500"
                placeholder="A concise overview of the book (optional)."
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Book"}
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

        {/* Preview Column */}
        <aside className="hidden lg:block">
          <BookPreview
            title={title}
            isbn={isbn}
            coverImg={coverImg}
            summary={summary}
          />
        </aside>
      </div>
    </main>
  );
}
