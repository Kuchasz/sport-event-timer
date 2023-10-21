import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "exceptions";
import { db } from "server/db";

const getRegisteredPlayersForRace = async (req: NextApiRequest, res: NextApiResponse) => {
    const { raceId } = req.query;

    const results = await db.playerRegistration.findMany({
        where: { raceId: Number(raceId) },
        select: { profile: { select: { name: true, lastName: true, team: true, city: true } }, hasPaid: true },
    });

    res.json(results.map(r => ({ ...r.profile, ...r })));
};

export default withRaceApiKey(withExceptionHandling(getRegisteredPlayersForRace));
