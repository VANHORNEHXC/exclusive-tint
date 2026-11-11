import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Endpoint unificado de Better Auth para Next.js App Router.
 * Maneja los métodos GET y POST para sign-in, sign-up, session, OAuth, etc.
 */
export const { GET, POST } = toNextJsHandler(auth);
