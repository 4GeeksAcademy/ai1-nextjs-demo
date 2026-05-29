import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "library.db");
const db = new Database(dbPath);

type SeedBookRow = [number, string, string, string, string, string];
type SeedGenreRow = [number, string, string, string, number | null];
type SeedBookGenreRow = [number, number];
type SeedFriendRow = [string, string, string];
type SeedLoanRow = [number, number, string, string | null];

// Enable foreign keys
db.pragma("foreign_keys = ON");

/**
 * Initialize the database schema
 */
export function initializeDatabase() {
  // Create books table
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      isbn TEXT NOT NULL,
      cover_img TEXT NOT NULL,
      open_library_id TEXT,
      summary TEXT NOT NULL,
      added TEXT NOT NULL
    )
  `);

  // Migrate existing databases that predate open_library_id.
  const bookColumns = db.prepare("PRAGMA table_info(books)").all() as Array<{
    name: string;
  }>;
  const hasOpenLibraryId = bookColumns.some(
    (column) => column.name === "open_library_id",
  );

  if (!hasOpenLibraryId) {
    db.exec("ALTER TABLE books ADD COLUMN open_library_id TEXT");
  }

  // Create friends table
  db.exec(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  // Create loans table
  db.exec(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      friend_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      checked_out TEXT NOT NULL,
      returned_at TEXT,
      FOREIGN KEY (friend_id) REFERENCES friends(id),
      FOREIGN KEY (book_id) REFERENCES books(id)
    )
  `);

  // Create genres table. parent_genre_id enables hierarchical genres/subgenres.
  db.exec(`
    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cover_img TEXT NOT NULL,
      description TEXT NOT NULL,
      parent_genre_id INTEGER,
      FOREIGN KEY (parent_genre_id) REFERENCES genres(id) ON DELETE SET NULL,
      UNIQUE (name, parent_genre_id)
    )
  `);

  // Create join table to support many-to-many between books and genres.
  db.exec(`
    CREATE TABLE IF NOT EXISTS book_genres (
      book_id INTEGER NOT NULL,
      genre_id INTEGER NOT NULL,
      PRIMARY KEY (book_id, genre_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
    )
  `);

  db.exec(
    "CREATE INDEX IF NOT EXISTS idx_book_genres_book_id ON book_genres(book_id)",
  );
  db.exec(
    "CREATE INDEX IF NOT EXISTS idx_book_genres_genre_id ON book_genres(genre_id)",
  );
}

/**
 * Seed the database with initial data if empty
 */
