"use server";

import { getServerSession } from "auth";
import { createSession, getUser } from "auth/db";
import { cookies } from "next/headers";

export const GET = async () => {
    const session = await getServerSession();
    return Response.json(session);
};

export const POST = async (req: Request, res: Response) => {
    const cookieStore = cookies();
    const { email, password } = req.body;

    const user = getUser(email);

    if (!user || user.password !== password) {
        return res.status(401).send("Invalid email or password");
    }

    const session = createSession(email, user.name);

    // create access token
    const accessToken = signJWT({ email: user.email, name: user.name, sessionId: session.sessionId }, "5s");

    const refreshToken = signJWT({ sessionId: session.sessionId }, "1y");

    // set access token in cookie
    res.cookie("accessToken", accessToken, {
        maxAge: 300000, // 5 minutes
        httpOnly: true,
    });

    // cookies().set("awd");

    res.cookie("refreshToken", refreshToken, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
    });

    // send user back
    // return res.send(session);
    return new Response("ok", { status: 200 });
};

export const DELETE = async (req: Request, res: Response) => {
    res.cookie("accessToken", "", {
        maxAge: 0,
        httpOnly: true,
    });

    res.cookie("refreshToken", "", {
        maxAge: 0,
        httpOnly: true,
    });

    // @ts-ignore
    const session = invalidateSession(req.user.sessionId);

    return res.send(session);
};
