import { protectedProcedure, router } from "../trpc";
import { db } from "../db";
import { z } from "zod";

const timingPointSchema = z.object({
    id: z.number().min(1).nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
    description: z.string().max(100).nullish()
});

export const timingPointRouter =
    router({
        timingPoints: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async (req) => {
                const raceId = req.input.raceId;
                return await db.timingPoint.findMany({ where: { raceId } });
            }),
        timingPointsOrder: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async (req) => {
                const raceId = req.input.raceId;
                const { order } = await db.timingPointOrder.findUniqueOrThrow({ where: { raceId }, select: { order: true } });
                return JSON.parse(order) as number[];
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
            .input(z.object({
                timingPoint: timingPointSchema,
                desiredIndex: z.number({ required_error: 'Desired Index is required' })
            }))
            .mutation(async (req) => {
                const { input } = req;

                const newTimingPoint = await db.timingPoint.create({
                    data: {
                        name: input.timingPoint.name,
                        description: input.timingPoint.description,
                        raceId: input.timingPoint.raceId
                    }
                });

                const timingPointOrder = await db.timingPointOrder.findUniqueOrThrow({ where: { raceId: input.timingPoint.raceId } })

                const order = JSON.parse(timingPointOrder.order) as number[];
                order.splice(input.desiredIndex, 0, newTimingPoint.id);

                await db.timingPointOrder.update({ where: { raceId: input.timingPoint.raceId }, data: { order: JSON.stringify(order) } })

                return newTimingPoint;
            })
    });

export type TimingPointRouter = typeof timingPointRouter;
