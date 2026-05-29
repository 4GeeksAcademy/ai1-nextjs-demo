import Link from "next/link";
import { notFound } from "next/navigation";

import { findFriendById } from "@/data/rolodex";

type FriendPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FriendPage({ params }: FriendPageProps) {
  const { id } = await params;
  const friendId = Number(id);

  if (!Number.isInteger(friendId)) {
    notFound();
  }

  const friend = await findFriendById(friendId);

  if (!friend) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 px-6 py-10 sm:px-10 sm:py-12">
      <article className="grid w-full gap-8 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur md:grid-cols-[320px_1fr] md:gap-10 md:p-8">
        <div className="relative mx-auto flex w-full max-w-80 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 py-20">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-cyan-500/20 text-6xl font-bold text-cyan-300 ring-8 ring-cyan-500/30">
            {friend.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-300/90">
              Friend Detail
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              {friend.name}
            </h1>
          </div>

          <dl className="grid gap-4 rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-sm text-slate-300 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-400">Friend ID</dt>
              <dd className="mt-1">{friend.id}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-400">Phone</dt>
              <dd className="mt-1 font-mono">{friend.phone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium text-slate-400">Email</dt>
              <dd className="mt-1">{friend.email}</dd>
            </div>
          </dl>

          <Link
            href="/friends"
            className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Friends
          </Link>
        </div>
      </article>
    </main>
  );
}
