"use server";

import { redirect } from "next/navigation";
import {
  addBookToLibrary,
  addGenreToLibrary,
  deleteGenreFromLibrary,
  getGenres,
  setBookGenres,
  updateGenreInLibrary,
} from "@/data/library";
import { addFriendToRolodex } from "@/data/rolodex";
import { createLoan, returnLoan } from "@/data/loans";
import {
  lookupOpenLibraryBookData,
  searchOpenLibraryBooks,
} from "@/data/open-library";

export async function createBook(formData: FormData) {
  const title = formData.get("title")?.toString().trim() || "";
  const isbn = formData.get("isbn")?.toString().trim() || "";
  const coverImg = formData.get("cover_img")?.toString().trim() || "";
  const openLibraryId =
    formData.get("open_library_id")?.toString().trim() || "";
  const summary = formData.get("summary")?.toString().trim() || "";
  const genreIds = formData
    .getAll("genre_ids")
    .map((value) => Number(value.toString()))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (!title || !isbn) {
    throw new Error("Title and ISBN are required");
  }

  const book = addBookToLibrary({
    title,
    isbn,
    summary,
    cover_img: coverImg,
    open_library_id: openLibraryId || undefined,
    genreIds,
  });

  redirect(`/catalog/${book.id}`);
}

export async function getLibraryGenres() {
  return getGenres();
}

export async function createGenre(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const coverImg = String(formData.get("cover_img") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const parentGenreIdRaw = Number(formData.get("parent_genre_id"));
  const parentGenreId =
    Number.isInteger(parentGenreIdRaw) && parentGenreIdRaw > 0
      ? parentGenreIdRaw
      : undefined;

  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  const genre = addGenreToLibrary({
    name,
    cover_img: coverImg,
    description,
    parent_genre_id: parentGenreId,
  });

  redirect(`/genres/${genre.id}`);
}

export async function updateGenre(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const coverImg = String(formData.get("cover_img") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const parentGenreIdRaw = Number(formData.get("parent_genre_id"));
  const parentGenreId =
    Number.isInteger(parentGenreIdRaw) && parentGenreIdRaw > 0
      ? parentGenreIdRaw
      : undefined;

  if (!Number.isInteger(id) || !name || !description) {
    throw new Error("Invalid genre payload");
  }

  const genre = updateGenreInLibrary({
    id,
    name,
    cover_img: coverImg,
    description,
    parent_genre_id: parentGenreId,
  });

  if (!genre) {
    throw new Error("Genre not found");
  }

  redirect(`/genres/${genre.id}`);
}

export async function deleteGenre(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid genre id");
  }

  const deleted = deleteGenreFromLibrary(id);

  if (!deleted) {
    throw new Error("Genre not found");
  }

  redirect("/genres");
}

export async function updateBookGenres(formData: FormData) {
  const bookId = Number(formData.get("book_id"));
  const genreIds = formData
    .getAll("genre_ids")
    .map((value) => Number(value.toString()))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (!Number.isInteger(bookId) || bookId <= 0) {
    throw new Error("Invalid book id");
  }

  setBookGenres(bookId, genreIds);

  redirect(`/catalog/${bookId}`);
}

export async function getOpenLibraryBookData(rawIsbn: string) {
  return lookupOpenLibraryBookData(rawIsbn);
}

export async function searchOpenLibraryCatalog(query: string) {
  return searchOpenLibraryBooks(query);
}

export async function createFriend(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !phone || !email) {
    return;
  }

  const friend = addFriendToRolodex({
    name,
    phone,
    email,
  });

  redirect(`/friends/${friend.id}`);
}

export async function loanBook(formData: FormData) {
  const friendId = Number(formData.get("friendId"));
  const bookId = Number(formData.get("bookId"));

  if (!friendId || !bookId) {
    throw new Error("Friend and Book are required");
  }

  createLoan({
    friendId,
    bookId,
  });

  redirect(`/loans`);
}

export async function markLoanReturned(loanId: number) {
  if (!returnLoan(loanId)) {
    throw new Error("Loan not found");
  }

  redirect("/loans");
}
