import { withRaceApiKey } from "auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "server/db";
import { withExceptionHandling } from "exceptions";
import { z } from "zod";
import { genderEnum } from "../../../models";
import { getRegistrationState } from "modules/race/models";
import { playerRegistrationErrorKeys } from "modules/player-registration/errors";

const stripNonNumbers = (string: string) => string.replace(/\D/g, "");

type RequestBody = {
    name: string;
    lastName: string;
    birthDate: string;
    gender: string;
    team: string;
    city: string;
    country: string;
    email: string;
    phoneNumber: string;
    icePhoneNumber: string;
};

const registerPlayer = async (req: NextApiRequest, res: NextApiResponse) => {
    const { raceId } = req.query;

    const { name, lastName, birthDate, gender, team, city, country, email, phoneNumber, icePhoneNumber } = req.body as RequestBody;

    const registrationEntryModel = z.object({
        email: z.string().email(),
        gender: genderEnum,
        phoneNumber: z.string(),
        icePhoneNumber: z.string(),
    });

    const registrationEntry = {
        email,
        gender,
        phoneNumber: stripNonNumbers(phoneNumber),
        icePhoneNumber: stripNonNumbers(icePhoneNumber),
    };

    if (!registrationEntryModel.safeParse(registrationEntry).success) {
        res.status(500).send("Invalid registration entry");
        return;
    }

    const race = await db.race.findUniqueOrThrow({ where: { id: Number(raceId) }, include: { playerRegistration: true } });
    const raceRegistrationsCount = race.playerRegistration.length;

    const registrationState = getRegistrationState(race, raceRegistrationsCount);

    if (registrationState === "disabled")
        return res.status(200).send({ status: "error", errorCode: playerRegistrationErrorKeys.REGISTRATION_DISABLED });
    if (registrationState === "limit-reached")
        return res.status(200).send({ status: "error", errorCode: playerRegistrationErrorKeys.REGISTRATION_LIMIT_REACHED });
    if (registrationState === "cutoff")
        return res.status(200).send({ status: "error", errorCode: playerRegistrationErrorKeys.REGISTRATION_CUTOFF });

    const profile = await db.playerProfile.create({
        data: {
            raceId: parseInt(raceId as string),
            name: name.trim(),
            lastName: lastName.trim(),
            birthDate: new Date(birthDate),
            gender: registrationEntry.gender,
            team: team?.trim(),
            city: city.trim(),
            country,
            email: registrationEntry.email,
            phoneNumber: registrationEntry.phoneNumber,
            icePhoneNumber: registrationEntry.icePhoneNumber,
        },
    });

    await db.playerRegistration.create({
        data: {
            raceId: parseInt(raceId as string),
            playerProfileId: profile.id,
            registrationDate: new Date(),
            hasPaid: false,
        },
    });

    // await sendRegistrationConfirmation({
    //     email, raceName: race.name, template: race.emailTemplate, placeholderValues: [
    //         ['name', name.trim()],
    //         ['lastName', lastName.trim()],
    //         ['raceName', race.name],
    //         ['raceDate', race.date.toLocaleDateString()]
    //     ]
    // })

    res.status(200).json({
        status: "success",
    });
};

export default withRaceApiKey(withExceptionHandling(registerPlayer));
