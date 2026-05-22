import type { ResultState } from "../types/api";

type ResultPanelProps = {
  error: string;
  result: ResultState;
};

export function ResultPanel({ error, result }: ResultPanelProps) {
  return (
    <>
      {error && (
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </section>
      )}

      {result && (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold">Operation: {result.operation}</span>
            <span
              className={`rounded px-2 py-1 font-semibold ${
                result.ok
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              HTTP {result.status}
            </span>
          </div>
          <pre className="max-h-96 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
            {JSON.stringify(result.body, null, 2)}
          </pre>
        </section>
      )}
    </>
  );
}
