import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, PreviewData } from "next";
import { getSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import { db } from "server/db";
import { z } from "zod";

const ApiKeyAuthModel = z.object({
    apiKey: z.string().regex(/[a-zA-Z0-9]+/),
    raceId: z.number()
});

export const withRaceApiKey = (next: (req: NextApiRequest, res: NextApiResponse) => void) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(403).send("Invalid Method"); return;
    }

    const { raceId } = req.query;
    const { apiKey } = req.body;

    const parseResult = ApiKeyAuthModel.safeParse({ apiKey, raceId: parseInt(raceId as string) });
    if (!parseResult.success) {
        res.status(403).send("Invalid ApiKey configuration"); return;
    }

    const apiKeysForRace = await db.apiKey.findMany({ where: { raceId: parseInt(raceId as string) } });

    if (!apiKeysForRace.map(a => a.key).includes(apiKey)) {
        res.status(403).send("Invalid ApiKey"); return;
    }

    await next(req, res);
}

export async function getSecuredServerSideProps(context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    const { req, resolvedUrl } = context;
    const session = await getSession({ req });
    const destination = `${process.env.NEXTAUTH_URL}${resolvedUrl}`;
    const callbackUrl = `/auth/signin?callbackUrl=${encodeURIComponent(destination)}`;

    if (!session) {
        return {
            redirect: {
                destination: callbackUrl,
                permenant: false,
            },
        };
    }

    if (session) {
        return {
            props: {
                session,
            },
        };
    }
}
