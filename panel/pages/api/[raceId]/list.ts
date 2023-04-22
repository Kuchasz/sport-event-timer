import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "exceptions";
import { db } from "server/db";

const getRegisteredPlayersForRace = async (req: NextApiRequest, res: NextApiResponse) => {

    const { raceId } = req.query;

    const results = await db.playerRegistration.findMany({ 
        where: { raceId: Number(raceId) }, 
        select: { name: true, lastName: true, team: true, city: true } });

    res.json(results);
}

export default withRaceApiKey(withExceptionHandling(getRegisteredPlayersForRace));