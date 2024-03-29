import { withRaceApiKey } from "src/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "src/exceptions";
import { db } from "src/server/db";

const getStartListForRace = async (req: NextApiRequest, res: NextApiResponse) => {
    const { raceId } = req.query;

    const results = await db.player.findMany({
        where: { raceId: Number(raceId) },
        select: { bibNumber: true, profile: { select: { name: true, lastName: true, team: true, city: true } }, startTime: true },
    });

    // const race = await db.race.findUniqueOrThrow({ where: { id: Number(raceId) } });

    // race.date

    res.json(results.map(r => ({ ...r.profile, ...r })));
};

export default withRaceApiKey(withExceptionHandling(getStartListForRace));
