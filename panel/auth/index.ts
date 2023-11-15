import * as jsonwebtoken from "jsonwebtoken";
import { promisify } from "util";
import { createSession, getUser, getSession } from "./db";

const jwt = {
    sign: promisify<string | object | Buffer, jsonwebtoken.Secret, jsonwebtoken.SignOptions, string>(jsonwebtoken.sign),
    verify: promisify<string, jsonwebtoken.Secret, any>(jsonwebtoken.verify),
    decode: jsonwebtoken.decode,
};

type UserCredentials = {
    email: string;
    password: string;
};

const auth = {
    maxAge: 5000,
    secretKey: "aawdad",
    publicKey: "awdawdaw",
    cookieName: "awdawd",
};

export type UserSession = {
    email: string;
    name: string;
    sessionId: string;
};

export const login = async ({ email, password }: UserCredentials) => {
    const user = getUser(email);

    if (!user || user.password !== password) {
        return Promise.reject("Invalid email or password");
    }

    const session = createSession(email, user.name);

    const accessToken = jwt.sign({ email: user.email, name: user.name, sessionId: session.sessionId }, auth.secretKey, {
        algorithm: "RS256",
        expiresIn: "5s",
    });

    const refreshToken = jwt.sign({ sessionId: session.sessionId }, auth.secretKey, { algorithm: "RS256", expiresIn: "1y" });

    return { accessToken, refreshToken };
    // // set access token in cookie
    // res.cookie("accessToken", accessToken, {
    //     maxAge: 300000, // 5 minutes
    //     httpOnly: true,
    // });

    // res.cookie("refreshToken", refreshToken, {
    //     maxAge: 3.154e10, // 1 year
    //     httpOnly: true,
    // });

    // // send user back
    // return res.send(session);

    // if (validateCredentials(username, password)) {
    //     const encodedToken = await jwt.sign({ username }, auth.secretKey, {
    //         algorithm: "RS256",
    //         expiresIn: auth.maxAge,
    //     });
    //     const decoded = jwt.decode(encodedToken, { json: true });
    //     return { encodedToken, iat: Number(decoded!.iat), exp: Number(decoded!.exp) };
    // } else {
    //     return Promise.reject("Invalid credentials");
    // }
};

export const verify = async (token: string) => {
    //, next: NextFunction) => {
    // const accessToken: string = parseCookies(req.headers.get("cookie")!)[auth.cookieName];

    // if (!accessToken) {
    //     return new Response("Invalid access token", { status: 403 });
    // }

    try {
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        const payload = (await jwt.verify(token, auth.publicKey)) as UserSession;
        return { payload, expired: false };
    } catch (e: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return { payload: undefined, expired: e.messages.includes("jwt expired") as boolean };
    }
};

export const getUserSession = async (
    cookies: Record<string, string>,
): Promise<{ payload?: UserSession; accessToken?: string; refreshToken?: string }> => {
    const { accessToken, refreshToken } = cookies;

    if (!accessToken) {
        return { payload: undefined, accessToken, refreshToken };
    }

    const { payload, expired } = await verify(accessToken);

    // For a valid access token
    if (payload) {
        return { payload, accessToken, refreshToken };
    }

    // expired but valid access token

    const { payload: refresh } = expired && refreshToken ? await verify(refreshToken) : { payload: undefined };

    //invalid refresh token
    if (!refresh) {
        return { payload: undefined, accessToken: undefined, refreshToken: undefined };
    }

    const session = getSession(refresh.sessionId);

    if (!session) {
        return { payload: undefined, accessToken, refreshToken };
    }

    const newAccessToken = await jwt.sign(session, auth.secretKey, { expiresIn: "5s" });

    return { payload: (await verify(newAccessToken))?.payload, accessToken: newAccessToken, refreshToken };

    // res.cookie("accessToken", newAccessToken, {
    //     maxAge: 300000, // 5 minutes
    //     httpOnly: true,
    // });

    // // @ts-ignore
    // req.user = verifyJWT(newAccessToken).payload;

    // return next();
};

// export const verify = async (request: Request, _response: Response) => {
//     const accessToken: string = parseCookies(request.headers.get("cookie")!)[auth.cookieName];

//     if (!accessToken) {
//         return new Response("", { status: 403 });
//     }

//     const payload = jwt.verify(accessToken, auth.publicKey);

//     try {
//         //use the jwt.verify method to verify the access token
//         //throws an error if the token has expired or has a invalid signature
//         payload = next();
//     } catch (e) {
//         //if an error occured return request unauthorized error
//         console.log(e);
//         return res.status(401).send();
//     }
// };
