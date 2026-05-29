import { dataProvider } from "./adapters/provider";
import type { RolodexAdapter } from "./adapters/rolodex-adapter";

/**
 * The rolodex adapter instance. Can be swapped with different implementations
 * (e.g., InMemoryRolodexAdapter) without changing consuming code.
 */
let rolodexAdapterPromise: Promise<RolodexAdapter> | null = null;

async function getRolodexAdapter() {
  if (!rolodexAdapterPromise) {
    rolodexAdapterPromise =
      dataProvider === "postgres"
        ? import("./adapters/postgres-rolodex-adapter").then(
            ({ PostgresRolodexAdapter }) => new PostgresRolodexAdapter(),
          )
        : import("./adapters/database-rolodex-adapter").then(
            ({ DatabaseRolodexAdapter }) => new DatabaseRolodexAdapter(),
          );
  }

  return rolodexAdapterPromise;
}

/**
 * Get all friends in the rolodex
 */
export async function getRolodex() {
  const rolodexAdapter = await getRolodexAdapter();
  return rolodexAdapter.getAll();
}

/**
 * Find a friend by their ID
 */
export async function findFriendById(id: number) {
  const rolodexAdapter = await getRolodexAdapter();
  return rolodexAdapter.findById(id);
}

/**
 * Add a new friend to the rolodex
 */
export async function addFriendToRolodex(input: {
  name: string;
  phone: string;
  email: string;
}) {
  const rolodexAdapter = await getRolodexAdapter();
  return rolodexAdapter.add(input);
}
