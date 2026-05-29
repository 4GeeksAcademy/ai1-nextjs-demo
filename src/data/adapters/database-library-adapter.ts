import type { IBook, IGenre } from "@/types";
import type { LibraryAdapter, NewBookInput } from "./library-adapter";
import { db } from "@/lib/database";

const DEFAULT_COVER_IMG = "https://placehold.co/640x960.png?text=No+Cover";
const PLACEHOLD_HOST = "https://placehold.co/";

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

/**
 * DatabaseLibraryAdapter implements the LibraryAdapter interface using SQLite.
 * This adapter provides persistent storage for books.
 */
export class DatabaseLibraryAdapter implements LibraryAdapter {
  private toGenre(row: {
    id: number;
    name: string;
    cover_img: string;
    description: string;
    parent_genre_id?: number | null;
  }): IGenre {
    return {
      id: row.id,
      name: row.name,
      cover_img: normalizeCoverImage(row.cover_img),
      description: row.description,
      parent_genre_id: row.parent_genre_id ?? undefined,
    };
  }

  async getAll(): Promise<IBook[]> {
    const stmt = db.prepare("SELECT * FROM books ORDER BY id DESC");
    const rows = stmt.all() as Array<{
      id: number;
      title: string;
      isbn: string;
      cover_img: string;
      open_library_id: string | null;
      summary: string;
      added: string;
    }>;

    return Promise.all(
      rows.map(async (row) => ({
        id: row.id,
        title: row.title,
        isbn: row.isbn,
        cover_img: normalizeCoverImage(row.cover_img),
        open_library_id: row.open_library_id || undefined,
        summary: row.summary,
        added: new Date(row.added),
        genres: await this.findGenresByBookId(row.id),
      })),
    );
  }

  async getAllGenres(): Promise<IGenre[]> {
    const stmt = db.prepare(`
      SELECT id, name, cover_img, description, parent_genre_id
      FROM genres
      ORDER BY id ASC
    `);
    const rows = stmt.all() as Array<{
      id: number;
      name: string;
      cover_img: string;
      description: string;
      parent_genre_id: number | null;
    }>;

    const byParent = new Map<number | null, typeof rows>();

    for (const row of rows) {
      const list = byParent.get(row.parent_genre_id) ?? [];
      list.push(row);
      byParent.set(row.parent_genre_id, list);
    }

    const buildTree = (parentId: number | null): IGenre[] => {
      const children = byParent.get(parentId) ?? [];

      return children.map((child) => {
        const subgenres = buildTree(child.id);
        const genre = this.toGenre(child);

        if (subgenres.length > 0) {
          genre.subgenres = subgenres;
        }

        return genre;
      });
    };

    return buildTree(null);
  }

