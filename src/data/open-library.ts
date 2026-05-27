const OPEN_LIBRARY_BASE = "https://openlibrary.org";
const OPEN_LIBRARY_COVERS_BASE = "https://covers.openlibrary.org";

type OpenLibraryDescription =
  | string
  | {
      value?: string;
    }
  | undefined;

type OpenLibraryEdition = {
  title?: string;
  description?: OpenLibraryDescription;
  covers?: number[];
  works?: Array<{
    key?: string;
  }>;
};

type OpenLibraryWork = {
  description?: OpenLibraryDescription;
};

type OpenLibrarySearchResponse = {
  docs?: OpenLibrarySearchDoc[];
};

type OpenLibrarySearchDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  isbn?: string[];
  cover_i?: number;
};

export type OpenLibraryBookData = {
  title: string;
  summary: string;
  cover_img: string;
};

export type OpenLibraryBookSearchResult = {
  key: string;
  title: string;
  author: string;
  isbn: string;
  cover_img: string;
};

const REQUEST_TIMEOUT_MS = 5000;

function normalizeIsbn(input: string) {
  return input.replace(/[^0-9Xx]/g, "").toUpperCase();
}

function extractDescription(description: OpenLibraryDescription) {
  if (!description) {
    return "";
  }

  if (typeof description === "string") {
    return description.trim();
  }

  return (description.value || "").trim();
}

async function fetchJson<T>(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchOpenLibraryEdition(isbn: string) {
  return fetchJson<OpenLibraryEdition>(
    `${OPEN_LIBRARY_BASE}/isbn/${encodeURIComponent(isbn)}.json`,
  );
}

async function fetchOpenLibraryWorkDescription(workKey?: string) {
  if (!workKey || !workKey.startsWith("/works/")) {
    return "";
  }

  const work = await fetchJson<OpenLibraryWork>(
    `${OPEN_LIBRARY_BASE}${workKey}.json`,
  );

  return extractDescription(work?.description);
}

function buildCoverFromCoverId(coverId: number) {
  return `${OPEN_LIBRARY_COVERS_BASE}/b/id/${coverId}-L.jpg`;
}

function buildCoverFromIsbn(isbn: string) {
  return `${OPEN_LIBRARY_COVERS_BASE}/b/isbn/${encodeURIComponent(isbn)}-L.jpg`;
}

function getSearchResultIsbn(isbns: string[] | undefined) {
  if (!isbns?.length) {
    return "";
  }

  for (const candidate of isbns) {
    const normalized = normalizeIsbn(candidate);
    if (normalized.length === 10 || normalized.length === 13) {
      return normalized;
    }
  }

  return normalizeIsbn(isbns[0] || "");
}

function mapSearchDocToResult(
  doc: OpenLibrarySearchDoc,
): OpenLibraryBookSearchResult | null {
  const isbn = getSearchResultIsbn(doc.isbn);

  if (!doc.title || !isbn) {
    return null;
  }

  const cover_img =
    typeof doc.cover_i === "number" && doc.cover_i > 0
      ? buildCoverFromCoverId(doc.cover_i)
      : buildCoverFromIsbn(isbn);

  return {
    key: doc.key || `${isbn}:${doc.title}`,
    title: doc.title.trim(),
    author: (doc.author_name?.[0] || "Unknown author").trim(),
    isbn,
    cover_img,
  };
}

export async function searchOpenLibraryBooks(
  query: string,
): Promise<OpenLibraryBookSearchResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const searchParams = new URLSearchParams({
    q: normalizedQuery,
    limit: "20",
    fields: "key,title,author_name,isbn,cover_i,cover_edition_key",
  });

  const response = await fetchJson<OpenLibrarySearchResponse>(
    `${OPEN_LIBRARY_BASE}/search.json?${searchParams.toString()}`,
  );

  if (!response?.docs?.length) {
    return [];
  }

  const results = response.docs
    .map(mapSearchDocToResult)
    .filter((result): result is OpenLibraryBookSearchResult => result !== null);

  const uniqueResults = new Map<string, OpenLibraryBookSearchResult>();

  for (const result of results) {
    if (!uniqueResults.has(result.isbn)) {
      uniqueResults.set(result.isbn, result);
    }
  }

  return [...uniqueResults.values()];
}

export async function lookupOpenLibraryBookData(
  rawIsbn: string,
): Promise<OpenLibraryBookData | null> {
  const normalizedIsbn = normalizeIsbn(rawIsbn);

  if (!normalizedIsbn) {
    return null;
  }

  const edition = await fetchOpenLibraryEdition(normalizedIsbn);

  if (!edition?.title) {
    return null;
  }

  const title = edition.title.trim();
  const editionSummary = extractDescription(edition.description);
  const workSummary = await fetchOpenLibraryWorkDescription(
    edition.works?.[0]?.key,
  );
  const summary = editionSummary || workSummary;

  const coverId = edition.covers?.find((id) => Number.isFinite(id));
  const cover_img =
    typeof coverId === "number" && coverId > 0
      ? buildCoverFromCoverId(coverId)
      : buildCoverFromIsbn(normalizedIsbn);

  return {
    title,
    summary,
    cover_img,
  };
}
