import { OperationCard } from "../OperationCard";

type GetBookOperationProps = {
  loadingOperation: string;
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
};

export function GetBookOperation({
  loadingOperation,
  value,
  onChange,
  onRun,
}: GetBookOperationProps) {
  return (
    <OperationCard title="GET /library/{id}" description="Read one book by ID">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Book ID"
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="button"
        className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onRun}
        disabled={loadingOperation !== ""}
      >
        {loadingOperation === "Read Book" ? "Running..." : "Run"}
      </button>
    </OperationCard>
  );
}
