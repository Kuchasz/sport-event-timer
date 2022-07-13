import * as fs from "../async-fs";
import * as trpc from "@trpc/server";
import { db } from "../db";
import { RegistrationPlayer } from "@set/timer/model";
import { z } from "zod";

const ClassificationsEnum = z.enum(["rnk_pro", "rnk_fun", "rnk_tt", "gc", "all"]);
const GenderEnum = z.enum(["male", "female"]);

export const playerRouter = trpc
    .router()
    .query("legacy-players", {
        input: ClassificationsEnum,
        async resolve(req) {
            const players = await fs.readCsvAsync<RegistrationPlayer[]>("../uploaded-players.csv");
            return players.filter(p => req.input === "all" || p.classificationId === req.input);
        }
    })
    .query("players", {
        input: z.object({ raceId: z.number({ required_error: "raceId is required" }) }),
        async resolve({ input }) {
            const { raceId } = input;
            return await db.player.findMany({
                where: { classification: { raceId } },
                include: { classification: true }
            });
        }
    })
    .mutation("add", {
        input: z.object({
            classificationId: z.number({ required_error: "classification is required" }),
            name: z.string({ required_error: "name is required" }),
            lastName: z.string({ required_error: "lastName is required" }),
            gender: GenderEnum,
            birthDate: z.date({ required_error: "birthDate is required" }),
            country: z.string().nullish(),
            city: z.string().nullish(),
            team: z.string().nullish(),
            email: z.string().email("email is not valid").nullish(),
            phoneNumber: z.string().nullish(),
            icePhoneNumber: z.string().nullish()
        }),
        async resolve(req) {
            const { input } = req;
            const classification = await db.classification.findUnique({ where: { id: req.input.classificationId } });
            if (!classification) return;

            const player = await db.player.findFirst();
            if (!player) return;

            return await db.player.create({
                data: {
                    name: input.name,
                    lastName: input.lastName,
                    gender: input.gender,
                    birthDate: input.birthDate,
                    country: input.country,
                    city: input.city,
                    team: input.team,
                    email: input.email,
                    phoneNumber: input.phoneNumber,
                    icePhoneNumber: input.icePhoneNumber,
                    classificationId: classification.id,
                    registeredByUserId: player.id
                }
            });
        }
    });

export type PlayerRouter = typeof playerRouter;
