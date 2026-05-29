import type { IBook, IGenre, LibraryType } from "@/types";
import type { LibraryAdapter, NewBookInput } from "./library-adapter";

type InMemoryGenreRow = {
  id: number;
  name: string;
  cover_img: string;
  description: string;
  parent_genre_id: number | null;
};

type InMemoryBookGenreRow = {
  book_id: number;
  genre_id: number;
};

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

const seedLibrary: LibraryType = [
  {
    id: 2,
    title: "Something Wicked This Way Comes",
    isbn: "978-0-380-72940-1",
    cover_img: "/img/2.jpg",
    summary:
      "Two boys in a small town face a sinister traveling carnival whose attractions prey on fear and desire, forcing them into a fight for their souls.",
    added: new Date("2026-04-01"),
  },
  {
    id: 3,
    title: "One Hundred Years of Solitude",
    isbn: "0-380-01503-X",
    cover_img: "/img/3.jpg",
    summary:
      "An epic multi-generational saga of the Buendia family in Macondo, where love, violence, and magical events repeat across a century of rise and decline.",
    added: new Date("2026-04-01"),
  },
  {
    id: 4,
    title: "Snow Crash",
    isbn: "978-061336162",
    cover_img: "/img/4.jpg",
    summary:
      "A fast, satirical cyberpunk thriller where a hacker swordsman and a courier uncover a digital and linguistic threat capable of destabilizing society.",
    added: new Date("2026-04-01"),
  },
  {
    id: 5,
    title: "The Ultimate Hitchiker's Guide To The Galaxy",
    isbn: "978-0-645-45374-7",
    cover_img: "/img/5.jpg",
    summary:
      "A wildly funny spacefaring adventure that follows Arthur Dent and his odd companions through absurd cosmic disasters, bureaucracy, and philosophy.",
    added: new Date("2026-04-01"),
  },
  {
    id: 8,
    title: "Sabriel",
    isbn: "0-06-447183-7",
    cover_img: "/img/8.jpg",
    summary:
      "A young necromancer-in-training crosses into a death-haunted kingdom to rescue her father, using bells, magic, and courage against restless dead.",
    added: new Date("2026-04-01"),
  },
  {
    id: 13,
    title: "On Cats - An Anthology",
    isbn: "978-1-912559-32-9",
    cover_img: "/img/13.jpg",
    summary:
      "A curated collection of cat-themed writing that ranges from affectionate and witty to reflective, showing how felines inspire art and storytelling.",
    added: new Date("2026-04-01"),
  },
  {
    id: 16,
    title: "Consider Phlebas",
    isbn: "978-0-356-52163-3",
    cover_img: "/img/16.jpg",
    summary:
      "During a brutal galactic war, a shapeshifting operative undertakes a dangerous mission that exposes the moral complexity of the Culture universe.",
    added: new Date("2026-04-01"),
  },
  {
    id: 17,
    title: "Cryptonomicon",
    isbn: "978-0-380-78862-0",
    cover_img: "/img/17.jpg",
    summary:
      "Interwoven timelines follow codebreakers, hackers, and treasure hunters as cryptography links World War II secrets to modern information warfare.",
    added: new Date("2026-04-01"),
  },
  {
    id: 18,
    title: "Ill Met In Lankhmar",
    isbn: "9781565048942",
    cover_img: "/img/18.jpg",
    summary:
      "Classic sword-and-sorcery tales featuring Fafhrd and the Gray Mouser, two rogues whose heists and rivalries in Lankhmar mix danger with dark humor.",
    added: new Date("2026-04-01"),
  },
  {
    id: 19,
    title: "King City",
    isbn: "978-1-60706-510-4",
    cover_img: "/img/19.jpg",
    summary:
      "A surreal science-fiction comic about a catmaster navigating strange cities, shifting alliances, and personal growth in a vividly weird world.",
    added: new Date("2026-04-01"),
  },
  {
    id: 21,
    title: "The Integral Trees",
    isbn: "N/A",
    cover_img: "/img/21.jpg",
    summary:
      "Humans stranded in a colossal gas torus must survive among floating forests and alien politics in a hard-science adventure set in free fall.",
    added: new Date("2026-04-01"),
  },
  {
    id: 22,
    title: "The War Between The Pitiful Teachers And The Splendid Kids",
    isbn: "N/A",
    cover_img: "/img/22.jpg",
    summary:
      "A satirical school story where students and teachers clash in escalating comic rebellion, poking fun at authority and classroom absurdities.",
    added: new Date("2026-04-01"),
  },
  {
    id: 28,
    title: "The Everything Box",
    isbn: "N/A",
    cover_img: "/img/28.jpg",
    summary:
      "A thief accidentally steals a magical box tied to old gods, kicking off a chaotic urban fantasy chase filled with cults, demons, and sharp humor.",
    added: new Date("2026-04-01"),
  },
  {
    id: 29,
    title: "Transmetropolitan Book One",
    isbn: "978-1401287955",
    cover_img: "/img/29.jpg",
    summary:
      "In a corrupt future metropolis, outlaw journalist Spider Jerusalem wages a foul-mouthed war on power, media manipulation, and political rot.",
    added: new Date("2026-04-01"),
  },
  {
    id: 34,
    title: "Tomorrow And Tomorrow And Tomorrow",
    isbn: "978-0-593-46649-0",
    cover_img: "/img/34.jpg",
    summary:
      "Two friends build a groundbreaking video game studio over decades, exploring ambition, creativity, love, and the complicated ways people collaborate.",
    added: new Date("2026-04-01"),
  },
];

