import Image from "next/image";
import Link from "next/link";

import type { IBook } from "@/types";

type BookCatalogItemProps = {
  book: IBook;
};

export default function BookCatalogItem({ book }: BookCatalogItemProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/75 shadow-lg shadow-slate-950/40 transition hover:border-cyan-500/50 hover:shadow-cyan-950/30">
      <Link href={`/catalog/${book.id}`} className="block">
        <div className="relative h-52 w-full bg-slate-800">
          <Image
            src={book.cover_img}
            alt={`${book.title} cover`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="space-y-3 p-4">
          <h2 className="line-clamp-2 text-lg font-semibold text-slate-100">
            {book.title}
          </h2>

          <dl className="space-y-1 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <dt className="font-medium text-slate-400">ISBN</dt>
              <dd className="font-mono text-xs sm:text-sm">{book.isbn}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="font-medium text-slate-400">Added</dt>
              <dd>{book.added.toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}
