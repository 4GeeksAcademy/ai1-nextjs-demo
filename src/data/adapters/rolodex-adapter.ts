import type { IFriend } from "@/types";

export type NewFriendInput = {
  name: string;
  phone: string;
  email: string;
};

/**
 * RolodexAdapter interface defines the contract for rolodex data operations.
 * Implementations can use in-memory storage, databases, APIs, etc.
 */
export interface RolodexAdapter {
  /**
   * Get all friends in the rolodex
   */
  getAll(): IFriend[];

  /**
   * Find a friend by their ID
   */
  findById(id: number): IFriend | undefined;

  /**
   * Add a new friend to the rolodex
   */
  add(input: NewFriendInput): IFriend;
}
