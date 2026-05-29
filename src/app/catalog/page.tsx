import { BookCatalog } from "@/components";
import { getLibrary } from "@/data/library";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const library = await getLibrary();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <BookCatalog books={library} />
    </main>
  );
}
