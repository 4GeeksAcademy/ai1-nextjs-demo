import BookCatalogHeader from "./book-catalog-header";
import BookCatalogItem from "./book-catalog-item";

import type { LibraryType } from "@/types";

type BookCatalogProps = {
  books: LibraryType;
};

export default function BookCatalog({ books }: BookCatalogProps) {
  return (
    <section className="w-full">
      <BookCatalogHeader />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCatalogItem key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
