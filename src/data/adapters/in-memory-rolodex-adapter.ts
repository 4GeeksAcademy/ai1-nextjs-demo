import type { IFriend, RolodexType } from "@/types";
import type { RolodexAdapter, NewFriendInput } from "./rolodex-adapter";

const seedRolodex: RolodexType = [
  {
    id: 1,
    name: "Alice Johnson",
    phone: "(555) 123-4567",
    email: "alice.johnson@email.com",
  },
  {
    id: 2,
    name: "Bob Smith",
    phone: "(555) 234-5678",
    email: "bob.smith@email.com",
  },
  {
    id: 3,
    name: "Carol Martinez",
    phone: "(555) 345-6789",
    email: "carol.martinez@email.com",
  },
  {
    id: 4,
    name: "David Lee",
    phone: "(555) 456-7890",
    email: "david.lee@email.com",
  },
  {
    id: 5,
    name: "Emma Wilson",
    phone: "(555) 567-8901",
    email: "emma.wilson@email.com",
  },
  {
    id: 6,
    name: "Frank Brown",
    phone: "(555) 678-9012",
    email: "frank.brown@email.com",
  },
  {
    id: 7,
    name: "Grace Taylor",
    phone: "(555) 789-0123",
    email: "grace.taylor@email.com",
  },
  {
    id: 8,
    name: "Henry Davis",
    phone: "(555) 890-1234",
    email: "henry.davis@email.com",
  },
];

/**
 * InMemoryRolodexAdapter implements the RolodexAdapter interface using in-memory storage.
 * This is useful for development and testing. Can be easily swapped with a database adapter.
 */
export class InMemoryRolodexAdapter implements RolodexAdapter {
  private storage: RolodexType;

  constructor(initialData: RolodexType = seedRolodex) {
    this.storage = [...initialData];
  }

  getAll(): IFriend[] {
    return this.storage;
  }

  findById(id: number): IFriend | undefined {
    return this.storage.find((entry) => entry.id === id);
  }

  add(input: NewFriendInput): IFriend {
    const currentMaxId = this.storage.reduce(
      (maxId, friend) => Math.max(maxId, friend.id),
      0,
    );

    const friend: IFriend = {
      id: currentMaxId + 1,
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
    };

    this.storage.unshift(friend);
    return friend;
  }
}
