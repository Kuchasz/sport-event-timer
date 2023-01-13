import { protectedProcedure, router } from "../trpc";
import { db } from "../db";
import { z } from "zod";

const timingPointSchema = z.object({
    id: z.number().min(1).nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
    description: z.string().max(100).nullish(),
    order: z.number({ required_error: "order is required" })
});

export const timingPointRouter =
    router({
        timingPoints: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async (req) => {
                const raceId = req.input.raceId;
                return await db.timingPoint.findMany({ where: { raceId } });
            }),
        update: protectedProcedure
            .input(timingPointSchema)
            .mutation(async (req) => {
                const { id, ...data } = req.input;

                return await db.timingPoint.update({ where: { id: id! }, data });
            }),
        delete: protectedProcedure
            .input(timingPointSchema)
            .mutation(async ({ input }) => {
                const { id } = input;

                return await db.timingPoint.delete({ where: { id: id! } });
            }),
        add: protectedProcedure
            .input(timingPointSchema)
            .mutation(async (req) => {
                const { input } = req;

                const newTimingPoint = await db.timingPoint.create({
                    data: {
                        name: input.name,
                        order: input.order,
                        raceId: input.raceId
                    }
                });

                return newTimingPoint;
            })
    });

export type TimingPointRouter = typeof timingPointRouter;
