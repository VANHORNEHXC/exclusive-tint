import postgres from "postgres";

/**
 * Conexión cliente a Neon DB utilizando postgres.js
 * Soporta pooling para entornos serverless y persistencia en desarrollo (Hot Reload).
 */

const connectionString =
  process.env.DATABASE_URL_POOLED ||
  process.env.DATABASE_URL ||
  "";

if (!connectionString && process.env.NODE_ENV !== "test") {
  console.warn(
    "[db.ts] ⚠️ Advertencia: No se encontró DATABASE_URL ni DATABASE_URL_POOLED en las variables de entorno."
  );
}

declare global {
  var __exclusiveTintSqlClient: ReturnType<typeof postgres> | undefined;
}

export const sql =
  globalThis.__exclusiveTintSqlClient ??
  postgres(connectionString, {
    ssl: "require",
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    transform: {
      undefined: null,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__exclusiveTintSqlClient = sql;
}

export default sql;
