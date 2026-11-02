// ==============================================================================
// SalesPulse Dashboard — PostgreSQL Connection Pool (Neon & Local)
// ==============================================================================

import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (pool) return pool;

  const connectionString =
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER || "postgres"}:${encodeURIComponent(
      process.env.DB_PASSWORD || ""
    )}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"}/${
      process.env.DB_NAME || "salespulse"
    }`;

  const isRemote =
    connectionString.includes("neon.tech") ||
    connectionString.includes("sslmode=require") ||
    !connectionString.includes("localhost");

  pool = new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
  });

  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: (string | number | boolean | null | undefined)[] = []
): Promise<QueryResult<T>> {
  const db = getDbPool();
  const start = Date.now();
  try {
    const res = await db.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log(`[SQL Query] executed in ${duration}ms, rows: ${res.rowCount}`);
    }
    return res;
  } catch (error) {
    console.error("[SQL Query Error]", error, { query: text, params });
    throw error;
  }
}

