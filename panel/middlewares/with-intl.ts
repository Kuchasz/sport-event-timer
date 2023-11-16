import { locales } from "../i18n";
import createMiddleware from "next-intl/middleware";
import type { NextFetchEvent, NextRequest } from "next/server";
import type { MiddlewareFactory } from "./stack-handler";

const middleware = createMiddleware({
    locales,
    localePrefix: "never",
    defaultLocale: "en",
});

export const withIntl: MiddlewareFactory = next => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        console.log("INTL! 🏴󠁧󠁢󠁳󠁣󠁴󠁿", request.nextUrl.pathname);
        middleware(request);

        // const pathname = request.nextUrl.pathname;

        // if (["/profile"]?.some(path => pathname.startsWith(path))) {
        //     const userId = request.cookies.get("userId");
        //     if (!userId) {
        //         const url = new URL(`/auth/login`, request.url);
        //         return NextResponse.redirect(url);
        //     }
        // }
        return next(request, _next);
    };
};
