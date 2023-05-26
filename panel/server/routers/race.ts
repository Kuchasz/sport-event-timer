import { protectedProcedure, publicProcedure, router } from "../trpc"
import { z } from "zod";

const raceSchema = z.object({
    id: z.number().min(1).nullish(),
    name: z.string({ required_error: "name is required" }),
    date: z.date({ required_error: "date is required" }),
    playersLimit: z.number().int().positive().nullish(),
    registrationEnabled: z.boolean()
});

export const raceRouter =
    router({
        basicInfo: publicProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const id = input.raceId;
                return await ctx.db.race.findUnique({ where: { id }, select: { name: true, date: true } });
            }),
        races: protectedProcedure
            .query(async ({ ctx }) => {
                const racesWithRegistrations = await ctx.db.race.findMany({ include: { playerRegistration: true } });
                return racesWithRegistrations.map(r => ({
                    id: r.id,
                    name: r.name,
                    date: r.date,
                    playersLimit: r.playersLimit,
                    registrationEnabled: r.registrationEnabled,
                    registeredPlayers: r.playerRegistration.length
                }));
            }),
        raport: protectedProcedure
            .query(async ({ ctx }) => {
                const totalRaces = await ctx.db.race.count();
                const pastRaces = await ctx.db.race.count({ where: { date: { lte: new Date() } } });
                const futureRaces = await ctx.db.race.count({ where: { date: { gte: new Date() } } });
                const nextRace = await ctx.db.race.findFirst({ where: { date: { gte: new Date() } }, orderBy: { date: 'asc' }, include: { playerRegistration: true, player: true } });
                return {
                    totalRaces,
                    pastRaces,
                    futureRaces,
                    nextRace: {
                        name: nextRace?.name,
                        registeredPlayers: nextRace?.playerRegistration.length,
                        players: nextRace?.player.length,
                        playersLimit: nextRace?.playersLimit,
                        date: nextRace?.date,
                        registrationEnabled: nextRace?.registrationEnabled
                    }
                };
            }),
        myRaces: protectedProcedure
            .query(async ({ ctx }) => {
                return await ctx.db.race.findMany({ orderBy: { id: "desc" } });
            }),
        race: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const id = input.raceId;
                return await ctx.db.race.findUnique({ where: { id } });
            }),
        delete: protectedProcedure
            .input(z.object({
                raceId: z.number()
            }))
            .mutation(async ({ input, ctx }) => {
                return await ctx.db.race.delete({ where: { id: input.raceId } });
            }),
        update: protectedProcedure
            .input(raceSchema)
            .mutation(async ({ input, ctx }) => {
                const { id, ...data } = input;
                return await ctx.db.race.update({ where: { id: id! }, data });
            }),
        add: protectedProcedure
            .input(raceSchema)
            .mutation(async ({ input, ctx }) => {
                const { id, ...data } = input;
                const race = await ctx.db.race.create({ data });

                const timingPointsToCreate = [{
                    name: "Start",
                    description: "Where the players start",
                    raceId: race.id
                }, {
                    name: "Finish",
                    description: "Where the players finish",
                    raceId: race.id
                }].map(tp => ctx.db.timingPoint.create({ data: tp }));

                const timingPoints = await ctx.db.$transaction(timingPointsToCreate);

                await ctx.db.timingPointOrder.create({ data: { raceId: race.id, order: JSON.stringify(timingPoints.map(tp => tp.id)) } })
            })
    });

export type RaceRouter = typeof raceRouter;
