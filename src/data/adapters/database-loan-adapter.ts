import type { ILoan } from "@/types";
import type { LoanAdapter, NewLoanInput } from "./loan-adapter";
import { db } from "@/lib/database";

/**
 * DatabaseLoanAdapter implements the LoanAdapter interface using SQLite.
 * This adapter provides persistent storage for loans.
 */
export class DatabaseLoanAdapter implements LoanAdapter {
  async getAll(): Promise<ILoan[]> {
    const stmt = db.prepare("SELECT * FROM loans ORDER BY id DESC");
    const rows = stmt.all() as Array<{
      id: number;
      friend_id: number;
      book_id: number;
      checked_out: string;
      returned_at: string | null;
    }>;

    return rows.map((row) => ({
      id: row.id,
      friendId: row.friend_id,
      bookId: row.book_id,
      checkedOut: new Date(row.checked_out),
      returnedAt: row.returned_at ? new Date(row.returned_at) : undefined,
    }));
  }

  async getActive(): Promise<ILoan[]> {
    const stmt = db.prepare(
      "SELECT * FROM loans WHERE returned_at IS NULL ORDER BY id DESC",
    );
    const rows = stmt.all() as Array<{
      id: number;
      friend_id: number;
      book_id: number;
      checked_out: string;
      returned_at: string | null;
    }>;

    return rows.map((row) => ({
      id: row.id,
      friendId: row.friend_id,
      bookId: row.book_id,
      checkedOut: new Date(row.checked_out),
      returnedAt: row.returned_at ? new Date(row.returned_at) : undefined,
    }));
  }

  async findById(id: number): Promise<ILoan | undefined> {
    const stmt = db.prepare("SELECT * FROM loans WHERE id = ?");
    const row = stmt.get(id) as
      | {
          id: number;
          friend_id: number;
          book_id: number;
          checked_out: string;
          returned_at: string | null;
        }
      | undefined;

    if (!row) {
      return undefined;
    }

    return {
      id: row.id,
      friendId: row.friend_id,
      bookId: row.book_id,
      checkedOut: new Date(row.checked_out),
      returnedAt: row.returned_at ? new Date(row.returned_at) : undefined,
    };
  }

  async findByFriendId(friendId: number): Promise<ILoan[]> {
    const stmt = db.prepare("SELECT * FROM loans WHERE friend_id = ?");
    const rows = stmt.all(friendId) as Array<{
      id: number;
      friend_id: number;
      book_id: number;
      checked_out: string;
      returned_at: string | null;
    }>;

    return rows.map((row) => ({
      id: row.id,
      friendId: row.friend_id,
      bookId: row.book_id,
      checkedOut: new Date(row.checked_out),
      returnedAt: row.returned_at ? new Date(row.returned_at) : undefined,
    }));
  }

  async findByBookId(bookId: number): Promise<ILoan[]> {
    const stmt = db.prepare("SELECT * FROM loans WHERE book_id = ?");
    const rows = stmt.all(bookId) as Array<{
      id: number;
      friend_id: number;
      book_id: number;
      checked_out: string;
      returned_at: string | null;
    }>;

    return rows.map((row) => ({
      id: row.id,
      friendId: row.friend_id,
      bookId: row.book_id,
      checkedOut: new Date(row.checked_out),
      returnedAt: row.returned_at ? new Date(row.returned_at) : undefined,
    }));
  }

  async create(input: NewLoanInput): Promise<ILoan> {
    const stmt = db.prepare(`
      INSERT INTO loans (friend_id, book_id, checked_out)
      VALUES (?, ?, ?)
    `);

    const checkedOut = new Date().toISOString();
    const result = stmt.run(input.friendId, input.bookId, checkedOut);

    return {
      id: Number(result.lastInsertRowid),
      friendId: input.friendId,
      bookId: input.bookId,
      checkedOut: new Date(checkedOut),
    };
  }

  async returnLoan(id: number): Promise<ILoan | undefined> {
    const loan = await this.findById(id);

    if (!loan) {
      return undefined;
    }

    if (loan.returnedAt) {
      return loan; // Already returned
    }

    const stmt = db.prepare(`
      UPDATE loans
      SET returned_at = ?
      WHERE id = ?
    `);

    const returnedAt = new Date().toISOString();
    stmt.run(returnedAt, id);

    return {
      ...loan,
      returnedAt: new Date(returnedAt),
    };
  }
}
