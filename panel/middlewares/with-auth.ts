import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import type { MiddlewareFactory } from "./stack-handler";
import { getUserSession } from "auth";

export const withAuth: MiddlewareFactory = next => async (request: NextRequest, _next: NextFetchEvent) => {
    console.log("AUTH! 🚀", request.nextUrl.pathname);

    const cookies = Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]));

    const session = await getUserSession(cookies);
    console.log(session);
    const response = await next(request, _next);

    if (response instanceof NextResponse) {
        // console.log(session.accessToken?.slice(10, 20));
        if (session.accessToken) {
            response.cookies.set("accessToken", session.accessToken);
        } else {
            response.cookies.delete("accessToken");
        }

        // console.log(session.refreshToken?.slice(10, 20));
        if (session.refreshToken) {
            response.cookies.set("refreshToken", session.refreshToken);
        } else {
            response.cookies.delete("refreshToken");
        }
    }
};
