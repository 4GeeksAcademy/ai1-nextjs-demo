import { dataProvider } from "./adapters/provider";
import type { LibraryAdapter } from "./adapters/library-adapter";

/**
 * The library adapter instance. Can be swapped with different implementations
 * (e.g., InMemoryLibraryAdapter) without changing consuming code.
 */
let libraryAdapterPromise: Promise<LibraryAdapter> | null = null;

async function getLibraryAdapter() {
  if (!libraryAdapterPromise) {
    libraryAdapterPromise =
      dataProvider === "postgres"
        ? import("./adapters/postgres-library-adapter").then(
            ({ PostgresLibraryAdapter }) => new PostgresLibraryAdapter(),
          )
        : import("./adapters/database-library-adapter").then(
            ({ DatabaseLibraryAdapter }) => new DatabaseLibraryAdapter(),
          );
  }

  return libraryAdapterPromise;
}

/**
 * Get all books in the library
 */
export async function getLibrary() {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.getAll();
}

/**
 * Get all genres in a hierarchical tree.
 */
export async function getGenres() {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.getAllGenres();
}

/**
 * Find a book by its ID
 */
export async function findBookById(id: number) {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.findById(id);
}

/**
 * Get genres assigned to a book.
 */
export async function findGenresByBookId(bookId: number) {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.findGenresByBookId(bookId);
}

/**
 * Find a genre by ID.
 */
export async function findGenreById(id: number) {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.findGenreById(id);
}

/**
 * Add a new book to the library
 */
export async function addBookToLibrary(input: {
  title: string;
  isbn: string;
  cover_img: string;
  open_library_id?: string;
  summary: string;
  genreIds?: number[];
}) {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.add(input);
}

/**
 * Replace all genres assigned to a book.
 */
export async function setBookGenres(bookId: number, genreIds: number[]) {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.setGenresForBook(bookId, genreIds);
}

/**
 * Create a new genre.
 */
export async function addGenreToLibrary(input: {
  name: string;
  cover_img: string;
  description: string;
  parent_genre_id?: number;
}) {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.addGenre(input);
}

/**
 * Update an existing genre.
 */
export async function updateGenreInLibrary(input: {
  id: number;
  name: string;
  cover_img: string;
  description: string;
  parent_genre_id?: number;
}) {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.updateGenre(input);
}

/**
 * Delete a genre.
 */
export async function deleteGenreFromLibrary(id: number) {
  const libraryAdapter = await getLibraryAdapter();
  return libraryAdapter.deleteGenre(id);
}
