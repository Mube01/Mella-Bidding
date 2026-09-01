import { cookies } from "next/headers";
import {
  createHmac,
  timingSafeEqual,
} from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import User from "../models/user";

const AUTH_COOKIE_NAME = "mella_session";

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must contain at least 32 characters"
    );
  }

  return secret;
}

export interface SessionPayload {
  userId: string;
  role: "user" | "admin";
  expiresAt: number;
}

function encodeSession(
  payload: SessionPayload
): string {
  const data = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64url");

  const signature = createHmac(
    "sha256",
    getAuthSecret()
  )
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

function decodeSession(
  token: string
): SessionPayload | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 2) {
      return null;
    }

    const [data, signature] = parts;

    if (!data || !signature) {
      return null;
    }

    const expectedSignature = createHmac(
      "sha256",
      getAuthSecret()
    )
      .update(data)
      .digest("base64url");

    const received = Buffer.from(
      signature,
      "utf8"
    );
    const expected = Buffer.from(
      expectedSignature,
      "utf8"
    );

    if (
      received.length !== expected.length ||
      !timingSafeEqual(received, expected)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(
        data,
        "base64url"
      ).toString("utf8")
    ) as SessionPayload;

    if (
      !payload.userId ||
      !payload.role ||
      !payload.expiresAt
    ) {
      return null;
    }

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(
    password,
    hashedPassword
  );
}

export async function createSession(
  userId: string,
  role: "user" | "admin",
  remember = false
): Promise<void> {
  const expiresIn = remember
    ? 30 * 24 * 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;

  const payload: SessionPayload = {
    userId,
    role,
    expiresAt: Date.now() + expiresIn,
  };

  const token = encodeSession(payload);

  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(
      expiresIn / 1000
    ),
  });
}

export async function getSession(): Promise<
  SessionPayload | null
> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    AUTH_COOKIE_NAME
  )?.value;

  if (!token) {
    return null;
  }

  return decodeSession(token);
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  await connectDB();

  const user = await User.findById(session.userId)
    .select("name phone email role createdAt")
    .lean();

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");

  return !origin || origin === new URL(request.url).origin;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}