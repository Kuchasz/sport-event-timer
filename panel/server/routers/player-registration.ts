import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { GenderEnum } from "../schema";
import { TRPCError } from "@trpc/server";

const playerRegistrationSchema = z.object({
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
    icePhoneNumber: z.string().nullish(),
    hasPaid: z.boolean()
});

const racePlayerRegistrationSchema = z.object({
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    player: playerRegistrationSchema
});


type RegistrationStatus = 'enabled' | 'disabled' | 'limit-reached';

export const playerRegistrationRouter =
    router({
        registrations: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const { raceId } = input;
                const registrations = await ctx.db.playerRegistration.findMany({
                    where: { raceId: raceId }
                });

                return registrations.map((r, index) => ({ ...r, index: index + 1 }));
            }),
        teams: publicProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const { raceId } = input;

                const results = await ctx.db.playerRegistration.groupBy({ by: ['team'], where: { raceId: Number(raceId), team: { not: null } } });

                return results.map(r => r.team!);
            }),
        registrationStatus: publicProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const { raceId } = input;

                const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId } });

                const registeredPlayers = await ctx.db.playerRegistration.count({ where: { raceId } });

                return {
                    limit: race.playersLimit,
                    registered: registeredPlayers,
                    raceName: race.name,
                    raceDate: race.date,
                    status: (!race.registrationEnabled
                        ? 'disabled'
                        : race.playersLimit
                            ? registeredPlayers >= race.playersLimit
                                ? 'limit-reached'
                                : 'enabled'
                            : 'enabled') as RegistrationStatus
                }
            }),
        register: publicProcedure
            .input(racePlayerRegistrationSchema)
            .mutation(async ({ input, ctx }) => {

                const race = await ctx.db.race.findFirstOrThrow({ where: { id: input.raceId }, include: { playerRegistration: true } });

                const raceRegistrationsCount = race.playerRegistration.length;

                if (!race.registrationEnabled) {
                    return new TRPCError({ code: "FORBIDDEN", message: "Registration disabled" });
                }

                if (race.playersLimit && (race.playersLimit <= raceRegistrationsCount)) {
                    return new TRPCError({ code: 'FORBIDDEN', message: 'Registrations exceeded' });
                }

                return await ctx.db.playerRegistration.create({
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
                        icePhoneNumber: input.player.icePhoneNumber,
                        hasPaid: false
                    }
                });
            }),
        delete: protectedProcedure
            .input(z.object({ playerId: z.number() }))
            .mutation(async ({ input, ctx }) => {
                return await ctx.db.playerRegistration.delete({ where: { id: input.playerId } });
            }),
        setPaymentStatus: protectedProcedure
            .input(z.object({ playerId: z.number(), hasPaid: z.boolean() }))
            .mutation(async ({ input, ctx }) => {
                return await ctx.db.playerRegistration.update({ where: { id: input.playerId }, data: { hasPaid: input.hasPaid, paymentDate: input.hasPaid ? new Date() : null } });
            }),
        add: protectedProcedure
            .input(racePlayerRegistrationSchema)
            .mutation(async ({ input, ctx }) => {

                const race = await ctx.db.race.findFirstOrThrow({ where: { id: input.raceId }, include: { playerRegistration: true } });

                const raceRegistrationsCount = race.playerRegistration.length;

                if (race.playersLimit && (race.playersLimit <= raceRegistrationsCount)) {
                    return new TRPCError({ code: 'FORBIDDEN', message: 'Registrations exceeded' });
                }

                return await ctx.db.playerRegistration.create({
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
                        icePhoneNumber: input.player.icePhoneNumber,
                        hasPaid: false
                    }
                });
            }),
        edit: protectedProcedure
            .input(racePlayerRegistrationSchema)
            .mutation(async ({ input, ctx }) => {
                return await ctx.db.playerRegistration.update({
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
