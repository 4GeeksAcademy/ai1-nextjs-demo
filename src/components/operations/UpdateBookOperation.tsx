import { OperationCard } from '../OperationCard'

type UpdateBookOperationProps = {
  loadingOperation: string
  idValue: string
  jsonValue: string
  onIdChange: (value: string) => void
  onJsonChange: (value: string) => void
  onRunPut: () => void
  onRunPatch: () => void
}

export function UpdateBookOperation({
  loadingOperation,
  idValue,
  jsonValue,
  onIdChange,
  onJsonChange,
  onRunPut,
  onRunPatch,
}: UpdateBookOperationProps) {
  return (
    <OperationCard
      title="PUT /library/{id} and PATCH /library/{id}"
      description="Update a book by ID"
      className="md:col-span-2"
    >
      <input
        value={idValue}
        onChange={(event) => onIdChange(event.target.value)}
        placeholder="Book ID"
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <textarea
        value={jsonValue}
        onChange={(event) => onJsonChange(event.target.value)}
        rows={12}
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onRunPut}
          disabled={loadingOperation !== ''}
        >
          {loadingOperation === 'Update Book (PUT)' ? 'Running...' : 'Run PUT'}
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onRunPatch}
          disabled={loadingOperation !== ''}
        >
          {loadingOperation === 'Update Book (PATCH)' ? 'Running...' : 'Run PATCH'}
        </button>
      </div>
    </OperationCard>
  )
}
