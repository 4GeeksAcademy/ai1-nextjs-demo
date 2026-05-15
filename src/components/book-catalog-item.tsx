import Image from "next/image";
import Link from "next/link";

import type { IBook } from "@/types";

type BookCatalogItemProps = {
  book: IBook;
};

export default function BookCatalogItem({ book }: BookCatalogItemProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/catalog/${book.id}`} className="block">
      <div className="relative h-52 w-full bg-zinc-100">
        <Image
          src={book.cover_img}
          alt={`${book.title} cover`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="space-y-3 p-4">
        <h2 className="line-clamp-2 text-lg font-semibold text-zinc-900">
          {book.title}
        </h2>

        <dl className="space-y-1 text-sm text-zinc-600">
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium text-zinc-500">ISBN</dt>
            <dd className="font-mono text-xs sm:text-sm">{book.isbn}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium text-zinc-500">Added</dt>
            <dd>{book.added.toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>
      </Link>
    </article>
  );
}
