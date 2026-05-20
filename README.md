This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- 📚 **Book Catalog** - Browse and manage your book collection
- 👥 **Friends** - Keep track of your friends and their contact info
- 🔄 **Loans** - Loan books to friends and track returns
- 💾 **SQLite Database** - Persistent storage with automatic seeding
- 🎨 **Adapter Pattern** - Easy to swap storage implementations
- 🎯 **Type-Safe** - Full TypeScript support

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database

The application uses SQLite for persistent data storage. On first run, a `library.db` file will be automatically created and seeded with sample data.

To reset the database, simply delete `library.db` and restart the server.

## Architecture

This project demonstrates the **Adapter Design Pattern** for data persistence. See [src/data/README.md](src/data/README.md) for detailed documentation on the data layer architecture.

### Key Components

- **Pages**: `/catalog`, `/friends`, `/loans` - Main application pages
- **Components**: Reusable UI components in `src/components/`
- **Data Layer**: `src/data/` - Adapters and data access logic
- **Database**: `src/lib/database.ts` - SQLite initialization and schema

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
