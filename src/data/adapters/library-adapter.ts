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
  getAll(): Promise<IBook[]>;

  /**
   * Get all genres as a hierarchical tree.
   */
  getAllGenres(): Promise<IGenre[]>;

  /**
   * Find a book by its ID
   */
  findById(id: number): Promise<IBook | undefined>;

  /**
   * Find all genres assigned to a specific book.
   */
  findGenresByBookId(bookId: number): Promise<IGenre[]>;

  /**
   * Find a genre by its ID.
   */
  findGenreById(id: number): Promise<IGenre | undefined>;

  /**
   * Add a new book to the library
   */
  add(input: NewBookInput): Promise<IBook>;

  /**
   * Replace all assigned genres for a specific book.
   */
  setGenresForBook(bookId: number, genreIds: number[]): Promise<IGenre[]>;

  /**
   * Create a new genre.
   */
  addGenre(input: NewGenreInput): Promise<IGenre>;

  /**
   * Update an existing genre.
   */
  updateGenre(input: UpdateGenreInput): Promise<IGenre | undefined>;

  /**
   * Delete a genre by ID.
   */
  deleteGenre(id: number): Promise<boolean>;
}
