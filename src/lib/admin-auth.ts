import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

const COOKIE = "et_admin_session";
const SESSION_SECONDS = 7 * 24 * 60 * 60;

type AdminRow = { id: number; username: string; password_hash: string };

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [algorithm, salt, hex] = stored.split(":");
  if (algorithm !== "scrypt" || !salt || !hex || !/^[a-f0-9]{128}$/.test(hex)) return false;
  const expected = Buffer.from(hex, "hex");
  return timingSafeEqual(scryptSync(password, salt, expected.length), expected);
}

function sameText(left: string, right: string): boolean {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function loginAdmin(username: string, password: string): Promise<string | null> {
  if (!username || !password || password.length > 256) return null;
  let [account] = await sql<AdminRow[]>`SELECT id, username, password_hash FROM admin_users WHERE id = 1`;
  if (!account) {
    const envUser = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;
    if (!envUser || !envPassword || !sameText(username, envUser) || !sameText(password, envPassword)) return null;
    await sql`INSERT INTO admin_users (id, username, password_hash)
      VALUES (1, ${envUser}, ${hashPassword(envPassword)}) ON CONFLICT (id) DO NOTHING`;
    [account] = await sql<AdminRow[]>`SELECT id, username, password_hash FROM admin_users WHERE id = 1`;
  }
  if (!account || !sameText(username, account.username) || !verifyPassword(password, account.password_hash)) return null;
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await sql`INSERT INTO admin_sessions (token_hash, user_id, expires_at)
    VALUES (${tokenHash}, 1, now() + interval '7 days')`;
  return token;
}

export function setAdminCookie(response: NextResponse, request: NextRequest, token: string) {
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https",
    path: "/api/admin",
    maxAge: SESSION_SECONDS,
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/api/admin", maxAge: 0 });
}

export async function getAdmin(request: NextRequest): Promise<{ id: number; username: string } | null> {
  const token = request.cookies.get(COOKIE)?.value;
  if (!token || token.length > 128) return null;
  const hash = createHash("sha256").update(token).digest("hex");
  const [row] = await sql<Array<{ id: number; username: string }>>`
    SELECT u.id, u.username FROM admin_sessions s
    JOIN admin_users u ON u.id = s.user_id
    WHERE s.token_hash = ${hash} AND s.expires_at > now() LIMIT 1`;
  return row ?? null;
}

export async function logoutAdmin(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value;
  if (token) {
    const hash = createHash("sha256").update(token).digest("hex");
    await sql`DELETE FROM admin_sessions WHERE token_hash = ${hash}`;
  }
}

export async function changeAdminCredentials(currentPassword: string, username: string, newPassword: string, request: NextRequest) {
  const account = await getAdmin(request);
  if (!account) return null;
  const [row] = await sql<AdminRow[]>`SELECT id, username, password_hash FROM admin_users WHERE id = 1`;
  if (!row || !verifyPassword(currentPassword, row.password_hash)) return null;
  if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username) || newPassword.length < 16 || newPassword.length > 256) {
    throw new Error("El usuario debe tener 3–40 caracteres y la contraseña nueva 16–256.");
  }
  await sql`UPDATE admin_users SET username = ${username}, password_hash = ${hashPassword(newPassword)}, updated_at = now() WHERE id = 1`;
  await sql`DELETE FROM admin_sessions WHERE user_id = 1`;
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await sql`INSERT INTO admin_sessions (token_hash, user_id, expires_at)
    VALUES (${tokenHash}, 1, now() + interval '7 days')`;
  return token;
}

const INTEGRATION_KEYS = ["WHATSAPP_WEBHOOK_VERIFY_TOKEN", "WHATSAPP_APP_SECRET", "WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_GRAPH_API_VERSION"] as const;
export type IntegrationKey = typeof INTEGRATION_KEYS[number];
export { INTEGRATION_KEYS };

function encryptionKey(): Buffer | null {
  const encoded = process.env.ADMIN_ENCRYPTION_KEY;
  if (!encoded) return null;
  const key = Buffer.from(encoded, "base64");
  return key.length === 32 ? key : null;
}

export function canStoreIntegrationSecrets(): boolean {
  return encryptionKey() !== null;
}

export function encryptSecret(value: string): string {
  const key = encryptionKey();
  if (!key) throw new Error("ADMIN_ENCRYPTION_KEY no configurada");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${encrypted.toString("base64url")}`;
}

function decryptSecret(value: string): string | null {
  const key = encryptionKey();
  if (!key) return null;
  try {
    const [iv, tag, encrypted] = value.split(".").map((part) => Buffer.from(part, "base64url"));
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export async function getIntegrationValue(key: IntegrationKey): Promise<string | null> {
  const [row] = await sql<Array<{ encrypted_value: string }>>`
    SELECT encrypted_value FROM integration_secrets WHERE key = ${key} LIMIT 1`;
  return (row ? decryptSecret(row.encrypted_value) : null) || process.env[key] || null;
}

export async function getIntegrationStatus(): Promise<Record<IntegrationKey, boolean>> {
  const rows = await sql<Array<{ key: string }>>`SELECT key FROM integration_secrets`;
  const stored = new Set(rows.map((row) => row.key));
  return Object.fromEntries(INTEGRATION_KEYS.map((key) => [key, stored.has(key) || Boolean(process.env[key])])) as Record<IntegrationKey, boolean>;
}