const seedGenres: InMemoryGenreRow[] = [
  {
    id: 1,
    name: "Fiction",
    cover_img: "https://placehold.co/640x960.png?text=Fiction",
    description: "Narrative literature created primarily from imagination.",
    parent_genre_id: null,
  },
  {
    id: 2,
    name: "Sci-Fi",
    cover_img: "https://placehold.co/640x960.png?text=Sci-Fi",
    description:
      "Speculative fiction centered on science, technology, and future worlds.",
    parent_genre_id: 1,
  },
  {
    id: 3,
    name: "Cyberpunk",
    cover_img: "https://placehold.co/640x960.png?text=Cyberpunk",
    description:
      "High-tech, low-life stories featuring corporate dystopias and networked worlds.",
    parent_genre_id: 2,
  },
  {
    id: 4,
    name: "Fantasy",
    cover_img: "https://placehold.co/640x960.png?text=Fantasy",
    description:
      "Stories driven by magic, mythic settings, and supernatural elements.",
    parent_genre_id: 1,
  },
  {
    id: 5,
    name: "Magical Realism",
    cover_img: "https://placehold.co/640x960.png?text=Magical+Realism",
    description:
      "Realistic worlds where magical events appear as natural parts of life.",
    parent_genre_id: 1,
  },
  {
    id: 6,
    name: "Humor",
    cover_img: "https://placehold.co/640x960.png?text=Humor",
    description: "Stories that emphasize satire, absurdity, and comic voice.",
    parent_genre_id: 1,
  },
  {
    id: 7,
    name: "Comics",
    cover_img: "https://placehold.co/640x960.png?text=Comics",
    description: "Graphic storytelling through sequential visual panels.",
    parent_genre_id: 1,
  },
  {
    id: 8,
    name: "Space Opera",
    cover_img: "https://placehold.co/640x960.png?text=Space+Opera",
    description:
      "Large-scale interstellar adventure with political and military conflict.",
    parent_genre_id: 2,
  },
  {
    id: 9,
    name: "Anthology",
    cover_img: "https://placehold.co/640x960.png?text=Anthology",
    description:
      "Collections of multiple works around a theme, author, or concept.",
    parent_genre_id: 1,
  },
];

const seedBookGenres: InMemoryBookGenreRow[] = [
  { book_id: 2, genre_id: 4 },
  { book_id: 3, genre_id: 5 },
  { book_id: 4, genre_id: 3 },
  { book_id: 5, genre_id: 2 },
  { book_id: 5, genre_id: 6 },
  { book_id: 8, genre_id: 4 },
  { book_id: 13, genre_id: 9 },
  { book_id: 16, genre_id: 8 },
  { book_id: 17, genre_id: 3 },
  { book_id: 18, genre_id: 4 },
  { book_id: 19, genre_id: 3 },
  { book_id: 19, genre_id: 7 },
  { book_id: 21, genre_id: 2 },
  { book_id: 22, genre_id: 6 },
  { book_id: 28, genre_id: 4 },
  { book_id: 28, genre_id: 6 },
  { book_id: 29, genre_id: 3 },
  { book_id: 29, genre_id: 7 },
  { book_id: 34, genre_id: 1 },
];

/**
 * InMemoryLibraryAdapter implements the LibraryAdapter interface using in-memory storage.
 * This is useful for development and testing. Can be easily swapped with a database adapter.
 */
export class InMemoryLibraryAdapter implements LibraryAdapter {
  private storage: LibraryType;
  private genres: InMemoryGenreRow[];
  private bookGenres: InMemoryBookGenreRow[];

  constructor(
    initialData: LibraryType = seedLibrary,
    initialGenres: InMemoryGenreRow[] = seedGenres,
    initialBookGenres: InMemoryBookGenreRow[] = seedBookGenres,
  ) {
    this.storage = [...initialData];
    this.genres = [...initialGenres];
    this.bookGenres = [...initialBookGenres];
  }

  private toGenre(row: InMemoryGenreRow): IGenre {
    return {
      id: row.id,
      name: row.name,
      cover_img: normalizeCoverImage(row.cover_img),
      description: row.description,
      parent_genre_id: row.parent_genre_id ?? undefined,
    };
  }

  private withAssignedGenres(book: IBook): IBook {
    return {
      ...book,
      genres: this.findGenresByBookId(book.id),
    };
  }

