# Data Layer - Adapter Pattern

This data layer uses the **Adapter Design Pattern** to abstract data storage implementation from the business logic. This makes it easy to swap storage mechanisms (e.g., from in-memory to database) without changing consuming code.

**Current Storage**: SQLite Database (persistent storage)

## Architecture

### Structure

```
src/data/
├── adapters/
│   ├── library-adapter.ts                  # LibraryAdapter interface
│   ├── in-memory-library-adapter.ts        # In-memory implementation
│   ├── database-library-adapter.ts         # SQLite implementation ✅
│   ├── rolodex-adapter.ts                  # RolodexAdapter interface
│   ├── in-memory-rolodex-adapter.ts        # In-memory implementation
│   ├── database-rolodex-adapter.ts         # SQLite implementation ✅
│   ├── loan-adapter.ts                     # LoanAdapter interface
│   ├── in-memory-loan-adapter.ts           # In-memory implementation
│   └── database-loan-adapter.ts            # SQLite implementation ✅
├── actions.ts                              # Server Actions
├── library.ts                              # Library API (uses adapter)
├── rolodex.ts                              # Rolodex API (uses adapter)
└── loans.ts                                # Loans API (uses adapter)

src/lib/
└── database.ts                             # SQLite setup and initialization
```

### Adapters

#### LibraryAdapter

- **Interface**: `LibraryAdapter`
- **Methods**:
  - `getAll()`: Get all books
  - `findById(id)`: Find a book by ID
  - `add(input)`: Add a new book
- **Current Implementation**: `DatabaseLibraryAdapter` (SQLite)
- **Available Implementations**:
  - `InMemoryLibraryAdapter` - For testing/development
  - `DatabaseLibraryAdapter` - For production

#### RolodexAdapter

- **Interface**: `RolodexAdapter`
- **Methods**:
  - `getAll()`: Get all friends
  - `findById(id)`: Find a friend by ID
  - `add(input)`: Add a new friend
- **Current Implementation**: `DatabaseRolodexAdapter` (SQLite)
- **Available Implementations**:
  - `InMemoryRolodexAdapter` - For testing/development
  - `DatabaseRolodexAdapter` - For production

#### LoanAdapter

- **Interface**: `LoanAdapter`
- **Methods**:
  - `getAll()`: Get all loans
  - `getActive()`: Get active loans (not returned)
  - `findById(id)`: Find a loan by ID
  - `findByFriendId(friendId)`: Find loans by friend
  - `findByBookId(bookId)`: Find loans by book
  - `create(input)`: Create a new loan
  - `returnLoan(id)`: Mark a loan as returned
- **Current Implementation**: `DatabaseLoanAdapter` (SQLite)
- **Available Implementations**:
  - `InMemoryLoanAdapter` - For testing/development
  - `DatabaseLoanAdapter` - For production

## Database

### SQLite Setup

The application uses SQLite for persistent data storage. The database is automatically initialized on first run with:

- **Tables**: `books`, `friends`, `loans`
- **Seed Data**: Pre-populated with sample books, friends, and loans
- **Location**: `library.db` in the project root (gitignored)

### Schema

```sql
-- Books table
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  isbn TEXT NOT NULL,
  cover_img TEXT NOT NULL,
  summary TEXT NOT NULL,
  added TEXT NOT NULL
);

-- Friends table
CREATE TABLE friends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL
);

-- Loans table
CREATE TABLE loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  friend_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  checked_out TEXT NOT NULL,
  returned_at TEXT,
  FOREIGN KEY (friend_id) REFERENCES friends(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);
```

## Usage

### Using the Library API

```typescript
import { getLibrary, findBookById, addBookToLibrary } from "@/data/library";

// Get all books
const books = getLibrary();

// Find a specific book
const book = findBookById(42);

// Add a new book
const newBook = addBookToLibrary({
  title: "The Hobbit",
  isbn: "978-0-547-92822-7",
  cover_img: "/img/hobbit.jpg",
  summary: "A hobbit's unexpected journey...",
});
```

### Using the Rolodex API

````

### Using the Loans API

```typescript
import {
  getAllLoans,
  getActiveLoans,
  createLoan,
  returnLoan
} from "@/data/loans";

// Get all loans
const allLoans = getAllLoans();

// Get only active loans (not returned)
const activeLoans = getActiveLoans();

// Create a new loan
const newLoan = createLoan({
  friendId: 5,
  bookId: 42,
});

// Mark a loan as returned
const returned = returnLoan(1);
````

## Switching Between Adapters

The beauty of the adapter pattern is that you can easily switch storage implementations by changing one line of code:

### Switch to In-Memory (for testing)

```typescript
// In src/data/library.ts
import { InMemoryLibraryAdapter } from "./adapters/in-memory-library-adapter";
const libraryAdapter: LibraryAdapter = new InMemoryLibraryAdapter();

// In src/data/rolodex.ts
import { InMemoryRolodexAdapter } from "./adapters/in-memory-rolodex-adapter";
const rolodexAdapter: RolodexAdapter = new InMemoryRolodexAdapter();

// In src/data/loans.ts
import { InMemoryLoanAdapter } from "./adapters/in-memory-loan-adapter";
const loanAdapter: LoanAdapter = new InMemoryLoanAdapter();
```

### Switch to Database (current - production)

```typescript
// In src/data/library.ts
import { DatabaseLibraryAdapter } from "./adapters/database-library-adapter";
const libraryAdapter: LibraryAdapter = new DatabaseLibraryAdapter();

// In src/data/rolodex.ts
import { DatabaseRolodexAdapter } from "./adapters/database-rolodex-adapter";
const rolodexAdapter: RolodexAdapter = new DatabaseRolodexAdapter();

// In src/data/loans.ts
import { DatabaseLoanAdapter } from "./adapters/database-loan-adapter";
const loanAdapter: LoanAdapter = new DatabaseLoanAdapter();
```

**No other code changes needed!** All pages, components, and server actions continue to work identically.

## Benefits

1. **Separation of Concerns**: Business logic is decoupled from data storage
2. **Easy Testing**: Mock adapters can be injected for testing
3. **Flexibility**: Swap implementations without changing consuming code
4. **Maintainability**: Changes to storage logic are isolated to adapters
5. **Persistent Storage**: SQLite provides durable storage across server restarts
6. **Production Ready**: Database adapters ready for deployment

## Notes

- **Current Implementation**: SQLite database with persistent storage
- **Data Location**: `library.db` in project root (automatically created and seeded)
- **Reset Database**: Delete `library.db` file to reset - it will be recreated with seed data
- **Development**: Can switch to in-memory adapters for faster testing
- **Production**: Database adapters provide persistent, reliable storage
