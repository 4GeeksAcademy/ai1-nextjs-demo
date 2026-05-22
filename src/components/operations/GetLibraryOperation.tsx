import { OperationCard } from "../OperationCard";

type GetLibraryOperationProps = {
  loadingOperation: string;
  onRun: () => void;
};

export function GetLibraryOperation({
  loadingOperation,
  onRun,
}: GetLibraryOperationProps) {
  return (
    <OperationCard title="GET /library" description="Read all books">
      <button
        type="button"
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onRun}
        disabled={loadingOperation !== ""}
      >
        {loadingOperation === "Read Library" ? "Running..." : "Run"}
      </button>
    </OperationCard>
  );
}
