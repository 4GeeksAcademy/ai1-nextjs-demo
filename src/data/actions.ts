"use server";

import { redirect } from "next/navigation";
import { addBookToLibrary } from "@/data/library";
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

  if (!title || !isbn) {
    throw new Error("Title and ISBN are required");
  }

  const book = addBookToLibrary({
    title,
    isbn,
    summary,
    cover_img: coverImg,
    open_library_id: openLibraryId || undefined,
  });

  redirect(`/catalog/${book.id}`);
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
