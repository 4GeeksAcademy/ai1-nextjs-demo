type DataProvider = "sqlite" | "postgres";

const configuredProvider = (process.env.DATA_PROVIDER ?? "").toLowerCase();

export const dataProvider: DataProvider =
  configuredProvider === "postgres" ||
  (configuredProvider !== "sqlite" &&
    Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL))
    ? "postgres"
    : "sqlite";
