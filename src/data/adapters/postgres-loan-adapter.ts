import { getPostgresClient } from "@/lib/postgres";
import type { ILoan } from "@/types";
import type { LoanAdapter, NewLoanInput } from "./loan-adapter";

type LoanRow = {
  id: number;
  friend_id: number;
  book_id: number;
  checked_out: string;
  returned_at: string | null;
};

function mapLoanRow(row: LoanRow): ILoan {
  return {
    id: row.id,
    friendId: row.friend_id,
    bookId: row.book_id,
    checkedOut: new Date(row.checked_out),
    returnedAt: row.returned_at ? new Date(row.returned_at) : undefined,
  };
}

export class PostgresLoanAdapter implements LoanAdapter {
  async getAll(): Promise<ILoan[]> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, friend_id, book_id, checked_out, returned_at
      FROM loans
      ORDER BY id DESC
    `) as LoanRow[];

    return rows.map(mapLoanRow);
  }

  async getActive(): Promise<ILoan[]> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, friend_id, book_id, checked_out, returned_at
      FROM loans
      WHERE returned_at IS NULL
      ORDER BY id DESC
    `) as LoanRow[];

    return rows.map(mapLoanRow);
  }

  async findById(id: number): Promise<ILoan | undefined> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, friend_id, book_id, checked_out, returned_at
      FROM loans
      WHERE id = ${id}
    `) as LoanRow[];

    const row = rows[0];
    return row ? mapLoanRow(row) : undefined;
  }

  async findByFriendId(friendId: number): Promise<ILoan[]> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, friend_id, book_id, checked_out, returned_at
      FROM loans
      WHERE friend_id = ${friendId}
      ORDER BY id DESC
    `) as LoanRow[];

    return rows.map(mapLoanRow);
  }

  async findByBookId(bookId: number): Promise<ILoan[]> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, friend_id, book_id, checked_out, returned_at
      FROM loans
      WHERE book_id = ${bookId}
      ORDER BY id DESC
    `) as LoanRow[];

    return rows.map(mapLoanRow);
  }

  async create(input: NewLoanInput): Promise<ILoan> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      INSERT INTO loans (friend_id, book_id, checked_out)
      VALUES (${input.friendId}, ${input.bookId}, NOW())
      RETURNING id, friend_id, book_id, checked_out, returned_at
    `) as LoanRow[];

    return mapLoanRow(rows[0]);
  }

  async returnLoan(id: number): Promise<ILoan | undefined> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      UPDATE loans
      SET returned_at = NOW()
      WHERE id = ${id} AND returned_at IS NULL
      RETURNING id, friend_id, book_id, checked_out, returned_at
    `) as LoanRow[];

    if (rows[0]) {
      return mapLoanRow(rows[0]);
    }

    return this.findById(id);
  }
}
