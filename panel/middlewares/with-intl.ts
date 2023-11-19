import { locales } from "../i18n";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import type { MiddlewareFactory } from "./stack-handler";

const middleware = createMiddleware({
    locales,
    localePrefix: "never",
    defaultLocale: "en",
});

export const withIntl: MiddlewareFactory = _next => (request: NextRequest, _next: NextFetchEvent) => {
    // console.log(request.nextUrl.pathname);
    if (!/((api|_next|assets|favicon|fonts|sw\.js|favicon\.ico).*)/.test(request.nextUrl.pathname.slice(1))) {
        // await new Promise<void>(res => res());
        return middleware(request);
    } else {
        return NextResponse.next();
    }
};
