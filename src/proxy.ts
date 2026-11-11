import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminConfigured, isAdminAuthorized } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  if (!adminConfigured()) {
    return new NextResponse("Portal interno no configurado", { status: 503 });
  }
  if (isAdminAuthorized(request.headers.get("authorization"))) {
    return NextResponse.next();
  }
  return new NextResponse("Acceso restringido", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Exclusive Tint Admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
