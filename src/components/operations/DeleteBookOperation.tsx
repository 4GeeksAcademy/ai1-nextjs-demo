import { OperationCard } from "../OperationCard";

type DeleteBookOperationProps = {
  loadingOperation: string;
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
};

export function DeleteBookOperation({
  loadingOperation,
  value,
  onChange,
  onDelete,
}: DeleteBookOperationProps) {
  return (
    <OperationCard
      title="DELETE /library/{id}"
      description="Delete a book by ID (with confirmation)"
      className="border-rose-200 bg-rose-50 md:col-span-2"
      titleClassName="text-rose-900"
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Book ID"
        className="mt-4 w-full rounded-lg border border-rose-300 px-3 py-2 text-sm"
      />
      <button
        type="button"
        className="mt-3 rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onDelete}
        disabled={loadingOperation !== ""}
      >
        {loadingOperation === "Delete Book" ? "Running..." : "Delete"}
      </button>
    </OperationCard>
  );
}
