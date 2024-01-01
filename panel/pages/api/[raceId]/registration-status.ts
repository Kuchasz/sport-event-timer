import { withRaceApiKey } from "auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "exceptions";
import { db } from "server/db";
import { getRegistrationState } from "modules/race/models";

const handleGetRegistrationStatus = async (req: NextApiRequest, res: NextApiResponse) => {
    const { raceId } = req.query;

    const race = await db.race.findFirstOrThrow({ where: { id: Number(raceId) } });

    const registeredPlayers = await db.playerRegistration.count({ where: { raceId: Number(raceId) } });

    res.json({
        limit: race.playersLimit,
        registered: registeredPlayers,
        raceName: race.name,
        raceDate: race.date,
        state: getRegistrationState(race, registeredPlayers),
    });
};

export default withRaceApiKey(withExceptionHandling(handleGetRegistrationStatus));
