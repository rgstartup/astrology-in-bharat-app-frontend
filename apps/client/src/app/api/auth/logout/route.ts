import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearAuthCookies } from "@/actions/cookie";
import { AUTH_COOKIE_NAMES } from "@/actions";

/**
 * POST /api/auth/logout
 *
 * Clears all auth-related HttpOnly cookies server-side.
 * Called by logout() in useAuthStore — this is the ONLY
 * reliable way to delete HttpOnly cookies from client-initiated code.
 */
export async function POST() {
  const cookieStore = await cookies();

  clearAuthCookies(cookieStore as any);

  const isProd = process.env.NODE_ENV === "production";
  const secureFlag = isProd ? "; Secure" : "";

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        // Belt + suspenders: also clear via Set-Cookie header
        "Set-Cookie": [
          `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict${secureFlag}`,
          `${AUTH_COOKIE_NAMES.REFRESH_TOKEN}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict${secureFlag}`,
        ].join(", "),
      },
    },
  );
}

