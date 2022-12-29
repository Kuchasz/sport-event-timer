import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "server/db";

const getTeamNames = async (req: NextApiRequest, res: NextApiResponse) => {

    const { raceId } = req.query;

    const results = await db.playerRegistration.groupBy({ by: ['team'], where: { raceId: Number(raceId) } });

    res.json(results);
}

export default withRaceApiKey(getTeamNames);