import { fetchJson } from "@set/utils/dist/fetch";
import { decodeJwt as decodeToken, importPKCS8, importSPKI, SignJWT as signToken, jwtVerify as verifyToken } from "jose";
import * as jsonwebtoken from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { promisify } from "util";
import { z } from "zod";
import { db } from "../server/db";
import { createSession, getSession, getUser } from "./db";

const jwt = {
    _sign: promisify<string | object | Buffer, jsonwebtoken.Secret, jsonwebtoken.SignOptions, string>(jsonwebtoken.sign),
    sign: async (payload: object, secret: string, options: { algorithm: "RS256"; expiresIn: number }) => {
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + options.expiresIn; // * 60; // one hour

        const privateKey = await importPKCS8(secret, options.algorithm);

        // console.log("sign....", { ...payload });

        const token = new signToken({ ...payload })
            .setProtectedHeader({ alg: options.algorithm })
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(privateKey);

        return token;
    },
    _verify: promisify<string, jsonwebtoken.Secret, any>(jsonwebtoken.verify),
    verify: async (token: string, secret: string) => {
        const publicKey = await importSPKI(secret, "RS256");
        const { payload } = await verifyToken(token, publicKey);
        // console.log("t!O!", payload);
        return payload;
    },
    decode: (token: string) => {
        return decodeToken(token);
    },
};

type UserCredentials = {
    email: string;
    password: string;
};

