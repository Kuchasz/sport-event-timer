import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "server/db";
import { withExceptionHandling } from "exceptions";
import { z } from "zod";
import { GenderEnum } from "../../../models";
// import { sendRegistrationConfirmation } from "../../../messages";

const stripNonNumbers = (string: string) => string.replace(/\D/g, '');

const registerPlayer = async (req: NextApiRequest, res: NextApiResponse) => {

    const { raceId } = req.query;

    const {
        name,
        lastName,
        birthDate,
        gender,
        team,
        city,
        country,
        email,
        phoneNumber,
        icePhoneNumber } = req.body;

    const registrationEntryModel = z.object({
        email: z.string().email(),
        gender: GenderEnum,
        phoneNumber: z.string(),
        icePhoneNumber: z.string()
    });

    const registrationEntry = {
        email,
        gender,
        phoneNumber: stripNonNumbers(phoneNumber),
        icePhoneNumber: stripNonNumbers(icePhoneNumber)
    };

    if (!registrationEntryModel.safeParse(registrationEntry).success) {
        res.status(500).send('Invalid registration entry');
        return;
    }

    //validate race registration state

    // const race = await db.race.findFirstOrThrow({ where: { id: parseInt(raceId as string) } });

    const id = await db.playerRegistration.create({
        data: {
            raceId: parseInt(raceId as string),
            name: name.trim(),
            lastName: lastName.trim(),
            registrationDate: new Date(),
            birthDate: new Date(birthDate),
            gender: registrationEntry.gender,
            team: team?.trim(),
            city: city.trim(),
            country,
            email: registrationEntry.email,
            phoneNumber: registrationEntry.phoneNumber,
            icePhoneNumber: registrationEntry.icePhoneNumber,
            hasPaid: false
        }
    });

    // await sendRegistrationConfirmation({
    //     email, raceName: race.name, template: race.emailTemplate, placeholderValues: [
    //         ['name', name.trim()], 
    //         ['lastName', lastName.trim()], 
    //         ['raceName', race.name], 
    //         ['raceDate', race.date.toLocaleDateString()]
    //     ]
    // })

    res.json(id);
}

export default withRaceApiKey(withExceptionHandling(registerPlayer));