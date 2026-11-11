import { createHash, timingSafeEqual } from "node:crypto";

function sameValue(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 16);
}

export function isAdminAuthorized(authorization: string | null): boolean {
  if (!adminConfigured() || !authorization?.startsWith("Basic ")) return false;
  try {
    const credentials = Buffer.from(authorization.slice(6), "base64").toString("utf8");
    const separator = credentials.indexOf(":");
    return separator > -1 &&
      sameValue(credentials.slice(0, separator), process.env.ADMIN_USERNAME!) &&
      sameValue(credentials.slice(separator + 1), process.env.ADMIN_PASSWORD!);
  } catch {
    return false;
  }
}
