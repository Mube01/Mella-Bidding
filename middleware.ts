import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "mella_session";

type SessionPayload = {
  userId: string;
  role: "user" | "admin";
  expiresAt: number;
};

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded = base64.padEnd(
    Math.ceil(base64.length / 4) * 4,
    "="
  );

  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function textToBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

async function verifySession(
  request: NextRequest
): Promise<SessionPayload | null> {
  const secret = process.env.AUTH_SECRET;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!secret || secret.length < 32 || !token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 2) {
    return null;
  }

  const encodedPayload = parts[0];
  const encodedSignature = parts[1];

  if (!encodedPayload || !encodedSignature) {
    return null;
  }

  try {
    const secretBytes = textToBytes(secret);
    const payloadBytes = textToBytes(encodedPayload);
    const signatureBytes = base64UrlToBytes(encodedSignature);

    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes as BufferSource,
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      payloadBytes as BufferSource
    );

    if (!valid) {
      return null;
    }

    const payloadText = new TextDecoder().decode(
      base64UrlToBytes(encodedPayload)
    );

    const payload = JSON.parse(
      payloadText
    ) as SessionPayload;

    if (!payload.userId) {
      return null;
    }

    if (
      payload.role !== "user" &&
      payload.role !== "admin"
    ) {
      return null;
    }

    if (!payload.expiresAt) {
      return null;
    }

    if (Date.now() >= payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(
  request: NextRequest
) {
  const pathname = request.nextUrl.pathname;

  const withSecurityHeaders = (
    response: NextResponse
  ) => {
    response.headers.set(
      "X-Content-Type-Options",
      "nosniff"
    );
    response.headers.set(
      "X-Frame-Options",
      "DENY"
    );
    response.headers.set(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    return response;
  };

  // Allow the admin login page.
  if (pathname === "/admin/login") {
    return withSecurityHeaders(
      NextResponse.next()
    );
  }

  // Check if this is an admin route.
  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isAuthenticatedRoute =
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/my-auctions" ||
    pathname.startsWith("/my-auctions/");

  // Verify the session.
  const session = await verifySession(request);

  if (!isAdminRoute && !isAuthenticatedRoute) {
    return withSecurityHeaders(
      NextResponse.next()
    );
  }

  if (!session && isAuthenticatedRoute) {
    const loginUrl = new URL(
      "/login",
      request.url
    );

    loginUrl.searchParams.set(
      "next",
      pathname
    );

    return withSecurityHeaders(
      NextResponse.redirect(loginUrl)
    );
  }

  // Redirect unauthenticated users to admin login.
  if (!session) {
    const loginUrl = new URL(
      "/admin/login",
      request.url
    );

    loginUrl.searchParams.set(
      "next",
      pathname
    );

    return withSecurityHeaders(
      NextResponse.redirect(loginUrl)
    );
  }

  // Only admins can access admin routes.
  if (session.role !== "admin") {
    const loginUrl = new URL(
      "/admin/login",
      request.url
    );

    loginUrl.searchParams.set(
      "next",
      pathname
    );

    return withSecurityHeaders(
      NextResponse.redirect(loginUrl)
    );
  }

  // Valid admin session.
  return withSecurityHeaders(
    NextResponse.next()
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|images).*)",
    "/account/:path*",
    "/my-auctions/:path*",
    "/admin/:path*",
  ],
};
