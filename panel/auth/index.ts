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
    secretKey: `
-----BEGIN RSA PRIVATE KEY-----
MIIJKAIBAAKCAgBvTe9Y5Kp3x3H1sGVkDUWz6qscVR5HxCCxkSMhpczvNcCsl4fO
F6V81Y7YfH9reBwMmfJ1Aq0S0015qon0pPxB1qCKb+l6s9YavZCaoMnzFuTkZy/h
/RcKf9QxARvpzFIX3cuU2EldO+8RfKxEl4QlT7frYAFrcmmr8fY7CrgT9TCedoUA
B6+ipnd5qGFIg7yz+fbOsXQMXbh999ccSsMgf+/WRZ0f6Tvn385To0JKwsFsv21P
CRvjnST3d0IFodIQUou+4LDhL5fC4xhp7kwFeVqpQjwhvhzcqw/EkUPDjgrtXBES
AyOreeeXQ8sVw21ImLODhpaCfNm3qr5Ms6iKbfU55eCccY58C4iNfofh0o6ZC4wk
1zTxMixVLtCcnL9l+Gzop0bXiN0dfyTaJUG9gICZ3+Q71RtdPMtrZB441WwhMG+J
2o36uMN3qfHz0JevCEoIhGoYn/Rtl00ScenpJE0oWItkBQ8qFTjTjffReAgN8rH7
k5uXovIY+hY0+0rtCOHDIIOVqrPDpT8mp1tlCES2rhd1zZhHBkehXgUCB8zGH2ho
nCR7LS3cs6C1bYFPIJkwfpGHQMKLehs+TJtrRUj8XBHtUw67mx0yLh0QrnO3EL75
v+tIC2/WanSBJ8wLKvJi8v2MS2SW38HskpE5wyNd2Oz8b0J4fS+AQkvU8QIDAQAB
AoICADOarZrIQeTQ2pwvkYKmyKdW6Mh1Cln5q7LH+MLT7UUG5fLfOn6p5fcPyG/E
oQsBn/eTtJ7dg8LTpvr+v4FmsPIRgVNN+bEDCgRR2WZnn9oNxkfDM6cSQYmDpKyn
t/pY2cLo+UdkU/dfH0M7S19t5D2sTThaxa28WRP4VdIf8SKHrmf5yUYvShYeGgyU
ra4CLg4/mVdRXN2S4kO9EcWzP+6kgl0U33l5GGY0FKQgcE7bJvS1eAeJ0J1iMU5u
w3R7Bzq8GsB/ymJNP46C3cHXUvXCwu7wn5KBYz5ILUJUm1diVtyfr+ZrADGzjlVK
gDDx74wWCDy1vLh5DDQkfKBxN3WCDGs79gzgH84jQup7w66KZy5Hq7E9OoghrcnP
r/DPtWdpOEI2xoGvCg2/eNg0A4qjqb8CP/kKi3DJRvOG4XVdt+mWjJyEBO2tuA+R
SiXU1/LwB7HRVADnfOGwBn4SBDxMokNh4v2rB3cZGMIvCKBKHtmbFws3rlIUcyqn
oLSleggVSmoS2Cdmc3ioVfRxnn2A/VHm1GplCVlS4kAzw3O8I+AfA4VsavxLELSE
cxMUTeDLNBK4XsWqHMq3neineTP5n3YTjCJ3jse90LryQ3+p/Ee7uUG4T9Gng1H1
2QcFHTnC+lc+BSlhf5mNrv9QIPIOt34r3sDExEgoQ7s2WXHxAoIBAQC0q/d4VNZ+
uETPMu7Uj4CEOhWMs2VZ9ywnsysUdDYFrQ9mIoQDK67JmSfF8nG7sn+WWufE2qDg
icsmqdjdJI56O/2l8JKa7G20jFj3IftDsqIsy+Lepohu1VeolAjXS3LRRTiip1rA
aikWPOplbc+lFxzeAmw+Fr1CM04AFCFtG9l4nq1Va/1hP2LLv19XEMCvngQLc46o
zDZZ2kPueIGzA12ugYRqQ54EW0FSAxMzf5yNRfpTzSJqfOx4rgtFcDVmPLACnug9
raNJw2BIPPXUL4oVRVLVxLLGH/UBw/QW1MF5hzTGsu3IC5W0AV7bIe/vtfUXH+lR
BsjlpVI5CoIdAoIBAQCdtgj008J1hdzBvSApgFF7k2s/vfkz3BFjbWYT+gpniOe3
OJhuNl5k7r2bas8XcPB1v+4tab4vaiecbDrUpbs/TFou2nARtb19Wuy1cYX1i83H
LJvyGQsg3voN5QIEWlECm43oz0FFNTm+Vq5+0JlncVgfItBt9uHAfL8ssxZ157f2
QOIRm/g+tqq9hbQOpJR+kxOOwzNfCMp/fZ/6WUFFncE36Iwm43HHnNUVksCWfZKV
k2DuABpiZ5Wmb/xcrW08G/aW0RZS9ymM/St93vFc39eeOZ3enthGDb0WIZFjIGVA
DFX+9eADdint/8jpN5ROvhcHiYQWXRNd+sur0GXlAoIBAGvoAYfG88z/dWli/C3L
/2/52QEN7EyNSbv0UJiIx/Mf54CSwNG790rExHJ/WNpHw9gjNyXlhgxVgBX5f2Kl
AMuUpOvFAWqyJtucr036570JJb8njrp4MCgyF4bB033yvAKtGyRaW+NsBFoZy80E
hu4NHdqjC88RebveNInrfANUjNBzxQat1smMOA+Enwa7JLo+4B+Oxved8CA+MjBt
nNkz+3HMPS/SbsAfWKYI3CD36KKf1uDSNenv7rQtDuJMIDiNqnoGOqML3+igXhMH
BbPTKN+HZe/y6OtYDtcdF93C+EMDM8ww9b9y29iEsQij/k/nFxjWoF0adkZiNPeI
hSkCggEBAJiD+/FYAAxLIgux7DJ2R1ZsYCFKhH6kaaRvnXHgMsOhYASOFMswhOSz
BGYSSqdurvwQWjNMuYF89UWOXO5cP9Kc8fGxiQN3cAKUNanaWSP2yU++Uik0EtD9
EXDycJrpBMKyz+++zm4xZOAvT5yP+mpQ8Flb/5j4UaUmfnKp1iS7q+nXIUjKPq3X
VRLnBBPNEVW+wgEjwMA87ieQw28FddvvDXYVy8On3NafUmoEe36NfX5tAiXnr5xO
dCh6z+CITsT8feGn3iDpqSMRike1nFCmoAwByCwMDTbh/mQynjjwkTn5NAjWmoZ+
dVoWLKNs/l2P8xF06Wn/JMWTzfcgGAkCggEBAKOK6CHgonp1TnrQ33dTBS/fy6xZ
vtrh0OyevLllv0D6q3h2a0OyeOW2Ih2VyeHJpnLojCuyWBCvv05yf4TD4gQt5cqP
8xTiNlGssf4iznPjdexY9YQYb6y1Cvcp2UeYpqB0jAJ7ub+cTiiSdx/ODI+Gm3kd
X0s6myoc+uYyafmApn45kTzd3AyW3HzIKdaXdVOeq44LNRhbTvH92IEHQeScBhni
5mxMMtzflk41WL8WCv865lLiiu+/flLGeR4FXIU/v59aWqS+BeQELfL4lKb5prUJ
2dRnOuVsqPW9bPhUUHjI8DwGrSLO0gpc0vDAKNJ9ovXL+BObDfXJDPjLDW8=
-----END RSA PRIVATE KEY-----`,
    publicKey: `
-----BEGIN PUBLIC KEY-----
MIICITANBgkqhkiG9w0BAQEFAAOCAg4AMIICCQKCAgBvTe9Y5Kp3x3H1sGVkDUWz
6qscVR5HxCCxkSMhpczvNcCsl4fOF6V81Y7YfH9reBwMmfJ1Aq0S0015qon0pPxB
1qCKb+l6s9YavZCaoMnzFuTkZy/h/RcKf9QxARvpzFIX3cuU2EldO+8RfKxEl4Ql
T7frYAFrcmmr8fY7CrgT9TCedoUAB6+ipnd5qGFIg7yz+fbOsXQMXbh999ccSsMg
f+/WRZ0f6Tvn385To0JKwsFsv21PCRvjnST3d0IFodIQUou+4LDhL5fC4xhp7kwF
eVqpQjwhvhzcqw/EkUPDjgrtXBESAyOreeeXQ8sVw21ImLODhpaCfNm3qr5Ms6iK
bfU55eCccY58C4iNfofh0o6ZC4wk1zTxMixVLtCcnL9l+Gzop0bXiN0dfyTaJUG9
gICZ3+Q71RtdPMtrZB441WwhMG+J2o36uMN3qfHz0JevCEoIhGoYn/Rtl00Scenp
JE0oWItkBQ8qFTjTjffReAgN8rH7k5uXovIY+hY0+0rtCOHDIIOVqrPDpT8mp1tl
CES2rhd1zZhHBkehXgUCB8zGH2honCR7LS3cs6C1bYFPIJkwfpGHQMKLehs+TJtr
RUj8XBHtUw67mx0yLh0QrnO3EL75v+tIC2/WanSBJ8wLKvJi8v2MS2SW38HskpE5
wyNd2Oz8b0J4fS+AQkvU8QIDAQAB
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
        expiresIn: "15s",
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
        console.log("verify.return", payload);
        return { payload, expired: false };
    } catch (e: any) {
        console.log("verify.error", e);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return { payload: undefined, expired: e.message.includes("jwt expired") as boolean };
    }
};

export const getUserSession = async (
    cookies: Record<string, string>,
): Promise<{ payload?: UserSession; accessToken?: string; refreshToken?: string }> => {
    const { accessToken, refreshToken } = cookies;

    if (!accessToken && !refreshToken) {
        console.log("no access token");
        return { payload: undefined, accessToken, refreshToken };
    }

    console.log("accessToken: ", accessToken.split(".")[2].slice(10, 20));
    console.log("refreshToken: ", refreshToken.split(".")[2].slice(10, 20));

    const { payload, expired } = await verify(accessToken);

    // For a valid access token
    if (payload) {
        console.log("session return");
        return { payload, accessToken, refreshToken };
    }

    // expired but valid access token

    const { payload: refresh } = expired && refreshToken ? await verify(refreshToken) : { payload: undefined };

    //invalid refresh token
    if (!refresh) {
        console.log("invalid refresh token");
        return { payload: undefined, accessToken: undefined, refreshToken: undefined };
    }

    const session = getSession(refresh.sessionId);

    if (!session) {
        console.log("invalid session");
        return { payload: undefined, accessToken, refreshToken };
    }

    console.log("refresh access token");
    const newAccessToken = await jwt.sign(session, auth.secretKey, { algorithm: "RS256", expiresIn: "15s" });

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
