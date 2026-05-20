import type { IBook } from "@/types";
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
  getAll(): IBook[] {
    const stmt = db.prepare("SELECT * FROM books ORDER BY id DESC");
    const rows = stmt.all() as Array<{
      id: number;
      title: string;
      isbn: string;
      cover_img: string;
      summary: string;
      added: string;
    }>;

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      isbn: row.isbn,
      cover_img: normalizeCoverImage(row.cover_img),
      summary: row.summary,
      added: new Date(row.added),
    }));
  }

  findById(id: number): IBook | undefined {
    const stmt = db.prepare("SELECT * FROM books WHERE id = ?");
    const row = stmt.get(id) as
      | {
          id: number;
          title: string;
          isbn: string;
          cover_img: string;
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
      summary: row.summary,
      added: new Date(row.added),
    };
  }

  add(input: NewBookInput): IBook {
    const stmt = db.prepare(`
      INSERT INTO books (title, isbn, cover_img, summary, added)
      VALUES (?, ?, ?, ?, ?)
    `);

    const normalizedCoverImg = normalizeCoverImage(input.cover_img);
    const added = new Date().toISOString();

    const result = stmt.run(
      input.title.trim(),
      input.isbn.trim(),
      normalizedCoverImg,
      input.summary.trim(),
      added,
    );

    return {
      id: Number(result.lastInsertRowid),
      title: input.title.trim(),
      isbn: input.isbn.trim(),
      cover_img: normalizedCoverImg,
      summary: input.summary.trim(),
      added: new Date(added),
    };
  }
}
