import { DatabaseLoanAdapter } from "./adapters/database-loan-adapter";
import type { LoanAdapter } from "./adapters/loan-adapter";

/**
 * The loan adapter instance. Can be swapped with different implementations
 * (e.g., InMemoryLoanAdapter) without changing consuming code.
 */
const loanAdapter: LoanAdapter = new DatabaseLoanAdapter();

/**
 * Get all loans
 */
export function getAllLoans() {
  return loanAdapter.getAll();
}

/**
 * Get all active loans (not returned yet)
 */
export function getActiveLoans() {
  return loanAdapter.getActive();
}

/**
 * Find a loan by its ID
 */
export function findLoanById(id: number) {
  return loanAdapter.findById(id);
}

/**
 * Find loans by friend ID
 */
export function findLoansByFriendId(friendId: number) {
  return loanAdapter.findByFriendId(friendId);
}

/**
 * Find loans by book ID
 */
export function findLoansByBookId(bookId: number) {
  return loanAdapter.findByBookId(bookId);
}

/**
 * Create a new loan
 */
export function createLoan(input: { friendId: number; bookId: number }) {
  return loanAdapter.create(input);
}

/**
 * Mark a loan as returned
 */
export function returnLoan(id: number) {
  return loanAdapter.returnLoan(id);
}
