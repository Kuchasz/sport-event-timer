import { fetchJson } from "@set/utils/dist/fetch";
import { decodeJwt as decodeToken, importPKCS8, importSPKI, SignJWT as signToken, jwtVerify as verifyToken } from "jose";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "../server/db";
import { createSession, getSession, getUser } from "./db";
import { env } from "../env";

const jwt = {
    sign: async (payload: object, secret: string, options: { algorithm: "RS256"; expiresIn: number }) => {
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + options.expiresIn;

        const privateKey = await importPKCS8(secret, options.algorithm);

        const token = new signToken({ ...payload })
            .setProtectedHeader({ alg: options.algorithm })
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(privateKey);

        return token;
    },
    verify: async (token: string, secret: string) => {
        const publicKey = await importSPKI(secret, "RS256");
        const { payload } = await verifyToken(token, publicKey);
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

export type UserSession = { name: string; sessionId: string; email: string };

export const secondsInWeek = 604_800;

export const register = async ({ email, password, name }: UserCredentials & { name: string }) => {
    const user = await getUser(email);

    if (user) return { status: "Error" as "Success" | "Error", message: "EMAIL_TAKEN" };

    await db.user.create({
        data: {
            email: email,
            name: name,
            password: await bcrypt.hash(password, 12),
        },
    });

    return { status: "Success" as "Success" | "Error" };
};

export const login = async ({ email, password }: UserCredentials) => {
    const user = await getUser(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return Promise.resolve(undefined);
    }

    const session = await createSession(user.id);

    const accessToken = await jwt.sign({ email: user.email, name: user.name, sessionId: session.id }, env.AUTH_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: 15,
    });

    const refreshToken = await jwt.sign({ sessionId: session.id }, env.AUTH_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: secondsInWeek,
    });

    return { accessToken, refreshToken };
};

export const verify = async (token: string) => {
    try {
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        const payload = (await jwt.verify(token, env.AUTH_PUBLIC_KEY)) as UserSession;
        return { payload, expired: false };
    } catch (e: any) {
        return { payload: undefined, expired: (e.code === "ERR_JWT_EXPIRED") as boolean };
    }
};

export const getUserSession = async (
    cookies: Record<string, string>,
    useFetch = false,
): Promise<{ payload?: UserSession; accessToken?: string; refreshToken?: string }> => {
    const { accessToken, refreshToken } = cookies;

    if (!refreshToken) {
        return { payload: undefined, accessToken: undefined, refreshToken: undefined };
    }

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
        ? await fetchJson(`http://localhost:${env.APP_PORT}/api/session`, { sessionId: refresh.sessionId })
        : await getSession(refresh.sessionId);

    if (!session) {
        return { payload: undefined, accessToken, refreshToken };
    }

    const newAccessToken = await jwt.sign(session, env.AUTH_PRIVATE_KEY, { algorithm: "RS256", expiresIn: 15 });

    return { payload: (await verify(newAccessToken))?.payload, accessToken: newAccessToken, refreshToken };
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

export const loginPageUrl = "/id/login";

export async function authenticate() {
    const session = await getServerSession();

    if (!session) {
        redirect(loginPageUrl);
    }
}
