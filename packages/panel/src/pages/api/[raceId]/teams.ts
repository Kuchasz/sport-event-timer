import { withRaceApiKey } from "src/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "src/exceptions";
import { db } from "src/server/db";

const getTeamNames = async (req: NextApiRequest, res: NextApiResponse) => {
    const { raceId } = req.query;

    const results = await db.playerProfile.groupBy({ by: ["team"], where: { raceId: Number(raceId) }, orderBy: { team: "asc" } });

    res.json(results.map(r => r.team));
};

export default withRaceApiKey(withExceptionHandling(getTeamNames));
