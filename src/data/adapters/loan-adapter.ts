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
  getAll(): Promise<ILoan[]>;

  /**
   * Get all active loans (not returned yet)
   */
  getActive(): Promise<ILoan[]>;

  /**
   * Find a loan by its ID
   */
  findById(id: number): Promise<ILoan | undefined>;

  /**
   * Find loans by friend ID
   */
  findByFriendId(friendId: number): Promise<ILoan[]>;

  /**
   * Find loans by book ID
   */
  findByBookId(bookId: number): Promise<ILoan[]>;

  /**
   * Create a new loan
   */
  create(input: NewLoanInput): Promise<ILoan>;

  /**
   * Mark a loan as returned
   */
  returnLoan(id: number): Promise<ILoan | undefined>;
}
