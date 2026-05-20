import FriendCatalogHeader from "@/components/friend-catalog-header";
import FriendCatalogItem from "@/components/friend-catalog-item";

import type { RolodexType } from "@/types";

type FriendCatalogProps = {
  friends: RolodexType;
};

export default function FriendCatalog({ friends }: FriendCatalogProps) {
  return (
    <section className="w-full">
      <FriendCatalogHeader />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {friends.map((friend) => (
          <FriendCatalogItem key={friend.id} friend={friend} />
        ))}
      </div>
    </section>
  );
}
