import * as fs from "../async-fs";
import * as trpc from "@trpc/server";
import { db } from "../db";
import { RegistrationPlayer } from "@set/timer/dist/model";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const ClassificationsEnum = z.enum(["rnk_pro", "rnk_fun", "rnk_tt", "gc", "all"]);
export const GenderEnum = z.enum(["male", "female"]);

const playerSchema = z.object({
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    player: z.object({
        id: z.number().nullish(),
        classificationId: z.number({ required_error: "classification is required" }),
        name: z.string({ required_error: "name is required" }).min(3),
        lastName: z.string({ required_error: "lastName is required" }).min(3),
        bibNumber: z.number().nullish(),
        startTime: z.number().optional(),
        gender: GenderEnum,
        birthDate: z.date({ required_error: "birthDate is required" }),
        country: z.string().nullish(),
        city: z.string().nullish(),
        team: z.string().nullish(),
        email: z.string().email("email is not valid").nullish(),
        phoneNumber: z.string().nullish(),
        icePhoneNumber: z.string().nullish()
    })
});

const stopwatchPlayersSchema = z.array(
    z.object({
        name: z.string(), 
        lastName: z.string(), 
        bibNumber: z.number(), 
        startTime: z.number().optional()
    }));

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
                where: { raceId: raceId },
                include: { classification: true }
            });
        }
    })
    .query("stopwatch-players", {
        input: z.object({ raceId: z.number({ required_error: "raceId is required" }) }),
        output: stopwatchPlayersSchema,
        async resolve({ input }) {
            const { raceId } = input;
            const players = await db.player.findMany({
                where: { raceId: raceId, bibNumber: { not: null } },
                select: {
                    name: true,
                    lastName: true,
                    bibNumber: true,
                    startTime: true
                }
            });
            return players as z.TypeOf<typeof stopwatchPlayersSchema>;
        }
    })
    .query("start-list", {
        input: z.object({ raceId: z.number({ required_error: "raceId is required" }) }),
        async resolve({ input }) {
            const { raceId } = input;
            const race = await db.race.findFirstOrThrow({ where: { id: raceId } });
            const playersWithTimes = await db.player.findMany({
                where: { raceId: raceId },
                select: {
                    name: true,
                    lastName: true,
                    bibNumber: true,
                    startTime: true
                }
            });

            if (playersWithTimes.some(p => !p.startTime))
                throw new TRPCError({
                    message: "Some of the players does not have start times",
                    code: "PRECONDITION_FAILED"
                });

            return playersWithTimes.map(p => ({
                name: p.name,
                lastName: p.lastName,
                bibNumber: p.bibNumber,
                absoluteStartTime: race.date.getTime() + p.startTime!
            }));
        }
    })
    .mutation("delete", {
        input: z.object({
            playerId: z.number()
        }),
        async resolve({ input }) {
            // dispatchAction({
            //     clientId: "",
            //     action: remove({ id: id! })
            // });

            return await db.player.delete({ where: { id: input.playerId } });
        }
    })
    .mutation("add", {
        input: playerSchema,
        async resolve(req) {
            const { input } = req;
            const classification = await db.classification.findFirstOrThrow({
                where: { id: input.player.classificationId, race: { id: input.raceId } },
                include: { race: true }
            });
            if (!classification) return;

            const user = await db.user.findFirstOrThrow();

            return await db.player.create({
                data: {
                    raceId: input.raceId,
                    name: input.player.name,
                    lastName: input.player.lastName,
                    gender: input.player.gender,
                    bibNumber: input.player.bibNumber,
                    startTime: input.player.startTime,
                    birthDate: input.player.birthDate,
                    country: input.player.country,
                    city: input.player.city,
                    team: input.player.team,
                    email: input.player.email,
                    phoneNumber: input.player.phoneNumber,
                    icePhoneNumber: input.player.icePhoneNumber,
                    classificationId: classification.id,
                    registeredByUserId: user.id
                }
            });
        }
    })
    .mutation("edit", {
        input: playerSchema,
        async resolve(req) {
            const { input } = req;
            const classification = await db.classification.findFirstOrThrow({
                where: { id: input.player.classificationId, race: { id: input.raceId } },
                include: { race: true }
            });
            if (!classification) return;

            const user = await db.user.findFirst();
            if (!user) return;

            return await db.player.update({
                where: { id: input.player.id! },
                data: {
                    name: input.player.name,
                    lastName: input.player.lastName,
                    gender: input.player.gender,
                    bibNumber: input.player.bibNumber,
                    startTime: input.player.startTime,
                    birthDate: input.player.birthDate,
                    country: input.player.country,
                    city: input.player.city,
                    team: input.player.team,
                    email: input.player.email,
                    phoneNumber: input.player.phoneNumber,
                    icePhoneNumber: input.player.icePhoneNumber,
                    classificationId: classification.id
                }
            });
        }
    });

export type PlayerRouter = typeof playerRouter;
