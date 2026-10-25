import { NextRequest, NextResponse } from "next/server";
import locales from "./public-pages/locales.json";
import { preferredLanguage } from "./public-pages/preferred-language.mjs";

export function proxy(request: NextRequest) {
  const locale = preferredLanguage(
    locales,
    request.cookies.get("guesstimate.language")?.value,
    request.headers.get("accept-language") || ""
  );
  const destination = request.nextUrl.clone();
  destination.pathname = locale.prefix || "/en";
  const response = NextResponse.redirect(destination, 307);
  // A visitor's language redirect must never be reused for another visitor.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = { matcher: "/" };
