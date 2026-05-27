import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "library.db");
const db = new Database(dbPath);

type SeedBookRow = [number, string, string, string, string, string];
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
  const bookColumns = db
    .prepare("PRAGMA table_info(books)")
    .all() as Array<{ name: string }>;
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
}

/**
 * Seed the database with initial data if empty
 */
export function seedDatabase() {
  const bookCount = db.prepare("SELECT COUNT(*) as count FROM books").get() as {
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
}

// Initialize database on module load
initializeDatabase();
seedDatabase();

export { db };