  getAll(): IBook[] {
    return this.storage.map((book) =>
      this.withAssignedGenres({
        ...book,
        cover_img: normalizeCoverImage(book.cover_img),
      }),
    );
  }

  getAllGenres(): IGenre[] {
    const byParent = new Map<number | null, InMemoryGenreRow[]>();

    for (const genre of this.genres) {
      const list = byParent.get(genre.parent_genre_id) ?? [];
      list.push(genre);
      byParent.set(genre.parent_genre_id, list);
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

  findById(id: number): IBook | undefined {
    const book = this.storage.find((entry) => entry.id === id);

    if (!book) {
      return undefined;
    }

    return this.withAssignedGenres({
      ...book,
      cover_img: normalizeCoverImage(book.cover_img),
    });
  }

  findGenresByBookId(bookId: number): IGenre[] {
    const genreIds = new Set(
      this.bookGenres
        .filter((entry) => entry.book_id === bookId)
        .map((entry) => entry.genre_id),
    );

    return this.genres
      .filter((genre) => genreIds.has(genre.id))
      .map((genre) => this.toGenre(genre));
  }

  add(input: NewBookInput): IBook {
    const currentMaxId = this.storage.reduce(
      (maxId, book) => Math.max(maxId, book.id),
      0,
    );

    const book: IBook = {
      id: currentMaxId + 1,
      title: input.title.trim(),
      isbn: input.isbn.trim(),
      cover_img: normalizeCoverImage(input.cover_img),
      open_library_id: input.open_library_id?.trim() || undefined,
      summary: input.summary.trim(),
      added: new Date(),
    };

    this.storage.unshift(book);
    if (input.genreIds && input.genreIds.length > 0) {
      this.setGenresForBook(book.id, input.genreIds);
    }

    return this.withAssignedGenres(book);
  }

  setGenresForBook(bookId: number, genreIds: number[]): IGenre[] {
    const hasBook = this.storage.some((book) => book.id === bookId);

    if (!hasBook) {
      return [];
    }

    const existingGenreIds = new Set(this.genres.map((genre) => genre.id));
    const normalizedGenreIds = [...new Set(genreIds)]
      .filter((genreId) => Number.isInteger(genreId))
      .filter((genreId) => existingGenreIds.has(genreId));

    this.bookGenres = this.bookGenres.filter(
      (entry) => entry.book_id !== bookId,
    );

    for (const genreId of normalizedGenreIds) {
      this.bookGenres.push({ book_id: bookId, genre_id: genreId });
    }

    return this.findGenresByBookId(bookId);
  }

  findGenreById(id: number): IGenre | undefined {
    const genre = this.genres.find((entry) => entry.id === id);

    if (!genre) {
      return undefined;
    }

    return this.toGenre(genre);
  }

  addGenre(input: {
    name: string;
    cover_img: string;
    description: string;
    parent_genre_id?: number;
  }): IGenre {
    const currentMaxId = this.genres.reduce(
      (maxId, genre) => Math.max(maxId, genre.id),
      0,
    );

    const parentGenreId =
      input.parent_genre_id &&
      this.genres.some((g) => g.id === input.parent_genre_id)
        ? input.parent_genre_id
        : null;

    const genre: InMemoryGenreRow = {
      id: currentMaxId + 1,
      name: input.name.trim(),
      cover_img: normalizeCoverImage(input.cover_img),
      description: input.description.trim(),
      parent_genre_id: parentGenreId,
    };

    this.genres.push(genre);

    return this.toGenre(genre);
  }

  updateGenre(input: {
    id: number;
    name: string;
    cover_img: string;
    description: string;
    parent_genre_id?: number;
  }): IGenre | undefined {
    const idx = this.genres.findIndex((entry) => entry.id === input.id);

    if (idx === -1) {
      return undefined;
    }

    const parentGenreId =
      input.parent_genre_id &&
      input.parent_genre_id !== input.id &&
      this.genres.some((g) => g.id === input.parent_genre_id)
        ? input.parent_genre_id
        : null;

    this.genres[idx] = {
      ...this.genres[idx],
      name: input.name.trim(),
      cover_img: normalizeCoverImage(input.cover_img),
      description: input.description.trim(),
      parent_genre_id: parentGenreId,
    };

    return this.toGenre(this.genres[idx]);
  }

  deleteGenre(id: number): boolean {
    const existingIndex = this.genres.findIndex((genre) => genre.id === id);

    if (existingIndex === -1) {
      return false;
    }

    this.genres.splice(existingIndex, 1);

    // Remove book relationships to the deleted genre.
    this.bookGenres = this.bookGenres.filter((entry) => entry.genre_id !== id);

    // Mirror DB behavior (ON DELETE SET NULL) for child genres.
    this.genres = this.genres.map((genre) =>
      genre.parent_genre_id === id
        ? { ...genre, parent_genre_id: null }
        : genre,
    );

    return true;
  }
}
