import { protectedProcedure, router } from "../trpc";
import { db } from "../db";
import { z } from "zod";
import { GenderEnum } from "../schema";

const playerRegistrationSchema = z.object({
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    player: z.object({
        id: z.number().nullish(),
        name: z.string({ required_error: "name is required" }).min(3),
        lastName: z.string({ required_error: "lastName is required" }).min(3),
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

export const playerRegistrationRouter =
    router({
        registrations: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input }) => {
                const { raceId } = input;
                return await db.playerRegistration.findMany({
                    where: { raceId: raceId }
                });
            }),
        delete: protectedProcedure
            .input(z.object({ playerId: z.number() }))
            .mutation(async ({ input }) => {
                return await db.playerRegistration.delete({ where: { id: input.playerId } });
            }),
        add: protectedProcedure
            .input(playerRegistrationSchema)
            .mutation(async (req) => {
                const { input } = req;

                return await db.playerRegistration.create({
                    data: {
                        raceId: input.raceId,
                        registrationDate: new Date(),
                        name: input.player.name,
                        lastName: input.player.lastName,
                        gender: input.player.gender,
                        birthDate: input.player.birthDate,
                        country: input.player.country,
                        city: input.player.city,
                        team: input.player.team,
                        email: input.player.email,
                        phoneNumber: input.player.phoneNumber,
                        icePhoneNumber: input.player.icePhoneNumber
                    }
                });
            }),
        edit: protectedProcedure
            .input(playerRegistrationSchema)
            .mutation(async (req) => {
                const { input } = req;

                return await db.playerRegistration.update({
                    where: { id: input.player.id! },
                    data: {
                        name: input.player.name,
                        lastName: input.player.lastName,
                        gender: input.player.gender,
                        birthDate: input.player.birthDate,
                        country: input.player.country,
                        city: input.player.city,
                        team: input.player.team,
                        email: input.player.email,
                        phoneNumber: input.player.phoneNumber,
                        icePhoneNumber: input.player.icePhoneNumber
                    }
                });
            })
    });

export type PlayerRouter = typeof playerRegistrationRouter;
