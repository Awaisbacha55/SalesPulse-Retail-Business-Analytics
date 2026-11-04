// ==============================================================================
// SalesPulse Dashboard — PostgreSQL Connection Pool (Neon & Local)
// ==============================================================================

import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (pool) return pool;

  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL ||
    `postgresql://${process.env.DB_USER || "postgres"}:${encodeURIComponent(
      process.env.DB_PASSWORD || ""
    )}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"}/${
      process.env.DB_NAME || "salespulse"
    }`;

  const isRemote =
    connectionString.includes("neon.tech") ||
    connectionString.includes("sslmode=require") ||
    connectionString.includes("aws.neon.tech") ||
    !connectionString.includes("localhost");

  pool = new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
  });

  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
  });

  return pool;
}

export async function checkDbConnection(): Promise<{
  connected: boolean;
  database?: string;
  version?: string;
  latencyMs?: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const res = await query<{ alive: number; db: string; version: string }>(
      "SELECT 1 AS alive, current_database() AS db, split_part(version(), ' ', 2) AS version"
    );
    const latency = Date.now() - start;
    return {
      connected: true,
      database: res.rows[0]?.db || "salespulse",
      version: res.rows[0]?.version || "17",
      latencyMs: latency,
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error?.message || "Failed to connect to database",
    };
  }
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

