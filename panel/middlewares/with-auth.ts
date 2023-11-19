import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import type { MiddlewareFactory } from "./stack-handler";
import { getUserSession } from "auth";

export const withAuth: MiddlewareFactory = next => async (request: NextRequest, _next: NextFetchEvent) => {
    const cookies = Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]));

    const session = await getUserSession(cookies, true);

    request.cookies.set({ name: "accessToken", value: session.accessToken! });

    const response = await next(request, _next);

    if (response instanceof NextResponse) {
        if (session.accessToken) {
            response.cookies.set("accessToken", session.accessToken, { httpOnly: true, maxAge: 15 });
        } else {
            response.cookies.delete("accessToken");
        }
    }

    return response;
};
