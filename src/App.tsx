import { useState } from "react";

import { ResultPanel } from "./components/ResultPanel";
import { CreateBookOperation } from "./components/operations/CreateBookOperation";
import { DeleteBookOperation } from "./components/operations/DeleteBookOperation";
import { GetBookOperation } from "./components/operations/GetBookOperation";
import { GetLibraryOperation } from "./components/operations/GetLibraryOperation";
import { UpdateBookOperation } from "./components/operations/UpdateBookOperation";
import { useLibraryApi } from "./hooks/useLibraryApi";

const CREATE_EXAMPLE = `{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "cover": null,
  "num_pages": 352,
  "year_published": 1999,
  "isbn13": "9780201616224",
  "isbn10": "020161622X",
  "is_awesome": true,
  "have_read": true
}`;

const UPDATE_EXAMPLE = `{
  "title": "Updated Title",
  "author": "Updated Author",
  "cover": null,
  "num_pages": 320,
  "year_published": 2001,
  "isbn13": null,
  "isbn10": null,
  "is_awesome": true,
  "have_read": false
}`;

function App() {
  const [libraryId, setLibraryId] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [createJson, setCreateJson] = useState(CREATE_EXAMPLE);
  const [updateJson, setUpdateJson] = useState(UPDATE_EXAMPLE);

  const {
    loadingOperation,
    error,
    result,
    runRequest,
    parseId,
    setMessageError,
  } = useLibraryApi();

  const handleDelete = async () => {
    const id = parseId(deleteId);
    if (id === null) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this record?",
    );
    if (!confirmed) {
      setMessageError("Delete cancelled by user.");
      return;
    }

    await runRequest("Delete Book", "DELETE", `/library/${id}`);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-8">
      <section className="mx-auto w-full max-w-5xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <header>
          <p className="text-sm font-semibold tracking-wide text-indigo-700 uppercase">
            OpenAPI Operations Runner
          </p>
          <h1 className="mt-2 text-3xl font-bold">Library API Tester</h1>
          <p className="mt-2 text-slate-600">
            Run every operation from https://library.dotlag.space/openapi.json
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <GetLibraryOperation
            loadingOperation={loadingOperation}
            onRun={() => runRequest("Read Library", "GET", "/library")}
          />

          <GetBookOperation
            loadingOperation={loadingOperation}
            value={libraryId}
            onChange={setLibraryId}
            onRun={() => {
              const id = parseId(libraryId);
              if (id === null) return;
              runRequest("Read Book", "GET", `/library/${id}`);
            }}
          />

          <CreateBookOperation
            loadingOperation={loadingOperation}
            value={createJson}
            onChange={setCreateJson}
            onRun={() =>
              runRequest("Create Book", "POST", "/library/add", createJson)
            }
          />

          <UpdateBookOperation
            loadingOperation={loadingOperation}
            idValue={updateId}
            jsonValue={updateJson}
            onIdChange={setUpdateId}
            onJsonChange={setUpdateJson}
            onRunPut={() => {
              const id = parseId(updateId);
              if (id === null) return;
              runRequest(
                "Update Book (PUT)",
                "PUT",
                `/library/${id}`,
                updateJson,
              );
            }}
            onRunPatch={() => {
              const id = parseId(updateId);
              if (id === null) return;
              runRequest(
                "Update Book (PATCH)",
                "PATCH",
                `/library/${id}`,
                updateJson,
              );
            }}
          />

          <DeleteBookOperation
            loadingOperation={loadingOperation}
            value={deleteId}
            onChange={setDeleteId}
            onDelete={handleDelete}
          />
        </div>

        <ResultPanel error={error} result={result} />
      </section>
    </main>
  );
}

export default App;
