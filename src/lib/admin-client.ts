export async function adminRequest(path: string, method = "GET", body?: unknown): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/admin/${path}`, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : `Error ${response.status}`);
  return payload;
}
