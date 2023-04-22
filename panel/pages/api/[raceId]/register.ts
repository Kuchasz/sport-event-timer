import { withRaceApiKey } from "auth";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "server/db";
import nodemailer from "nodemailer";
import { env } from "env/server.mjs";
import { template } from "messages";
import { withExceptionHandling } from "exceptions";
import { z } from "zod";
import { GenderEnum } from "../../../models";

const transporter = nodemailer.createTransport({
    host: env.NOTIFICATIONS_SERVER_HOST,
    port: parseInt(env.NOTIFICATIONS_SERVER_PORT),
    secure: env.NOTIFICATIONS_SERVER_SECURE,
    auth: {
        user: env.NOTIFICATIONS_SERVER_AUTH_USER,
        pass: env.NOTIFICATIONS_SERVER_AUTH_PASS,
    },
} as any);

type ConfirmationTarget = {
    name: string;
    email: string;
    lastName: string;
    raceName: string;
}

const stripNonNumbers = (string: string) => string.replace(/\D/g,'');

const sendRegistrationConfirmation = async ({ email, name, lastName, raceName }: ConfirmationTarget) =>
    new Promise<void>((res, rej) => {
        const message = {
            from: env.NOTIFICATIONS_MESSAGE_FROM,
            bcc: email,
            subject: `${raceName} - potwierdzenie rejestracji w zawodach`,
            html: template({ name, lastName, raceName }),
            replyTo: `${env.NOTIFICATIONS_MESSAGE_FROM} <${env.NOTIFICATIONS_MESSAGE_TARGET}>`,
        };

        transporter.sendMail(message, (err) => {
            if (err) {
                rej(err);
            } else {
                res();
            }
        });
    });

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

    if(!registrationEntryModel.safeParse(registrationEntry).success){
        res.status(500).send('Invalid registration entry');
        return;
    }

    const race = await db.race.findFirstOrThrow({ where: { id: parseInt(raceId as string) } });

    const id = await db.playerRegistration.create({
        data: {
            raceId: parseInt(raceId as string),
            name,
            lastName,
            registrationDate: new Date(),
            birthDate: new Date(birthDate),
            gender: registrationEntry.gender,
            team,
            city,
            country,
            email: registrationEntry.email,
            phoneNumber: registrationEntry.phoneNumber,
            icePhoneNumber: registrationEntry.icePhoneNumber,
            hasPaid: false
        }
    });

    await sendRegistrationConfirmation({ email, name, lastName, raceName: race.name })

    res.json(id);
}

export default withRaceApiKey(withExceptionHandling(registerPlayer));