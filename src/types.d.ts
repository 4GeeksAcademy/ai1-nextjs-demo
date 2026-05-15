interface IGenre {
  id: number;
  name: string;
  cover_img: string;
  description: string;
}

interface IBook {
  id: number;
  title: string;
  isbn: string;
  cover_img: string;
  summary: string;
  added: Date;
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

export { IBook, IFriend, ILoan, LibraryType, RolodexType, LoanLedgerType };
