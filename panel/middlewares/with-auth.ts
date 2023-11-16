import type { NextFetchEvent, NextRequest } from "next/server";
import type { MiddlewareFactory } from "./stack-handler";

export const withAuth: MiddlewareFactory = next => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        console.log("AUTH! 🚀", request.nextUrl.pathname);
        // return middleware(request);

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
