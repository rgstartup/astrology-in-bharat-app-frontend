import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/logout
 * 
 * Clears all auth-related HttpOnly cookies server-side.
 * Called by clientLogout() in useAuthStore — this is the ONLY
 * reliable way to delete HttpOnly cookies from client-initiated code.
 */
export async function POST() {
    const cookieStore = await cookies();

    // Delete all auth cookies (standard COOKIE_NAMES from backend)
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json({ success: true }, {
        status: 200,
        headers: {
            // Belt + suspenders: also clear via Set-Cookie header
            "Set-Cookie": [
                "accessToken=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict",
                "refreshToken=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict",
            ].join(", "),
        },
    });
}
