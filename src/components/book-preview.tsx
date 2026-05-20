import Image from "next/image";

type BookPreviewProps = {
  title: string;
  isbn: string;
  coverImg: string;
  summary: string;
};

export default function BookPreview({
  title,
  isbn,
  coverImg,
  summary,
}: BookPreviewProps) {
  const displayTitle = title || "Book Title";
  const displayIsbn = isbn || "ISBN";
  const displaySummary = summary || "Book summary will appear here...";
  const displayCover =
    coverImg.trimEnd() || "https://placehold.co/640x960.png?text=Book+Cover";

  return (
    <div className="sticky top-6">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-cyan-300/90">
        Live Preview
      </p>
      <article className="grid w-full gap-6 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur">
        <div className="relative mx-auto w-full max-w-64 overflow-hidden rounded-xl bg-slate-800">
          <Image
            src={displayCover}
            alt={`${displayTitle} cover`}
            width={640}
            height={960}
            className="h-auto w-full object-cover"
            unoptimized
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-cyan-300/90">
              Book Detail
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
              {displayTitle}
            </h2>
          </div>

          <p className="text-sm leading-6 text-slate-300">{displaySummary}</p>

          <dl className="grid gap-3 rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-xs text-slate-300">
            <div>
              <dt className="font-medium text-slate-400">Book ID</dt>
              <dd className="mt-1 text-slate-500">Preview</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-400">ISBN</dt>
              <dd className="mt-1 font-mono">{displayIsbn}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-400">Added</dt>
              <dd className="mt-1">{new Date().toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  );
}
