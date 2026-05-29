interface IGenre {
  id: number;
  name: string;
  cover_img: string;
  description: string;
  parent_genre_id?: number;
  subgenres?: IGenre[];
}

interface IBook {
  id: number;
  title: string;
  isbn: string;
  cover_img: string;
  open_library_id?: string;
  summary: string;
  added: Date;
  genres?: IGenre[];
}

interface IFriend {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface ILoan {
  id: number;
  friendId: number;
  bookId: number;
  checkedOut: Date;
  returnedAt?: Date;
}

type LibraryType = IBook[];
type RolodexType = IFriend[];
type LoanLedgerType = ILoan[];

export {
  IGenre,
  IBook,
  IFriend,
  ILoan,
  LibraryType,
  RolodexType,
  LoanLedgerType,
};
