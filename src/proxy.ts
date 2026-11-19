import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { safeNextPath } from "@/lib/safe-path";

const LOGIN_PATH = "/masuk";

/**
 * Locks the whole planner behind the PIN. Runs on the Node.js runtime
 * (the Next.js 16 default for proxy), so the HMAC check happens here.
 *
 * Only navigations are redirected. Server Action POSTs are let through and
 * authorized inside the action itself (`runAction`), because redirecting them
 * would hand the client an HTML page where it expects an action response.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (request.headers.has("next-action")) return NextResponse.next();

  const unlocked = verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (pathname === LOGIN_PATH) {
    if (!unlocked) return NextResponse.next();
    const next = safeNextPath(request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(new URL(next, request.url));
  }

  if (unlocked) return NextResponse.next();

  const login = new URL(LOGIN_PATH, request.url);
  if (pathname !== "/") login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  /** Everything except Next internals and static assets. */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
