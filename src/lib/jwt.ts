import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "MANAGER" | "ADMIN" | "MARKETER" | "EDITOR";
  type: "access" | "refresh";
};

const secretValue = process.env.AUTH_SECRET;

if (!secretValue && process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_STATIC_DEMO !== "1") {
  throw new Error("AUTH_SECRET must be set in production");
}

const secret = new TextEncoder().encode(
  secretValue ?? "dev-only-insecure-secret-change-me-please-32-chars",
);

export const ACCESS_COOKIE = "im_access";
export const REFRESH_COOKIE = "im_refresh";
export const ACCESS_TTL_MIN = Number(process.env.ACCESS_TOKEN_TTL_MIN ?? 480);
export const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30);

export async function signToken(payload: SessionPayload, expiresIn: string): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("irbis-mart")
    .setAudience("irbis-mart-web")
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: "irbis-mart",
      audience: "irbis-mart-web",
    });
    if (!payload.sub || !payload.type) return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createAccessToken(user: { id: string; email: string; name: string; role: SessionPayload["role"] }) {
  return signToken(
    { sub: user.id, email: user.email, name: user.name, role: user.role, type: "access" },
    `${ACCESS_TTL_MIN}m`,
  );
}

export async function createRefreshToken(user: { id: string; email: string; name: string; role: SessionPayload["role"] }) {
  return signToken(
    { sub: user.id, email: user.email, name: user.name, role: user.role, type: "refresh" },
    `${REFRESH_TTL_DAYS}d`,
  );
}
