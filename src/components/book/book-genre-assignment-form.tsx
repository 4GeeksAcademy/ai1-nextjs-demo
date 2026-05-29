import { updateBookGenres } from "@/data/actions";

type FlatGenreOption = {
  id: number;
  name: string;
  level: number;
};

type BookGenreAssignmentFormProps = {
  bookId: number;
  genreOptions: FlatGenreOption[];
  selectedGenreIds: Set<number>;
};

export default function BookGenreAssignmentForm({
  bookId,
  genreOptions,
  selectedGenreIds,
}: BookGenreAssignmentFormProps) {
  return (
    <form action={updateBookGenres} className="space-y-3">
      <input type="hidden" name="book_id" value={bookId} />

      {genreOptions.length ? (
        <div className="grid max-h-56 gap-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/60 p-3">
          {genreOptions.map((genre) => (
            <label
              key={genre.id}
              className="flex items-center gap-2 text-sm text-slate-200"
              style={{ paddingLeft: `${genre.level * 14}px` }}
            >
              <input
                type="checkbox"
                name="genre_ids"
                value={genre.id}
                defaultChecked={selectedGenreIds.has(genre.id)}
                className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-cyan-400 focus:ring-cyan-500"
              />
              <span>{genre.name}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No genres available yet.</p>
      )}

      <button
        type="submit"
        className="inline-flex items-center rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
      >
        Save Genres
      </button>
    </form>
  );
}
