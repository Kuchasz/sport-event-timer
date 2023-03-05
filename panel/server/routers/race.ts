import { protectedProcedure, router } from "../trpc"
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
        races: protectedProcedure
            .query(async ({ ctx }) => {
                return await ctx.db.race.findMany();
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
