import type { IBook } from "@/types";

export type NewBookInput = {
  title: string;
  isbn: string;
  cover_img: string;
  open_library_id?: string;
  summary: string;
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
   * Find a book by its ID
   */
  findById(id: number): IBook | undefined;

  /**
   * Add a new book to the library
   */
  add(input: NewBookInput): IBook;
}
