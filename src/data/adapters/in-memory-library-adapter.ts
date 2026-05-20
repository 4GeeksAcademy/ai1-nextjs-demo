import type { IBook, LibraryType } from "@/types";
import type { LibraryAdapter, NewBookInput } from "./library-adapter";

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

/**
 * InMemoryLibraryAdapter implements the LibraryAdapter interface using in-memory storage.
 * This is useful for development and testing. Can be easily swapped with a database adapter.
 */
export class InMemoryLibraryAdapter implements LibraryAdapter {
  private storage: LibraryType;

  constructor(initialData: LibraryType = seedLibrary) {
    this.storage = [...initialData];
  }

  getAll(): IBook[] {
    return this.storage.map((book) => ({
      ...book,
      cover_img: normalizeCoverImage(book.cover_img),
    }));
  }

  findById(id: number): IBook | undefined {
    const book = this.storage.find((entry) => entry.id === id);

    if (!book) {
      return undefined;
    }

    return {
      ...book,
      cover_img: normalizeCoverImage(book.cover_img),
    };
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
      summary: input.summary.trim(),
      added: new Date(),
    };

    this.storage.unshift(book);
    return book;
  }
}
