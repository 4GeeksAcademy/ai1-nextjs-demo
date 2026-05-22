import { useState } from "react";

import type { HttpMethod, ResultState } from "../types/api";

const API_BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : import.meta.env.DEV
    ? "/api"
    : "https://library.dotlag.space";

export function useLibraryApi() {
  const [loadingOperation, setLoadingOperation] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResultState>(null);

  const runRequest = async (
    operation: string,
    method: HttpMethod,
    path: string,
    rawBody?: string,
  ) => {
    setLoadingOperation(operation);
    setError("");

    try {
      let parsedBody: unknown;
      if (rawBody !== undefined) {
        parsedBody = JSON.parse(rawBody);
      }

      const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers:
          parsedBody !== undefined
            ? { "Content-Type": "application/json" }
            : undefined,
        body: parsedBody !== undefined ? JSON.stringify(parsedBody) : undefined,
      });

      const text = await response.text();
      let parsedResponse: unknown = text;

      if (text) {
        try {
          parsedResponse = JSON.parse(text);
        } catch {
          parsedResponse = text;
        }
      }

      setResult({
        operation,
        status: response.status,
        ok: response.ok,
        body: parsedResponse,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "An unexpected error happened while calling the API.",
      );
    } finally {
      setLoadingOperation("");
    }
  };

  const parseId = (value: string) => {
    const id = Number(value);
    if (!Number.isInteger(id) || id < 1) {
      setError("Please enter a valid positive integer ID.");
      return null;
    }
    return id;
  };

  const setMessageError = (message: string) => {
    setError(message);
  };

  return {
    loadingOperation,
    error,
    result,
    runRequest,
    parseId,
    setMessageError,
  };
}
