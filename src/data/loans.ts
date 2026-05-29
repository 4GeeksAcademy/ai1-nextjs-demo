import { dataProvider } from "./adapters/provider";
import type { LoanAdapter } from "./adapters/loan-adapter";

/**
 * The loan adapter instance. Can be swapped with different implementations
 * (e.g., InMemoryLoanAdapter) without changing consuming code.
 */
let loanAdapterPromise: Promise<LoanAdapter> | null = null;

async function getLoanAdapter() {
  if (!loanAdapterPromise) {
    loanAdapterPromise =
      dataProvider === "postgres"
        ? import("./adapters/postgres-loan-adapter").then(
            ({ PostgresLoanAdapter }) => new PostgresLoanAdapter(),
          )
        : import("./adapters/database-loan-adapter").then(
            ({ DatabaseLoanAdapter }) => new DatabaseLoanAdapter(),
          );
  }

  return loanAdapterPromise;
}

/**
 * Get all loans
 */
export async function getAllLoans() {
  const loanAdapter = await getLoanAdapter();
  return loanAdapter.getAll();
}

/**
 * Get all active loans (not returned yet)
 */
export async function getActiveLoans() {
  const loanAdapter = await getLoanAdapter();
  return loanAdapter.getActive();
}

/**
 * Find a loan by its ID
 */
export async function findLoanById(id: number) {
  const loanAdapter = await getLoanAdapter();
  return loanAdapter.findById(id);
}

/**
 * Find loans by friend ID
 */
export async function findLoansByFriendId(friendId: number) {
  const loanAdapter = await getLoanAdapter();
  return loanAdapter.findByFriendId(friendId);
}

/**
 * Find loans by book ID
 */
export async function findLoansByBookId(bookId: number) {
  const loanAdapter = await getLoanAdapter();
  return loanAdapter.findByBookId(bookId);
}

/**
 * Create a new loan
 */
export async function createLoan(input: { friendId: number; bookId: number }) {
  const loanAdapter = await getLoanAdapter();
  return loanAdapter.create(input);
}

/**
 * Mark a loan as returned
 */
export async function returnLoan(id: number) {
  const loanAdapter = await getLoanAdapter();
  return loanAdapter.returnLoan(id);
}
