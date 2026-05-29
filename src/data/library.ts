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
 * Get all genres in a hierarchical tree.
 */
export function getGenres() {
  return libraryAdapter.getAllGenres();
}

/**
 * Find a book by its ID
 */
export function findBookById(id: number) {
  return libraryAdapter.findById(id);
}

/**
 * Get genres assigned to a book.
 */
export function findGenresByBookId(bookId: number) {
  return libraryAdapter.findGenresByBookId(bookId);
}

/**
 * Find a genre by ID.
 */
export function findGenreById(id: number) {
  return libraryAdapter.findGenreById(id);
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
  genreIds?: number[];
}) {
  return libraryAdapter.add(input);
}

/**
 * Replace all genres assigned to a book.
 */
export function setBookGenres(bookId: number, genreIds: number[]) {
  return libraryAdapter.setGenresForBook(bookId, genreIds);
}

/**
 * Create a new genre.
 */
export function addGenreToLibrary(input: {
  name: string;
  cover_img: string;
  description: string;
  parent_genre_id?: number;
}) {
  return libraryAdapter.addGenre(input);
}

/**
 * Update an existing genre.
 */
export function updateGenreInLibrary(input: {
  id: number;
  name: string;
  cover_img: string;
  description: string;
  parent_genre_id?: number;
}) {
  return libraryAdapter.updateGenre(input);
}

/**
 * Delete a genre.
 */
export function deleteGenreFromLibrary(id: number) {
  return libraryAdapter.deleteGenre(id);
}
