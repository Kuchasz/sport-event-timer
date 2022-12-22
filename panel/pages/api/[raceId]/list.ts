import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "server/db";

export default withRaceApiKey(async (req: NextApiRequest, res: NextApiResponse) => {

    const { raceId } = req.query;

    const results = await db.playerRegistration.findMany({ where: { raceId: Number(raceId) } });

    res.json(results);
});