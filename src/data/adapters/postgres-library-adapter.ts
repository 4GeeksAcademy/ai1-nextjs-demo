import { getPostgresClient } from "@/lib/postgres";
import type { IBook, IGenre } from "@/types";
import type { LibraryAdapter, NewBookInput } from "./library-adapter";

const DEFAULT_COVER_IMG = "https://placehold.co/640x960.png?text=No+Cover";
const PLACEHOLD_HOST = "https://placehold.co/";

type BookRow = {
  id: number;
  title: string;
  isbn: string;
  cover_img: string;
  open_library_id: string | null;
  summary: string;
  added: string;
};

type GenreRow = {
  id: number;
  name: string;
  cover_img: string;
  description: string;
  parent_genre_id: number | null;
};

function normalizePlaceholdUrl(url: URL) {
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(url.pathname);

  if (!hasFileExtension) {
    url.pathname = `${url.pathname}.png`;
  }

  return url.toString();
}

function normalizeCoverImage(cover_img: string) {
  const normalized = cover_img.trim();

  if (!normalized) {
    return DEFAULT_COVER_IMG;
  }

  if (!normalized.startsWith(PLACEHOLD_HOST)) {
    return normalized;
  }

  try {
    const url = new URL(normalized);
    return normalizePlaceholdUrl(url);
  } catch {
    return DEFAULT_COVER_IMG;
  }
}

export class PostgresLibraryAdapter implements LibraryAdapter {
  private toGenre(row: GenreRow): IGenre {
    return {
      id: row.id,
      name: row.name,
      cover_img: normalizeCoverImage(row.cover_img),
      description: row.description,
      parent_genre_id: row.parent_genre_id ?? undefined,
    };
  }

  private async mapBook(row: BookRow): Promise<IBook> {
    return {
      id: row.id,
      title: row.title,
      isbn: row.isbn,
      cover_img: normalizeCoverImage(row.cover_img),
      open_library_id: row.open_library_id || undefined,
      summary: row.summary,
      added: new Date(row.added),
      genres: await this.findGenresByBookId(row.id),
    };
  }

  async getAll(): Promise<IBook[]> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, title, isbn, cover_img, open_library_id, summary, added
      FROM books
      ORDER BY id DESC
    `) as BookRow[];

    return Promise.all(rows.map((row) => this.mapBook(row)));
  }

  async getAllGenres(): Promise<IGenre[]> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, name, cover_img, description, parent_genre_id
      FROM genres
      ORDER BY id ASC
    `) as GenreRow[];

    const byParent = new Map<number | null, GenreRow[]>();

    for (const row of rows) {
      const list = byParent.get(row.parent_genre_id) ?? [];
      list.push(row);
      byParent.set(row.parent_genre_id, list);
    }

    const buildTree = (parentId: number | null): IGenre[] => {
      const children = byParent.get(parentId) ?? [];

      return children.map((child) => {
        const genre = this.toGenre(child);
        const subgenres = buildTree(child.id);

        if (subgenres.length > 0) {
          genre.subgenres = subgenres;
        }

        return genre;
      });
    };

    return buildTree(null);
  }

  async findById(id: number): Promise<IBook | undefined> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, title, isbn, cover_img, open_library_id, summary, added
      FROM books
      WHERE id = ${id}
    `) as BookRow[];

    const row = rows[0];
    return row ? this.mapBook(row) : undefined;
  }

  async findGenresByBookId(bookId: number): Promise<IGenre[]> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT g.id, g.name, g.cover_img, g.description, g.parent_genre_id
      FROM genres g
      INNER JOIN book_genres bg ON bg.genre_id = g.id
      WHERE bg.book_id = ${bookId}
      ORDER BY g.id ASC
    `) as GenreRow[];

    return rows.map((row) => this.toGenre(row));
  }

  async findGenreById(id: number): Promise<IGenre | undefined> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      SELECT id, name, cover_img, description, parent_genre_id
      FROM genres
      WHERE id = ${id}
    `) as GenreRow[];

    return rows[0] ? this.toGenre(rows[0]) : undefined;
  }

  async add(input: NewBookInput): Promise<IBook> {
    const sql = await getPostgresClient();
    const normalizedCoverImg = normalizeCoverImage(input.cover_img);

    const rows = (await sql`
      INSERT INTO books (title, isbn, cover_img, open_library_id, summary, added)
      VALUES (
        ${input.title.trim()},
        ${input.isbn.trim()},
        ${normalizedCoverImg},
        ${input.open_library_id?.trim() || null},
        ${input.summary.trim()},
        NOW()
      )
      RETURNING id, title, isbn, cover_img, open_library_id, summary, added
    `) as BookRow[];

    const row = rows[0];
    await this.setGenresForBook(row.id, input.genreIds ?? []);
    return this.mapBook(row);
  }

  async setGenresForBook(
    bookId: number,
    genreIds: number[],
  ): Promise<IGenre[]> {
    const sql = await getPostgresClient();
    await sql`DELETE FROM book_genres WHERE book_id = ${bookId}`;

    const normalizedGenreIds = [...new Set(genreIds)].filter((genreId) =>
      Number.isInteger(genreId),
    );

    for (const genreId of normalizedGenreIds) {
      await sql`
        INSERT INTO book_genres (book_id, genre_id)
        SELECT ${bookId}, ${genreId}
        WHERE EXISTS (SELECT 1 FROM genres WHERE id = ${genreId})
      `;
    }

    return this.findGenresByBookId(bookId);
  }

  async addGenre(input: {
    name: string;
    cover_img: string;
    description: string;
    parent_genre_id?: number;
  }): Promise<IGenre> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      INSERT INTO genres (name, cover_img, description, parent_genre_id)
      VALUES (
        ${input.name.trim()},
        ${normalizeCoverImage(input.cover_img)},
        ${input.description.trim()},
        ${input.parent_genre_id ?? null}
      )
      RETURNING id, name, cover_img, description, parent_genre_id
    `) as GenreRow[];

    return this.toGenre(rows[0]);
  }

  async updateGenre(input: {
    id: number;
    name: string;
    cover_img: string;
    description: string;
    parent_genre_id?: number;
  }): Promise<IGenre | undefined> {
    const parentId =
      input.parent_genre_id && input.parent_genre_id !== input.id
        ? input.parent_genre_id
        : null;

    const sql = await getPostgresClient();
    const rows = (await sql`
      UPDATE genres
      SET name = ${input.name.trim()},
          cover_img = ${normalizeCoverImage(input.cover_img)},
          description = ${input.description.trim()},
          parent_genre_id = ${parentId}
      WHERE id = ${input.id}
      RETURNING id, name, cover_img, description, parent_genre_id
    `) as GenreRow[];

    return rows[0] ? this.toGenre(rows[0]) : undefined;
  }

  async deleteGenre(id: number): Promise<boolean> {
    const sql = await getPostgresClient();
    const rows = (await sql`
      DELETE FROM genres
      WHERE id = ${id}
      RETURNING id
    `) as Array<{ id: number }>;

    return rows.length > 0;
  }
}
