import * as jsonwebtoken from "jsonwebtoken";
import { promisify } from "util";
import { createSession, getUser, getSession } from "./db";
import { cookies } from "next/headers";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../server/db";
import { z } from "zod";
import { redirect } from "next/navigation";

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
    secretKey: `-----BEGIN RSA PRIVATE KEY-----
    MIIEoQIBAAKCAQBWhHO+SR4GuJWVLFvyTh8WlprRD6B1Sc/uKELSc59Ou9ZWyBkV
    ss6fGAuw3pmBa9nBJ9r/Ia4dRnyml7WFpvSLm99CGNTsgA2xDYyq+Tq90X8zHE45
    lNFEuahCXP6YIbSEz9cbgZI5gB5a/GzPf8tf1mA47IPqaCRXGJr/+Fu+1O7TGm4S
    gCVoYoIRml/dD97nePLvsv7gLGv06Luj+Cv3WiB+imVLBAoMGjkNaVEqYuAhsE0q
    kZNhZToX8EXn7BbUCf0T8IrHRCMxIWlUEf9z4FBBtbFFlENfXvitZ4EANMd/Ot1U
    WqWZTqlkA7+fx8t8GclhO+nesCmZdHLZebbLAgMBAAECggEARNB/O0fu8QuaNpec
    3qKSiaXqqASU7RVzpIszcy7x9G7lMgtgIGkjfVlj2x+C23UMM11fC/UfBzwMY3lh
    sVe1ROIK9wjHOwEzYrNTQp6PwXFDikSmV5htxwsgsQBEpH6Sldy2zLMHumKUQmxq
    o7SS77yUtlIxLp384aW5i4Vge+z1zg3SUThYNNG/RsvDX9uF8twHJcvT2WTjegQ5
    c/DKok2yvZMj2Xmq3B9VAVOH7y2aBTPDtt5ZeAWJtSoJKM2CXpxb38rFLdt8zH7H
    yKLUTpi2VRVOAjYcU/F9ecWsTvkSj/N+JreZqo4q32tU6TCvy2q+2trKanKz6qMP
    +zfVuQKBgQCkQ0W35TeYQal0fBs64IPlqW7fFuCZiUMcVuZZPucUQ0eqbFEPbKlR
    oi3UIP+Xe6oPqFxKcAJ7C8g9BXNSM5/6gsQPgXzDJYJ4xMJjJ5yu//VJ9gkW3BhZ
    YbqNrFk7ulYXGfGZ8RnnLw7Vcw9n+GXdV0l9/fNxuMLC7qjXz3yFbQKBgQCG1eJp
    ZtfLtTQTQOw2wHNKnLhhssQYtfY1SNK5k1U3X9/4XGHEKyB1Y2pQUruWPZt0dfrY
    b7GxJVZWzJXC3AUPprUqpAGXpcK7rREjTJuszboYiA2IYsZgzKe004O5QToe9rF4
    kt34YTk8MNi9kOlRrRu3saLgSVcwWpUtj05iFwKBgHGBYt2t8HqvdM7fK1nF5p5+
    M/TINC8kIFGm4slso/TmgNEMw/6qkV2teYmJu9QLSfpD1nJBcBVikN1JtORqc/OB
    BMXKLlISy1N0cvZdWvG6QN74ulMnh1PMKkLXg1m4auDPtpkvdzy+0btBJLYteQY3
    2LrNDrnYeAyHKfjmkR8JAoGAOR6UephBpJ9PvzRKnOssLBh2F5U2c01qTqpZ8pmS
    iRHJfJoOJJ8sce46lGpn4z6YA18Tc+rlOKkbiUvDybeRQU8bAkRWFFr5Qq4PS4fh
    jvPb+RZxvSwy48Du7rCH5cvXBlT1W6HD/LubFn+O4cdov9v4mPnciO0ozWgiOBm0
    V+MCgYA2FLFIDK/VDM3p31pALvWm4ZBP035O0GEW1ZBv6yZvD1+ZvSaGnJQy6QJ6
    au7gi62vkmV9VQku4gOGkxD3bo2UkCVlj/ZuB4YJCRqo+TTJfSy+mequTKuUlhye
    sQw6/yF6hNX3Wbmt0765YTAImCgLoZp9LJBd5SSRV+8XXnfalQ==
    -----END RSA PRIVATE KEY-----`,
    publicKey: `-----BEGIN PUBLIC KEY-----
    MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBWhHO+SR4GuJWVLFvyTh8W
    lprRD6B1Sc/uKELSc59Ou9ZWyBkVss6fGAuw3pmBa9nBJ9r/Ia4dRnyml7WFpvSL
    m99CGNTsgA2xDYyq+Tq90X8zHE45lNFEuahCXP6YIbSEz9cbgZI5gB5a/GzPf8tf
    1mA47IPqaCRXGJr/+Fu+1O7TGm4SgCVoYoIRml/dD97nePLvsv7gLGv06Luj+Cv3
    WiB+imVLBAoMGjkNaVEqYuAhsE0qkZNhZToX8EXn7BbUCf0T8IrHRCMxIWlUEf9z
    4FBBtbFFlENfXvitZ4EANMd/Ot1UWqWZTqlkA7+fx8t8GclhO+nesCmZdHLZebbL
    AgMBAAE=
    -----END PUBLIC KEY-----`,
    cookieName: "auth.session",
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

    const accessToken = await jwt.sign({ email: user.email, name: user.name, sessionId: session.sessionId }, auth.secretKey, {
        algorithm: "RS256",
        expiresIn: "5s",
    });

    const refreshToken = await jwt.sign({ sessionId: session.sessionId }, auth.secretKey, { algorithm: "RS256", expiresIn: "1y" });

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

export const getServerSession = async () => {
    const nextCookies = Object.fromEntries(
        cookies()
            .getAll()
            .map(c => [c.name, c.value]),
    );
    return (await getUserSession(nextCookies)).payload;
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
