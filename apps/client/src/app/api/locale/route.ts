import { NextRequest, NextResponse } from "next/server";
import { isAppLocale } from "@/i18n/routing";

export async function POST(request: NextRequest) {
  const { locale } = await request.json().catch(() => ({}));

  console.log({ locale });

  if (!isAppLocale(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }

  const response = NextResponse.json({ locale });
  response.cookies.set("locale", locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
