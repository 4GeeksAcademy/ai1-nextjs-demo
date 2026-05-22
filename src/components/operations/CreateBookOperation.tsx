import { OperationCard } from "../OperationCard";

type CreateBookOperationProps = {
  loadingOperation: string;
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
};

export function CreateBookOperation({
  loadingOperation,
  value,
  onChange,
  onRun,
}: CreateBookOperationProps) {
  return (
    <OperationCard
      title="POST /library/add"
      description="Create a new book"
      className="md:col-span-2"
    >
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={12}
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
      />
      <button
        type="button"
        className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onRun}
        disabled={loadingOperation !== ""}
      >
        {loadingOperation === "Create Book" ? "Running..." : "Run"}
      </button>
    </OperationCard>
  );
}
