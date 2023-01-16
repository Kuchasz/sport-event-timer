import { protectedProcedure, router } from "../trpc"
import { db } from "../db";
import { z } from "zod";

const raceSchema = z.object({
    id: z.number().min(1).nullish(),
    name: z.string({ required_error: "name is required" }),
    date: z.date({ required_error: "date is required" })
});

export const raceRouter =
    router({
        races: protectedProcedure
            .query(async () => {
                return await db.race.findMany();
            }),
        myRaces: protectedProcedure
            .query(async () => {
                return await db.race.findMany({ orderBy: { id: "desc" } });
            }),
        race: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async (req) => {
                const id = req.input.raceId;
                return await db.race.findUnique({ where: { id } });
            }),
        delete: protectedProcedure
            .input(z.object({
                raceId: z.number()
            }))
            .mutation(async ({ input }) => {
                return await db.race.delete({ where: { id: input.raceId } });
            }),
        update: protectedProcedure
            .input(raceSchema)
            .mutation(async (req) => {
                const { id, ...data } = req.input;
                return await db.race.update({ where: { id: id! }, data });
            }),
        add: protectedProcedure
            .input(raceSchema)
            .mutation(async (req) => {
                const { id, ...data } = req.input;
                const race = await db.race.create({ data });

                const timingPointsToCreate = [{
                    name: "Start",
                    description: "Where the players start",
                    raceId: race.id
                }, {
                    name: "Finish",
                    description: "Where the players finish",
                    raceId: race.id
                }].map(tp => db.timingPoint.create({ data: tp }));

                const timingPoints = await db.$transaction(timingPointsToCreate);

                await db.timingPointOrder.create({ data: { raceId: race.id, order: JSON.stringify(timingPoints.map(tp => tp.id)) } })
            })
    });

export type RaceRouter = typeof raceRouter;
