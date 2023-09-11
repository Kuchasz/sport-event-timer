import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { daysFromNow } from "@set/utils/dist/datetime";
import { timingPointAccessUrlSchema, timingPointSchema } from "../../modules/timing-point/models";
import { TRPCError } from "@trpc/server";

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
        addTimingPointAccessUrl: protectedProcedure
            .input(timingPointAccessUrlSchema).mutation(async ({ input, ctx }) => {
                const timingPointAccessUrl = await ctx.db.timingPointAccessUrl.create({
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

                return timingPointAccessUrl;
            }),
        timingPointAccessUrls: protectedProcedure
            .input(z.object({
                timingPointId: z.number({ required_error: "timingPointId is required" }),
                raceId: z.number({ required_error: "raceId is required" })
            })).query(async ({ input, ctx }) => {
                return await ctx.db.timingPointAccessUrl.findMany({ where: { raceId: input.raceId, timingPointId: input.timingPointId } });
            }),
        deleteTimingPointAccessUrl: protectedProcedure
            .input(z.object({
                timingPointAccessUrlId: z.number()
            }))
            .mutation(async ({ input, ctx }) => {
                return await ctx.db.timingPointAccessUrl.delete({ where: { id: input.timingPointAccessUrlId } });
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

                const numberOfTimingPoints = await ctx.db.timingPoint.count({ where: { raceId: input.raceId } });
                if (numberOfTimingPoints <= 2)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Race must have at least 2 timing points'
                    });

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
