import { betterAuth } from "better-auth";

/**
 * Configuración central de Better Auth para Exclusive Tint.
 * Compatible con Neon Auth y Better Auth Next.js App Router.
 */
export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.NEON_AUTH_COOKIE_SECRET ||
    "exclusive-tint-super-secret-key-32-chars-min-length",
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});

export type Session = typeof auth.$Infer.Session;
