import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { daysFromNow } from "@set/utils/dist/datetime";
import { timingPointSchema } from "../../modules/timing-point/models";

export const timingPointRouter =
    router({
        timingPoints: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const raceId = input.raceId;
                return await ctx.db.timingPoint.findMany({ where: { raceId } });
            }),
        timingPointsOrder: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const raceId = input.raceId;
                const { order } = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId }, select: { order: true } });
                return JSON.parse(order) as number[];
            }),
        addTimingPointAccessKey: protectedProcedure
            .input(z.object({
                raceId: z.number({ required_error: "raceId is required" }),
                timingPointId: z.number({ required_error: "timingPointId is required" }),
                code: z.string().nullable(),
                name: z.string({ required_error: "name is required" }),
                canAccessOthers: z.boolean()
            })).mutation(async ({ input, ctx }) => {
                const timingPointAccessKey = await ctx.db.timingPointAccessKey.create({
                    data: {
                        name: input.name,
                        token: 'blah',
                        timingPointId: input.timingPointId,
                        raceId: input.raceId,
                        code: input.code,
                        canAccessOthers:
                            input.canAccessOthers,
                        expireDate: daysFromNow(5)
                    }
                });

                return timingPointAccessKey;
            }),
        timingPointAccessKeys: protectedProcedure
            .input(z.object({
                timingPointId: z.number({ required_error: "timingPointId is required" }),
                raceId: z.number({ required_error: "raceId is required" })
            })).query(async ({ input, ctx }) => {
                return await ctx.db.timingPointAccessKey.findMany({ where: { raceId: input.raceId, timingPointId: input.timingPointId } });
            }),
        deleteTimingPointAccessKey: protectedProcedure
            .input(z.object({
                timingPointAccessKeyId: z.number()
            }))
            .mutation(async ({ input, ctx }) => {
                return await ctx.db.timingPointAccessKey.delete({ where: { id: input.timingPointAccessKeyId } });
            }),
        update: protectedProcedure
            .input(timingPointSchema)
            .mutation(async ({ input, ctx }) => {
                const { id, ...data } = input;

                return await ctx.db.timingPoint.update({ where: { id: id! }, data });
            }),
        delete: protectedProcedure
            .input(timingPointSchema)
            .mutation(async ({ input, ctx }) => {
                const { id } = input;

                const timingPointOrder = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId: input.raceId } })

                const order = JSON.parse(timingPointOrder.order) as number[];
                const newOrder = order.filter(i => i !== id);

                await ctx.db.timingPointOrder.update({ where: { raceId: input.raceId }, data: { order: JSON.stringify(newOrder) } })

                return await ctx.db.timingPoint.delete({ where: { id: id! } });
            }),
        add: protectedProcedure
            .input(z.object({
                timingPoint: timingPointSchema,
                desiredIndex: z.number({ required_error: 'Desired Index is required' })
            }))
            .mutation(async ({ input, ctx }) => {

                const newTimingPoint = await ctx.db.timingPoint.create({
                    data: {
                        name: input.timingPoint.name,
                        description: input.timingPoint.description,
                        raceId: input.timingPoint.raceId
                    }
                });

                const timingPointOrder = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId: input.timingPoint.raceId } })

                const order = JSON.parse(timingPointOrder.order) as number[];
                const newOrder = [...order];
                newOrder.splice(input.desiredIndex, 0, newTimingPoint.id);

                await ctx.db.timingPointOrder.update({ where: { raceId: input.timingPoint.raceId }, data: { order: JSON.stringify(newOrder) } })

                return newTimingPoint;
            })
    });

export type TimingPointRouter = typeof timingPointRouter;
