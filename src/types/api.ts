export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ResultState = {
  operation: string;
  status: number;
  ok: boolean;
  body: unknown;
} | null;
