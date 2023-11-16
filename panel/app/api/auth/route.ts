import { getServerSession, login } from "auth";
import { cookies } from "next/headers";

export const GET = async () => {
    const session = await getServerSession();
    return session ? Response.json(session) : new Response("no session", { status: 200 });
};

export const POST = async (req: Request) => {
    const cookieStore = cookies();
    const { email, password } = (await req.json()) as unknown as { email?: string; password?: string };

    console.log(email, password);

    if (!email || !password) {
        return new Response("Not authorized", { status: 403 });
    }

    const token = await login({ email, password });

    // const user = getUser(email);

    if (!token) {
        return new Response("Not authorized", { status: 403 });
    }

    // const session = createSession(email, user.name);

    // // create access token
    // const accessToken = signJWT({ email: user.email, name: user.name, sessionId: session.sessionId }, "5s");

    // const refreshToken = signJWT({ sessionId: session.sessionId }, "1y");

    // set access token in cookie
    // res.cookie("accessToken", accessToken, {
    //     maxAge: 300000, // 5 minutes
    //     httpOnly: true,
    // });

    cookieStore.set({
        maxAge: 300000,
        name: "accessToken",
        value: token.accessToken,
        httpOnly: true,
    });

    cookieStore.set({
        maxAge: 3.154e10,
        name: "refreshToken",
        value: token.refreshToken,
        httpOnly: true,
    });
    // send user back
    // return res.send(session);
    return new Response("ok", { status: 200 });
};

export const DELETE = () => {
    const cookieStore = cookies();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    // res.cookie("accessToken", "", {
    //     maxAge: 0,
    //     httpOnly: true,
    // });

    // res.cookie("refreshToken", "", {
    //     maxAge: 0,
    //     httpOnly: true,
    // });

    // const session = invalidateSession(req.user.sessionId);

    // return res.send(session);
    return new Response("ok", { status: 200 });
};
