import { protectedProcedure, router } from "../trpc";
import { db } from "../db";
import { z } from "zod";

const timingPointSchema = z.object({
    id: z.number().min(1).nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
    description: z.string().max(100).nullish()
});

const timingPointCreateSchema = timingPointSchema.and(z.object({ desiredIndex: z.number() }));

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
            .input(timingPointCreateSchema)
            .mutation(async (req) => {
                const { input } = req;

                const newTimingPoint = await db.timingPoint.create({
                    data: {
                        name: input.name,
                        description: input.description,
                        raceId: input.raceId
                    }
                });

                const timingPointOrder = await db.timingPointOrder.findUniqueOrThrow({ where: { raceId: input.raceId } })

                const oldOrder = JSON.parse(timingPointOrder.order) as number[];
                const newOrder = oldOrder.splice(input.desiredIndex, 0, newTimingPoint.id);

                await db.timingPointOrder.update({ where: { raceId: input.raceId }, data: { order: JSON.stringify(newOrder) } })

                return newTimingPoint;
            })
    });

export type TimingPointRouter = typeof timingPointRouter;
