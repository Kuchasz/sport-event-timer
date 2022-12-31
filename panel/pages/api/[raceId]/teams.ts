import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "exceptions";
import { db } from "server/db";

const getTeamNames = async (req: NextApiRequest, res: NextApiResponse) => {

    const { raceId } = req.query;

    const results = await db.playerRegistration.groupBy({ by: ['team'], where: { raceId: Number(raceId) } });

    res.json(results.map(r => r.team));
}

export default withRaceApiKey(withExceptionHandling(getTeamNames));