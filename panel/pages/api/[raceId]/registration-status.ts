import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { withExceptionHandling } from "exceptions";
import { db } from "server/db";

type RegistrationStatus = "enabled" | "disabled" | "limit-reached";

const getRegistrationStatus = async (req: NextApiRequest, res: NextApiResponse) => {
    const { raceId } = req.query;

    const race = await db.race.findFirstOrThrow({ where: { id: Number(raceId) } });

    const registeredPlayers = await db.playerRegistration.count({ where: { raceId: Number(raceId) } });

    res.json({
        limit: race.playersLimit,
        registered: registeredPlayers,
        raceName: race.name,
        raceDate: race.date,
        status: (!race.registrationEnabled
            ? "disabled"
            : race.playersLimit
            ? registeredPlayers >= race.playersLimit
                ? "limit-reached"
                : "enabled"
            : "enabled") as RegistrationStatus,
    });
};

export default withRaceApiKey(withExceptionHandling(getRegistrationStatus));
