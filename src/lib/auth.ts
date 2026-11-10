import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users, type User } from "@/db/schema";
import {
  ACCESS_COOKIE,
  ACCESS_TTL_MIN,
  REFRESH_COOKIE,
  REFRESH_TTL_DAYS,
  createAccessToken,
  createRefreshToken,
  verifyToken,
  type SessionPayload,
} from "./jwt";

const isProd = process.env.NODE_ENV === "production";

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function setAuthCookies(user: Pick<User, "id" | "email" | "name" | "role">): Promise<void> {
  const [access, refresh] = await Promise.all([createAccessToken(user), createRefreshToken(user)]);
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, access, { ...baseCookie, maxAge: ACCESS_TTL_MIN * 60 });
  jar.set(REFRESH_COOKIE, refresh, { ...baseCookie, maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 });
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

/** Сессия из access-токена; refresh используется как мягкий fallback. */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (access) {
    const payload = await verifyToken(access);
    if (payload?.type === "access") return payload;
  }
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    const payload = await verifyToken(refresh);
    if (payload?.type === "refresh") return payload;
  }
  return null;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const db = await getDb();
  const [user] = await db.select().from(users).where(eq(users.id, session.sub)).limit(1);
  if (!user || user.isBlocked) return null;
  return user;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export function isStaff(user: Pick<User, "role"> | null): boolean {
  return user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "MARKETER" || user?.role === "EDITOR";
}

export function isContentEditor(user: Pick<User, "role"> | null): boolean {
  return user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "MARKETER" || user?.role === "EDITOR";
}

export async function requireStaff(): Promise<User> {
  const user = await requireUser();
  if (!isStaff(user)) throw new Error("FORBIDDEN");
  return user;
}
