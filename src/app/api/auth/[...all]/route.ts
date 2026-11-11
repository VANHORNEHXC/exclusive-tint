import { NextResponse } from "next/server";

// The former Better Auth endpoint had no database adapter or configured secret.
// Keep it closed until a complete authentication flow is installed.
const unavailable = () => NextResponse.json(
  { error: "Autenticación no configurada" },
  { status: 503 }
);

export const GET = unavailable;
export const POST = unavailable;
