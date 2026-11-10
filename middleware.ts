import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, verifyToken } from "@/lib/jwt";

const staffRoles = new Set(["ADMIN", "MANAGER", "MARKETER", "EDITOR"]);
const fullAdmin = new Set(["ADMIN", "MANAGER"]);
const restrictedPrefixes = ["/admin/products", "/admin/orders", "/admin/users", "/admin/promotions", "/admin/categories", "/admin/integration"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  const session = (access && (await verifyToken(access))) || (refresh && (await verifyToken(refresh)));

  if (!session || !staffRoles.has(session.role)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  if (!fullAdmin.has(session.role)) {
    if (pathname === "/admin" || restrictedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.redirect(new URL("/admin/content", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
