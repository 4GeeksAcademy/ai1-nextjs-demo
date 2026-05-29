import type { IFriend } from "@/types";
import type { RolodexAdapter, NewFriendInput } from "./rolodex-adapter";
import { db } from "@/lib/database";

/**
 * DatabaseRolodexAdapter implements the RolodexAdapter interface using SQLite.
 * This adapter provides persistent storage for friends.
 */
export class DatabaseRolodexAdapter implements RolodexAdapter {
  async getAll(): Promise<IFriend[]> {
    const stmt = db.prepare("SELECT * FROM friends ORDER BY id DESC");
    const rows = stmt.all() as Array<{
      id: number;
      name: string;
      phone: string;
      email: string;
    }>;

    return rows;
  }

  async findById(id: number): Promise<IFriend | undefined> {
    const stmt = db.prepare("SELECT * FROM friends WHERE id = ?");
    const row = stmt.get(id) as
      | {
          id: number;
          name: string;
          phone: string;
          email: string;
        }
      | undefined;

    return row;
  }

  async add(input: NewFriendInput): Promise<IFriend> {
    const stmt = db.prepare(`
      INSERT INTO friends (name, phone, email)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(
      input.name.trim(),
      input.phone.trim(),
      input.email.trim(),
    );

    return {
      id: Number(result.lastInsertRowid),
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
    };
  }
}
