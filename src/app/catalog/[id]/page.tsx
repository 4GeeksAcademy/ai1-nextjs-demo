import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { library } from "@/data/library";

type BookPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (!Number.isInteger(bookId)) {
    notFound();
  }

  const book = library.find((entry) => entry.id === bookId);

  if (!book) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <article className="grid w-full gap-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-[320px_1fr] md:gap-10 md:p-8">
        <div className="relative mx-auto w-full max-w-80 overflow-hidden rounded-xl bg-zinc-100">
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
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Book Detail
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {book.title}
            </h1>
          </div>

          <p className="text-base leading-7 text-zinc-700">
            {book.summary}
          </p>

          <dl className="grid gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-zinc-500">Book ID</dt>
              <dd className="mt-1">{book.id}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">ISBN</dt>
              <dd className="mt-1 font-mono">{book.isbn}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Added</dt>
              <dd className="mt-1">{book.added.toLocaleDateString()}</dd>
            </div>
          </dl>

          <Link
            href="/catalog"
            className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Back to Catalog
          </Link>
        </div>
      </article>
    </main>
  );
}