  async findById(id: number): Promise<IBook | undefined> {
    const stmt = db.prepare("SELECT * FROM books WHERE id = ?");
    const row = stmt.get(id) as
      | {
          id: number;
          title: string;
          isbn: string;
          cover_img: string;
          open_library_id: string | null;
          summary: string;
          added: string;
        }
      | undefined;

    if (!row) {
      return undefined;
    }

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

  async findGenresByBookId(bookId: number): Promise<IGenre[]> {
    const stmt = db.prepare(`
      SELECT g.id, g.name, g.cover_img, g.description, g.parent_genre_id
      FROM genres g
      INNER JOIN book_genres bg ON bg.genre_id = g.id
      WHERE bg.book_id = ?
      ORDER BY g.id ASC
    `);
    const rows = stmt.all(bookId) as Array<{
      id: number;
      name: string;
      cover_img: string;
      description: string;
      parent_genre_id: number | null;
    }>;

    return rows.map((row) => this.toGenre(row));
  }

  async setGenresForBook(
    bookId: number,
    genreIds: number[],
  ): Promise<IGenre[]> {
    const bookExists = db
      .prepare("SELECT 1 FROM books WHERE id = ?")
      .get(bookId) as { 1: number } | undefined;

    if (!bookExists) {
      return [];
    }

    const normalizedGenreIds = [...new Set(genreIds)].filter((genreId) =>
      Number.isInteger(genreId),
    );

    const deleteStmt = db.prepare("DELETE FROM book_genres WHERE book_id = ?");
    const insertStmt = db.prepare(`
      INSERT INTO book_genres (book_id, genre_id)
      SELECT ?, ?
      WHERE EXISTS (SELECT 1 FROM genres WHERE id = ?)
    `);

    const replaceInTransaction = db.transaction(() => {
      deleteStmt.run(bookId);

      for (const genreId of normalizedGenreIds) {
        insertStmt.run(bookId, genreId, genreId);
      }
    });

    replaceInTransaction();

    return this.findGenresByBookId(bookId);
  }

  async findGenreById(id: number): Promise<IGenre | undefined> {
    const stmt = db.prepare(`
      SELECT id, name, cover_img, description, parent_genre_id
      FROM genres
      WHERE id = ?
    `);
    const row = stmt.get(id) as
      | {
          id: number;
          name: string;
          cover_img: string;
          description: string;
          parent_genre_id: number | null;
        }
      | undefined;

    if (!row) {
      return undefined;
    }

    return this.toGenre(row);
  }

  async addGenre(input: {
    name: string;
    cover_img: string;
    description: string;
    parent_genre_id?: number;
  }): Promise<IGenre> {
    const stmt = db.prepare(`
      INSERT INTO genres (name, cover_img, description, parent_genre_id)
      VALUES (?, ?, ?, ?)
    `);

    const normalizedName = input.name.trim();
    const normalizedDescription = input.description.trim();
    const normalizedCoverImg = normalizeCoverImage(input.cover_img);
    const normalizedParentGenreId = input.parent_genre_id ?? null;

    const result = stmt.run(
      normalizedName,
      normalizedCoverImg,
      normalizedDescription,
      normalizedParentGenreId,
    );

    return {
      id: Number(result.lastInsertRowid),
      name: normalizedName,
      cover_img: normalizedCoverImg,
      description: normalizedDescription,
      parent_genre_id: input.parent_genre_id,
    };
  }

  async updateGenre(input: {
    id: number;
    name: string;
    cover_img: string;
    description: string;
    parent_genre_id?: number;
  }): Promise<IGenre | undefined> {
    const existing = await this.findGenreById(input.id);

    if (!existing) {
      return undefined;
    }

    const normalizedParentGenreId =
      input.parent_genre_id && input.parent_genre_id !== input.id
        ? input.parent_genre_id
        : null;

    const stmt = db.prepare(`
      UPDATE genres
      SET name = ?, cover_img = ?, description = ?, parent_genre_id = ?
      WHERE id = ?
    `);

    stmt.run(
      input.name.trim(),
      normalizeCoverImage(input.cover_img),
      input.description.trim(),
      normalizedParentGenreId,
      input.id,
    );

    return this.findGenreById(input.id);
  }

  async deleteGenre(id: number): Promise<boolean> {
    const stmt = db.prepare("DELETE FROM genres WHERE id = ?");
    const result = stmt.run(id);

    return result.changes > 0;
  }

  async add(input: NewBookInput): Promise<IBook> {
    const stmt = db.prepare(`
      INSERT INTO books (title, isbn, cover_img, open_library_id, summary, added)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const normalizedCoverImg = normalizeCoverImage(input.cover_img);
    const normalizedOpenLibraryId = input.open_library_id?.trim() || null;
    const added = new Date().toISOString();

    const createInTransaction = db.transaction(() => {
      const result = stmt.run(
        input.title.trim(),
        input.isbn.trim(),
        normalizedCoverImg,
        normalizedOpenLibraryId,
        input.summary.trim(),
        added,
      );

      const bookId = Number(result.lastInsertRowid);

      return {
        id: bookId,
        title: input.title.trim(),
        isbn: input.isbn.trim(),
        cover_img: normalizedCoverImg,
        open_library_id: normalizedOpenLibraryId || undefined,
        summary: input.summary.trim(),
        added: new Date(added),
      };
    });

    const createdBook = createInTransaction();
    const genres = await this.setGenresForBook(
      createdBook.id,
      input.genreIds ?? [],
    );

    return {
      ...createdBook,
      genres,
    };
  }
}
