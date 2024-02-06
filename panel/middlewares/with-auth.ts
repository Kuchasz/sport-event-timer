import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import type { MiddlewareFactory } from "./stack-handler";
import { getUserSession } from "../auth";
import { env } from "../env";

export const withAuth: MiddlewareFactory = next => async (request: NextRequest, _next: NextFetchEvent) => {
    if (!/((api).*)/.test(request.nextUrl.pathname.slice(1))) {
        const cookies = Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]));

        const session = await getUserSession(cookies, true);

        if (session.accessToken) request.cookies.set({ name: "accessToken", value: session.accessToken });

        const response = await next(request, _next);

        if (response instanceof NextResponse) {
            if (session.accessToken) {
                const domain = env.NEXT_PUBLIC_NODE_ENV === "production" ? "rura.cc" : "";
                response.cookies.set("accessToken", session.accessToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 15,
                    sameSite: "none",
                    domain: domain,
                    path: "/",
                });
            }
        }

        return response;
    } else {
        return NextResponse.next();
    }
};