export function seedDatabase() {
  const bookCount = db.prepare("SELECT COUNT(*) as count FROM books").get() as {
    count: number;
  };
  const genreCount = db
    .prepare("SELECT COUNT(*) as count FROM genres")
    .get() as {
    count: number;
  };
  const bookGenreCount = db
    .prepare("SELECT COUNT(*) as count FROM book_genres")
    .get() as {
    count: number;
  };

  if (bookCount.count === 0) {
    // Seed books
    const insertBook = db.prepare(`
      INSERT INTO books (id, title, isbn, cover_img, summary, added)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const books: SeedBookRow[] = [
      [
        2,
        "Something Wicked This Way Comes",
        "978-0-380-72940-1",
        "/img/2.jpg",
        "Two boys in a small town face a sinister traveling carnival whose attractions prey on fear and desire, forcing them into a fight for their souls.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        3,
        "One Hundred Years of Solitude",
        "0-380-01503-X",
        "/img/3.jpg",
        "An epic multi-generational saga of the Buendia family in Macondo, where love, violence, and magical events repeat across a century of rise and decline.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        4,
        "Snow Crash",
        "978-061336162",
        "/img/4.jpg",
        "A fast, satirical cyberpunk thriller where a hacker swordsman and a courier uncover a digital and linguistic threat capable of destabilizing society.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        5,
        "The Ultimate Hitchiker's Guide To The Galaxy",
        "978-0-645-45374-7",
        "/img/5.jpg",
        "A wildly funny spacefaring adventure that follows Arthur Dent and his odd companions through absurd cosmic disasters, bureaucracy, and philosophy.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        8,
        "Sabriel",
        "0-06-447183-7",
        "/img/8.jpg",
        "A young necromancer-in-training crosses into a death-haunted kingdom to rescue her father, using bells, magic, and courage against restless dead.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        13,
        "On Cats - An Anthology",
        "978-1-912559-32-9",
        "/img/13.jpg",
        "A curated collection of cat-themed writing that ranges from affectionate and witty to reflective, showing how felines inspire art and storytelling.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        16,
        "Consider Phlebas",
        "978-0-356-52163-3",
        "/img/16.jpg",
        "During a brutal galactic war, a shapeshifting operative undertakes a dangerous mission that exposes the moral complexity of the Culture universe.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        17,
        "Cryptonomicon",
        "978-0-380-78862-0",
        "/img/17.jpg",
        "Interwoven timelines follow codebreakers, hackers, and treasure hunters as cryptography links World War II secrets to modern information warfare.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        18,
        "Ill Met In Lankhmar",
        "9781565048942",
        "/img/18.jpg",
        "Classic sword-and-sorcery tales featuring Fafhrd and the Gray Mouser, two rogues whose heists and rivalries in Lankhmar mix danger with dark humor.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        19,
        "King City",
        "978-1-60706-510-4",
        "/img/19.jpg",
        "A surreal science-fiction comic about a catmaster navigating strange cities, shifting alliances, and personal growth in a vividly weird world.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        21,
        "The Integral Trees",
        "N/A",
        "/img/21.jpg",
        "Humans stranded in a colossal gas torus must survive among floating forests and alien politics in a hard-science adventure set in free fall.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        22,
        "The War Between The Pitiful Teachers And The Splendid Kids",
        "N/A",
        "/img/22.jpg",
        "A satirical school story where students and teachers clash in escalating comic rebellion, poking fun at authority and classroom absurdities.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        28,
        "The Everything Box",
        "N/A",
        "/img/28.jpg",
        "A thief accidentally steals a magical box tied to old gods, kicking off a chaotic urban fantasy chase filled with cults, demons, and sharp humor.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        29,
        "Transmetropolitan Book One",
        "978-1401287955",
        "/img/29.jpg",
        "In a corrupt future metropolis, outlaw journalist Spider Jerusalem wages a foul-mouthed war on power, media manipulation, and political rot.",
        new Date("2026-04-01").toISOString(),
      ],
      [
        34,
        "Tomorrow And Tomorrow And Tomorrow",
        "978-0-593-46649-0",
        "/img/34.jpg",
        "Two friends build a groundbreaking video game studio over decades, exploring ambition, creativity, love, and the complicated ways people collaborate.",
        new Date("2026-04-01").toISOString(),
      ],
    ];

    const insertMany = db.transaction((books: SeedBookRow[]) => {
      for (const book of books) {
        insertBook.run(...book);
      }
    });

    insertMany(books);

    // Seed friends
    const insertFriend = db.prepare(`
      INSERT INTO friends (name, phone, email)
      VALUES (?, ?, ?)
    `);

    const friends: SeedFriendRow[] = [
      ["Alice Johnson", "(555) 123-4567", "alice.johnson@email.com"],
      ["Bob Smith", "(555) 234-5678", "bob.smith@email.com"],
      ["Carol Martinez", "(555) 345-6789", "carol.martinez@email.com"],
      ["David Lee", "(555) 456-7890", "david.lee@email.com"],
      ["Emma Wilson", "(555) 567-8901", "emma.wilson@email.com"],
      ["Frank Brown", "(555) 678-9012", "frank.brown@email.com"],
      ["Grace Taylor", "(555) 789-0123", "grace.taylor@email.com"],
      ["Henry Davis", "(555) 890-1234", "henry.davis@email.com"],
    ];

    const insertManyFriends = db.transaction((friends: SeedFriendRow[]) => {
      for (const friend of friends) {
        insertFriend.run(...friend);
      }
    });

    insertManyFriends(friends);

    // Seed loans
    const insertLoan = db.prepare(`
      INSERT INTO loans (friend_id, book_id, checked_out, returned_at)
      VALUES (?, ?, ?, ?)
    `);

    const loans: SeedLoanRow[] = [
      [1, 5, new Date("2026-05-10").toISOString(), null],
      [3, 17, new Date("2026-05-12").toISOString(), null],
      [
        5,
        22,
        new Date("2026-05-01").toISOString(),
        new Date("2026-05-15").toISOString(),
      ],
    ];

    const insertManyLoans = db.transaction((loans: SeedLoanRow[]) => {
      for (const loan of loans) {
        insertLoan.run(...loan);
      }
    });

    insertManyLoans(loans);
  }

  if (genreCount.count === 0) {
    const insertGenre = db.prepare(`
      INSERT INTO genres (id, name, cover_img, description, parent_genre_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    const genres: SeedGenreRow[] = [
      [
        1,
        "Fiction",
        "https://placehold.co/640x960.png?text=Fiction",
        "Narrative literature created primarily from imagination.",
        null,
      ],
      [
        2,
        "Sci-Fi",
        "https://placehold.co/640x960.png?text=Sci-Fi",
        "Speculative fiction centered on science, technology, and future worlds.",
        1,
      ],
      [
        3,
        "Cyberpunk",
        "https://placehold.co/640x960.png?text=Cyberpunk",
        "High-tech, low-life stories featuring corporate dystopias and networked worlds.",
        2,
      ],
      [
        4,
        "Fantasy",
        "https://placehold.co/640x960.png?text=Fantasy",
        "Stories driven by magic, mythic settings, and supernatural elements.",
        1,
      ],
      [
        5,
        "Magical Realism",
        "https://placehold.co/640x960.png?text=Magical+Realism",
        "Realistic worlds where magical events appear as natural parts of life.",
        1,
      ],
      [
        6,
        "Humor",
        "https://placehold.co/640x960.png?text=Humor",
        "Stories that emphasize satire, absurdity, and comic voice.",
        1,
      ],
      [
        7,
        "Comics",
        "https://placehold.co/640x960.png?text=Comics",
        "Graphic storytelling through sequential visual panels.",
        1,
      ],
      [
        8,
        "Space Opera",
        "https://placehold.co/640x960.png?text=Space+Opera",
        "Large-scale interstellar adventure with political and military conflict.",
        2,
      ],
      [
        9,
        "Anthology",
        "https://placehold.co/640x960.png?text=Anthology",
        "Collections of multiple works around a theme, author, or concept.",
        1,
      ],
    ];

    const insertManyGenres = db.transaction((genres: SeedGenreRow[]) => {
      for (const genre of genres) {
        insertGenre.run(...genre);
      }
    });

    insertManyGenres(genres);
  }

  if (bookGenreCount.count === 0) {
    const linkBookGenre = db.prepare(`
      INSERT INTO book_genres (book_id, genre_id)
      SELECT ?, ?
      WHERE EXISTS (SELECT 1 FROM books WHERE id = ?)
        AND EXISTS (SELECT 1 FROM genres WHERE id = ?)
    `);

    const bookGenres: SeedBookGenreRow[] = [
      [2, 4],
      [3, 5],
      [4, 3],
      [5, 2],
      [5, 6],
      [8, 4],
      [13, 9],
      [16, 8],
      [17, 3],
      [18, 4],
      [19, 3],
      [19, 7],
      [21, 2],
      [22, 6],
      [28, 4],
      [28, 6],
      [29, 3],
      [29, 7],
      [34, 1],
    ];

    const insertManyBookGenres = db.transaction(
      (bookGenres: SeedBookGenreRow[]) => {
        for (const [bookId, genreId] of bookGenres) {
          linkBookGenre.run(bookId, genreId, bookId, genreId);
        }
      },
    );

    insertManyBookGenres(bookGenres);
  }
}

// Initialize database on module load
initializeDatabase();
seedDatabase();

export { db };
