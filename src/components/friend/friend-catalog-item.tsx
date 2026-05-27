import Link from "next/link";

import type { IFriend } from "@/types";

type FriendCatalogItemProps = {
  friend: IFriend;
};

export default function FriendCatalogItem({ friend }: FriendCatalogItemProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/75 shadow-lg shadow-slate-950/40 transition hover:border-cyan-500/50 hover:shadow-cyan-950/30">
      <Link href={`/friends/${friend.id}`} className="block">
        <div className="relative flex h-52 w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/20 text-4xl font-bold text-cyan-300 ring-4 ring-cyan-500/30">
            {friend.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <h2 className="line-clamp-2 text-lg font-semibold text-slate-100">
            {friend.name}
          </h2>

          <dl className="space-y-1 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <dt className="font-medium text-slate-400">Phone</dt>
              <dd className="font-mono text-xs sm:text-sm">{friend.phone}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="font-medium text-slate-400">Email</dt>
              <dd className="truncate text-xs sm:text-sm">{friend.email}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}
