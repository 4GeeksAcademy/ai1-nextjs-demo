import { FriendCatalog } from "@/components";
import { getRolodex } from "@/data/rolodex";

export const dynamic = "force-dynamic";

export default function FriendsPage() {
  const rolodex = getRolodex();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <FriendCatalog friends={rolodex} />
    </main>
  );
}
