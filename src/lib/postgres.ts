import { neon } from "@neondatabase/serverless";

let initializationPromise: Promise<void> | null = null;
let sqlClient: ReturnType<typeof neon> | null = null;

async function initializePostgresSchema(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      isbn TEXT NOT NULL,
      cover_img TEXT NOT NULL,
      open_library_id TEXT,
      summary TEXT NOT NULL,
      added TIMESTAMPTZ NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS friends (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS loans (
      id SERIAL PRIMARY KEY,
      friend_id INTEGER NOT NULL REFERENCES friends(id),
      book_id INTEGER NOT NULL REFERENCES books(id),
      checked_out TIMESTAMPTZ NOT NULL,
      returned_at TIMESTAMPTZ
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS genres (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      cover_img TEXT NOT NULL,
      description TEXT NOT NULL,
      parent_genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
      UNIQUE (name, parent_genre_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS book_genres (
      book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
      PRIMARY KEY (book_id, genre_id)
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_book_genres_book_id
    ON book_genres(book_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_book_genres_genre_id
    ON book_genres(genre_id)
  `;
}

export async function getPostgresClient() {
  const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Postgres connection string missing. Set POSTGRES_URL or DATABASE_URL.",
    );
  }

  if (!sqlClient) {
    sqlClient = neon(connectionString);
  }

  if (!initializationPromise) {
    initializationPromise = initializePostgresSchema(sqlClient);
  }

  await initializationPromise;
  return sqlClient;
}
