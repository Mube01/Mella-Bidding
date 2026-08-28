import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "mella_session";

type SessionPayload = {
  userId: string;
  role: "user" | "admin";
  expiresAt: number;
};

function decodeBase64Url(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0)).buffer;
}

async function getSession(request: NextRequest): Promise<SessionPayload | null> {
  const secret = process.env.AUTH_SECRET;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!secret || secret.length < 32 || !token) {
    return null;
  }

  const [encodedPayload, encodedSignature] = token.split(".");

  if (!encodedPayload || !encodedSignature) {
    return null;
  }

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(encodedPayload)
    );

    if (!valid) {
      return null;
    }

    const payload = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encodedPayload))
    ) as SessionPayload;

    if (
      !payload.userId ||
      (payload.role !== "user" && payload.role !== "admin") ||
      !payload.expiresAt ||
      Date.now() > payload.expiresAt
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLogin = pathname === "/admin/login";

  if (!isAdminLogin && (!session || (isAdminRoute && session.role !== "admin"))) {
    const loginPath = isAdminRoute ? "/admin/login" : "/login";
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/my-auctions/:path*", "/admin/:path*"],
};