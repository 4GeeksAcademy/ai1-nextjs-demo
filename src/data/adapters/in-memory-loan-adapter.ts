import type { ILoan, LoanLedgerType } from "@/types";
import type { LoanAdapter, NewLoanInput } from "./loan-adapter";

const seedLoans: LoanLedgerType = [
  {
    id: 1,
    friendId: 1,
    bookId: 5,
    checkedOut: new Date("2026-05-10"),
  },
  {
    id: 2,
    friendId: 3,
    bookId: 17,
    checkedOut: new Date("2026-05-12"),
  },
  {
    id: 3,
    friendId: 5,
    bookId: 22,
    checkedOut: new Date("2026-05-01"),
    returnedAt: new Date("2026-05-15"),
  },
];

/**
 * InMemoryLoanAdapter implements the LoanAdapter interface using in-memory storage.
 * This is useful for development and testing. Can be easily swapped with a database adapter.
 */
export class InMemoryLoanAdapter implements LoanAdapter {
  private storage: LoanLedgerType;

  constructor(initialData: LoanLedgerType = seedLoans) {
    this.storage = [...initialData];
  }

  async getAll(): Promise<ILoan[]> {
    return this.storage;
  }

  async getActive(): Promise<ILoan[]> {
    return this.storage.filter((loan) => !loan.returnedAt);
  }

  async findById(id: number): Promise<ILoan | undefined> {
    return this.storage.find((loan) => loan.id === id);
  }

  async findByFriendId(friendId: number): Promise<ILoan[]> {
    return this.storage.filter((loan) => loan.friendId === friendId);
  }

  async findByBookId(bookId: number): Promise<ILoan[]> {
    return this.storage.filter((loan) => loan.bookId === bookId);
  }

  async create(input: NewLoanInput): Promise<ILoan> {
    const currentMaxId = this.storage.reduce(
      (maxId, loan) => Math.max(maxId, loan.id),
      0,
    );

    const loan: ILoan = {
      id: currentMaxId + 1,
      friendId: input.friendId,
      bookId: input.bookId,
      checkedOut: new Date(),
    };

    this.storage.unshift(loan);
    return loan;
  }

  async returnLoan(id: number): Promise<ILoan | undefined> {
    const loan = this.storage.find((loan) => loan.id === id);

    if (!loan) {
      return undefined;
    }

    if (loan.returnedAt) {
      return loan; // Already returned
    }

    loan.returnedAt = new Date();
    return loan;
  }
}
