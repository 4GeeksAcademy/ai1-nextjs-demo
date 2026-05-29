import type { IBook, IGenre } from "@/types";

export type NewBookInput = {
  title: string;
  isbn: string;
  cover_img: string;
  open_library_id?: string;
  summary: string;
  genreIds?: number[];
};

export type NewGenreInput = {
  name: string;
  cover_img: string;
  description: string;
  parent_genre_id?: number;
};

export type UpdateGenreInput = {
  id: number;
  name: string;
  cover_img: string;
  description: string;
  parent_genre_id?: number;
};

/**
 * LibraryAdapter interface defines the contract for library data operations.
 * Implementations can use in-memory storage, databases, APIs, etc.
 */
export interface LibraryAdapter {
  /**
   * Get all books in the library
   */
  getAll(): IBook[];

  /**
   * Get all genres as a hierarchical tree.
   */
  getAllGenres(): IGenre[];

  /**
   * Find a book by its ID
   */
  findById(id: number): IBook | undefined;

  /**
   * Find all genres assigned to a specific book.
   */
  findGenresByBookId(bookId: number): IGenre[];

  /**
   * Find a genre by its ID.
   */
  findGenreById(id: number): IGenre | undefined;

  /**
   * Add a new book to the library
   */
  add(input: NewBookInput): IBook;

  /**
   * Replace all assigned genres for a specific book.
   */
  setGenresForBook(bookId: number, genreIds: number[]): IGenre[];

  /**
   * Create a new genre.
   */
  addGenre(input: NewGenreInput): IGenre;

  /**
   * Update an existing genre.
   */
  updateGenre(input: UpdateGenreInput): IGenre | undefined;

  /**
   * Delete a genre by ID.
   */
  deleteGenre(id: number): boolean;
}
