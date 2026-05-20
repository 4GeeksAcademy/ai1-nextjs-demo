import { DatabaseRolodexAdapter } from "./adapters/database-rolodex-adapter";
import type { RolodexAdapter } from "./adapters/rolodex-adapter";

/**
 * The rolodex adapter instance. Can be swapped with different implementations
 * (e.g., InMemoryRolodexAdapter) without changing consuming code.
 */
const rolodexAdapter: RolodexAdapter = new DatabaseRolodexAdapter();

/**
 * Get all friends in the rolodex
 */
export function getRolodex() {
  return rolodexAdapter.getAll();
}

/**
 * Find a friend by their ID
 */
export function findFriendById(id: number) {
  return rolodexAdapter.findById(id);
}

/**
 * Add a new friend to the rolodex
 */
export function addFriendToRolodex(input: {
  name: string;
  phone: string;
  email: string;
}) {
  return rolodexAdapter.add(input);
}