const auth = {
    maxAge: 5000,
    secretKey: `-----BEGIN PRIVATE KEY-----
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
g0RqIXgYcu4v25StwfpqUHXW2m6T
-----END PRIVATE KEY-----`,
    publicKey: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAw/WA7/OdWW1BdgcugeDh
9TKnw/T5y77WEb6guAXg1erYLHFXI8bgrsc80NLGeKdj677GyuOWCRz2OPbV/eo7
l/DriAGRk/OrlqVK7qCFrdmG3xNxP66OeQkuH4KWWqoSIRb73f4BJ5Tb3fAr+uQk
IIFHK9RqknJo+gq2CPvypgr22Rz61J3buJ3UEHKqqDCdpZjy8ognZSlkKyAK7/M9
ctRsHbAoH33duyDfNJzmnU40+H3iFOyy0EIkzKfbvMng3zcuPmZJCgF2BFE1dfER
5bORD1ZcGpZjVa92fdgbeD6E0MpfXAZxKMjjk/ePTocldQQR+wiN3k3vdRWEC+jS
VP8DDMyZHPw0oHpFLfMtqBY71doLeootBxs2FBhgeaTf9U4QMzzXMRvmCDQOds5I
wdJAnsc54x3mS7KW/wUgWRJoCZDCSHH1kxT0UbBVbfWNzmQPg2gaCFcQ3HZEoPlg
i1m2QVFO6juck2yiDMme2IuqqUCyLfe0n/2OPq/DU2R+9WohZf8EEnG8Wn+jzYVS
AOAk00KlLJ5+9WgAAYrQk5P9n7a+o9j8V9KeXwPOVHwAfoZzgfYbIBAT9x0LWYqC
txJ3NrAldz857FsnVkM5NVJJXSZMnmnuEa8b2z+1bFiLVLdpuGI4Aor3URGOhBNX
ALs4M6DV4CRutHLHPIdQlGUCAwEAAQ==
-----END PUBLIC KEY-----`,
    cookieName: "auth.session",
};

export type UserSession = { name: string; sessionId: string; email: string };

export const secondsInWeek = 604_800;

export const login = async ({ email }: UserCredentials) => {
    const user = await getUser(email);

    // if (!user || user.password !== password) {
    if (!user) {
        return Promise.reject("Invalid email or password");
    }

    const session = await createSession(user.id);

    const accessToken = await jwt.sign({ email: user.email, name: user.name, sessionId: session.id }, auth.secretKey, {
        algorithm: "RS256",
        expiresIn: 15,
    });

    const refreshToken = await jwt.sign({ sessionId: session.id }, auth.secretKey, {
        algorithm: "RS256",
        expiresIn: secondsInWeek,
    });

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
        // console.log("verify.return", jwt.decode(token));
        return { payload, expired: false };
    } catch (e: any) {
        console.log("verify.error", e.code === "ERR_JWT_EXPIRED" ? null : e);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return { payload: undefined, expired: (e.code === "ERR_JWT_EXPIRED") as boolean };
    }
};

export const getUserSession = async (
    cookies: Record<string, string>,
    useFetch = false,
): Promise<{ payload?: UserSession; accessToken?: string; refreshToken?: string }> => {
    const { accessToken, refreshToken } = cookies;

    if (!refreshToken) {
        return { payload: undefined, accessToken, refreshToken };
    }

    // console.log("accessToken: ", accessToken.split(".")[2].slice(10, 20));
    // console.log("refreshToken: ", refreshToken.split(".")[2].slice(10, 20));

    let expired = true;
    if (accessToken) {
        const { payload, ...token } = await verify(accessToken);
        expired = token.expired;

        // For a valid access token
        if (payload) {
            return { payload, accessToken, refreshToken };
        }
    }

    // expired but valid access token
    const { payload: refresh } = expired && refreshToken ? await verify(refreshToken) : { payload: undefined };

    //invalid refresh token
    if (!refresh) {
        return { payload: undefined, accessToken: undefined, refreshToken: undefined };
    }

    const session = useFetch
        ? await fetchJson("http://localhost:3000/api/session", { sessionId: refresh.sessionId })
        : await getSession(refresh.sessionId);

    if (!session) {
        return { payload: undefined, accessToken, refreshToken };
    }

    const newAccessToken = await jwt.sign(session, auth.secretKey, { algorithm: "RS256", expiresIn: 15 });

    return { payload: (await verify(newAccessToken))?.payload, accessToken: newAccessToken, refreshToken };

    // res.cookie("accessToken", newAccessToken, {
    //     maxAge: 300000, // 5 minutes
    //     httpOnly: true,
    // });

    // // @ts-ignore
    // req.user = verifyJWT(newAccessToken).payload;

    // return next();
};

export const getServerSession = async () => {
    const nextCookies = Object.fromEntries(
        cookies()
            .getAll()
            .map(c => [c.name, c.value]),
    );

    const { accessToken } = nextCookies;

    if (!accessToken) {
        return undefined;
    }

    const tokenVerification = await verify(accessToken);

    return !tokenVerification.expired
        ? {
              email: tokenVerification.payload!.email,
              name: tokenVerification.payload!.name,
              sessionId: tokenVerification.payload!.sessionId,
          }
        : undefined;
};

const ApiKeyAuthModel = z.object({
    apiKey: z.string().regex(/[a-zA-Z0-9]+/),
    raceId: z.number(),
});

export const withRaceApiKey =
    (next: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== "POST") {
            res.status(403).send("Invalid Method");
            return;
        }

        const { raceId } = req.query;
        const { apiKey } = req.body;

        const parseResult = ApiKeyAuthModel.safeParse({ apiKey, raceId: parseInt(raceId as string) });
        if (!parseResult.success) {
            res.status(403).send("Invalid ApiKey configuration");
            return;
        }

        const apiKeysForRace = await db.apiKey.findMany({ where: { raceId: parseInt(raceId as string) } });

        if (!apiKeysForRace.map(a => a.key).includes(apiKey)) {
            res.status(403).send("Invalid ApiKey");
            return;
        }

        await next(req, res);
    };

export async function authenticate() {
    // const { req, resolvedUrl } = context;
    const session = await getServerSession();

    // const resolvedUrl = usePathname();

    // const destination = `${process.env.NEXTAUTH_URL}${resolvedUrl}`;
    // const callbackUrl = `/auth/signin?callbackUrl=${encodeURIComponent(destination)}`;
    const callbackUrl = `/auth/signin`;

    if (!session) {
        redirect(callbackUrl);
    }
}

// import NextAuth, { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";

// export const {
//     // handlers: { GET, POST },
//     auth,
//     CSRF_experimental,
// } = NextAuth({
//     ...authConfig,
// });

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
