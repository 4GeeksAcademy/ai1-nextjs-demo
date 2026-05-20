import type { ILoan } from "@/types";

export type NewLoanInput = {
  friendId: number;
  bookId: number;
};

/**
 * LoanAdapter interface defines the contract for loan data operations.
 * Implementations can use in-memory storage, databases, APIs, etc.
 */
export interface LoanAdapter {
  /**
   * Get all loans
   */
  getAll(): ILoan[];

  /**
   * Get all active loans (not returned yet)
   */
  getActive(): ILoan[];

  /**
   * Find a loan by its ID
   */
  findById(id: number): ILoan | undefined;

  /**
   * Find loans by friend ID
   */
  findByFriendId(friendId: number): ILoan[];

  /**
   * Find loans by book ID
   */
  findByBookId(bookId: number): ILoan[];

  /**
   * Create a new loan
   */
  create(input: NewLoanInput): ILoan;

  /**
   * Mark a loan as returned
   */
  returnLoan(id: number): ILoan | undefined;
}
