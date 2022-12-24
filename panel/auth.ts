import { NextApiRequest, NextApiResponse } from "next";
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

    const { apiKey, raceId } = req.body;

    const parseResult = ApiKeyAuthModel.safeParse({ apiKey, raceId });
    if (!parseResult.success) {
        res.status(403).send("Invalid ApiKey configuration"); return;
    }

    const apiKeysForRace = await db.apiKey.findMany({ where: { raceId: parseInt(raceId) } });

    if (!apiKeysForRace.map(a => a.key).includes(apiKey)) {
        res.status(403).send("Invalid ApiKey"); return;
    }

    next(req, res);
}