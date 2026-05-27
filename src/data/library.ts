import { DatabaseLibraryAdapter } from "./adapters/database-library-adapter";
import type { LibraryAdapter } from "./adapters/library-adapter";

/**
 * The library adapter instance. Can be swapped with different implementations
 * (e.g., InMemoryLibraryAdapter) without changing consuming code.
 */
const libraryAdapter: LibraryAdapter = new DatabaseLibraryAdapter();

/**
 * Get all books in the library
 */
export function getLibrary() {
  return libraryAdapter.getAll();
}

/**
 * Find a book by its ID
 */
export function findBookById(id: number) {
  return libraryAdapter.findById(id);
}

/**
 * Add a new book to the library
 */
export function addBookToLibrary(input: {
  title: string;
  isbn: string;
  cover_img: string;
  open_library_id?: string;
  summary: string;
}) {
  return libraryAdapter.add(input);
}
