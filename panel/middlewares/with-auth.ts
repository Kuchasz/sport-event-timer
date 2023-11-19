import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import type { MiddlewareFactory } from "./stack-handler";
import { getUserSession } from "auth";

export const withAuth: MiddlewareFactory = next => async (request: NextRequest, _next: NextFetchEvent) => {
    // console.log("AUTH! 🚀", request.nextUrl.pathname);

    const cookies = Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]));

    const session = await getUserSession(cookies, true);

    request.cookies.set({ name: "accessToken", value: session.accessToken! });

    // console.log(session);
    const response = await next(request, _next);

    if (response instanceof NextResponse) {
        // console.log("new_access_token: ", session.accessToken?.split(".")[2].slice(10, 20));
        if (session.accessToken) {
            response.cookies.set("accessToken", session.accessToken, { httpOnly: true, maxAge: 15 });
        } else {
            response.cookies.delete("accessToken");
        }

        // console.log(session.refreshToken?.slice(10, 20));
        // if (session.refreshToken) {
        //     response.cookies.set("refreshToken", session.refreshToken);
        // } else {
        //     response.cookies.delete("refreshToken");
        // }
    }

    return response;
};
