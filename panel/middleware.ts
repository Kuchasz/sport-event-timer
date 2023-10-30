import { locales } from "./i18n";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
    locales,
    localePrefix: "never",
    defaultLocale: "en",
});

export const middleware = (request: NextRequest) => {
    // console.log(JSON.stringify(request.nextUrl));
    return intlMiddleware(request as any);
};

export const config = {
    // Skip all paths that should not be internationalized. This example skips the
    // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
    // matcher: ['/((?!api|auth|registration|results|stopwatch|timer|_next|.*\\..*).*)']
    matcher: ["/((?!api|auth|_next|assets|favicon|fonts|sw.js|favicon.ico).*)"],
    // matcher: ['/((?!api|_next|auth|_vercel|.*\\..*).*)']
    // matcher: ['/((?!api|_next|.*\\..*).*)']
};
