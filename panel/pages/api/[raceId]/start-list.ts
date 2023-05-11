import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "exceptions";
import { db } from "server/db";

const getStartListForRace = async (req: NextApiRequest, res: NextApiResponse) => {

    const { raceId } = req.query;

    const results = await db.player.findMany({
        where: { raceId: Number(raceId) },
        select: { bibNumber: true, name: true, lastName: true, team: true, city: true, startTime: true }
    });

    // const race = await db.race.findUniqueOrThrow({ where: { id: Number(raceId) } });

    // race.date

    res.json(results);
}

export default withRaceApiKey(withExceptionHandling(getStartListForRace));