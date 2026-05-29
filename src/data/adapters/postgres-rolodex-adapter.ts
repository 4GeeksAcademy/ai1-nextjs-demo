import { getPostgresClient } from "@/lib/postgres";
import type { IFriend } from "@/types";
import type { NewFriendInput, RolodexAdapter } from "./rolodex-adapter";

export class PostgresRolodexAdapter implements RolodexAdapter {
  async getAll(): Promise<IFriend[]> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, name, phone, email
      FROM friends
      ORDER BY id DESC
    `) as IFriend[];

    return rows;
  }

  async findById(id: number): Promise<IFriend | undefined> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, name, phone, email
      FROM friends
      WHERE id = ${id}
    `) as IFriend[];

    return rows[0] ?? undefined;
  }

  async add(input: NewFriendInput): Promise<IFriend> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      INSERT INTO friends (name, phone, email)
      VALUES (${input.name.trim()}, ${input.phone.trim()}, ${input.email.trim()})
      RETURNING id, name, phone, email
    `) as IFriend[];

    return rows[0];
  }
}
