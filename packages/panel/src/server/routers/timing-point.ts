import { daysFromNow } from "@set/utils/dist/datetime";
import { timingPointErrors } from "../../modules/timing-point/errors";
import { z } from "zod";
import { type TimingPointType, timingPointAccessUrlSchema, timingPointSchema } from "../../modules/timing-point/models";
import { protectedProcedure, router } from "../trpc";

export const timingPointRouter = router({
    timingPoints: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const timingPoints = await ctx.db.timingPoint.findMany({ where: { raceId } });

            return timingPoints.map(timingPoint => ({ ...timingPoint, type: timingPoint.type as TimingPointType }));
        }),
    timingPoint: protectedProcedure
        .input(
            z.object({
                timingPointId: z.number({ required_error: "timingPointId is required" }),
                raceId: z.number({ required_error: "raceId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { raceId, timingPointId } = input;
            const timingPoint = await ctx.db.timingPoint.findFirstOrThrow({ where: { raceId, id: timingPointId } });
            return { ...timingPoint, type: timingPoint.type as TimingPointType };
        }),
    timingPointsOrder: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const { order } = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId }, select: { order: true } });
            return JSON.parse(order) as number[];
        }),
    addTimingPointAccessUrl: protectedProcedure.input(timingPointAccessUrlSchema).mutation(async ({ input, ctx }) => {
        const timingPointAccessUrl = await ctx.db.timingPointAccessUrl.create({
            data: {
                name: input.name,
                token: "blah",
                timingPointId: input.timingPointId,
                raceId: input.raceId,
                code: input.code,
                canAccessOthers: input.canAccessOthers,
                expireDate: daysFromNow(5),
            },
        });

        return timingPointAccessUrl;
    }),
    editTimingPointAccessUrl: protectedProcedure.input(timingPointAccessUrlSchema).mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;

        return await ctx.db.timingPointAccessUrl.update({ where: { id: id! }, data });
    }),
    timingPointAccessUrls: protectedProcedure
        .input(
            z.object({
                timingPointId: z.number({ required_error: "timingPointId is required" }),
                raceId: z.number({ required_error: "raceId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            return await ctx.db.timingPointAccessUrl.findMany({ where: { raceId: input.raceId, timingPointId: input.timingPointId } });
        }),
    deleteTimingPointAccessUrl: protectedProcedure
        .input(
            z.object({
                timingPointAccessUrlId: z.number(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            return await ctx.db.timingPointAccessUrl.delete({ where: { id: input.timingPointAccessUrlId } });
        }),
    update: protectedProcedure.input(timingPointSchema).mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;

        const timingPoint = await ctx.db.timingPoint.findFirstOrThrow({
            where: {
                id: id!,
                raceId: data.raceId,
            },
        });

        if (timingPoint.type !== "checkpoint" && data.laps) throw timingPointErrors.LAPS_ALLOWED_ONLY_ON_CHECKPOINT;

        const newLaps = data.laps ?? 0;

        if (timingPoint.laps && timingPoint.laps > newLaps) {
            const maxLapSplitTime = await ctx.db.splitTime.findFirst({ where: { timingPointId: id! }, orderBy: { lap: "desc" } });
            const maxLapManualSplitTime = await ctx.db.manualSplitTime.findFirst({
                where: { timingPointId: id! },
                orderBy: { lap: "desc" },
            });

            if (newLaps < (maxLapSplitTime?.lap ?? 0) || newLaps < (maxLapManualSplitTime?.lap ?? 0))
                throw timingPointErrors.SPLIT_TIMES_FOR_LAPS_REGISTERED;
        }

        return await ctx.db.timingPoint.update({ where: { id: id! }, data });
    }),
    delete: protectedProcedure.input(timingPointSchema).mutation(async ({ input, ctx }) => {
        const { id } = input;

        const numberOfTimingPoints = await ctx.db.timingPoint.count({ where: { raceId: input.raceId } });
        if (numberOfTimingPoints <= 2) throw timingPointErrors.AT_LEAST_TWO_TIMING_POINTS_REQUIRED;

        const existsAnySplitTime = await ctx.db.splitTime.findFirst({ where: { raceId: input.raceId, timingPointId: id! } });
        if (existsAnySplitTime) throw timingPointErrors.DELETE_NOT_ALLOWED_WITH_SPLIT_TIMES_REGISTERED;

        const existsAnyManualSplitTime = await ctx.db.manualSplitTime.findFirst({ where: { raceId: input.raceId, timingPointId: id! } });
        if (existsAnyManualSplitTime) throw timingPointErrors.DELETE_NOT_ALLOWED_WITH_SPLIT_TIMES_REGISTERED;

        const timingPointOrder = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId: input.raceId } });

        const order = JSON.parse(timingPointOrder.order) as number[];
        const newOrder = order.filter(i => i !== id);

        await ctx.db.timingPointOrder.update({ where: { raceId: input.raceId }, data: { order: JSON.stringify(newOrder) } });
        return await ctx.db.timingPoint.delete({ where: { id: id! } });
    }),
    add: protectedProcedure
        .input(
            z.object({
                timingPoint: timingPointSchema,
                desiredIndex: z.number({ required_error: "Desired Index is required" }),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const newTimingPoint = await ctx.db.timingPoint.create({
                data: {
                    type: "checkpoint",
                    name: input.timingPoint.name,
                    shortName: input.timingPoint.shortName,
                    description: input.timingPoint.description,
                    raceId: input.timingPoint.raceId,
                    laps: input.timingPoint.laps,
                },
            });

            await ctx.db.timingPointAccessUrl.create({
                data: {
                    raceId: input.timingPoint.raceId,
                    name: "Default",
                    canAccessOthers: false,
                    expireDate: daysFromNow(5),
                    token: "blah",
                    timingPointId: newTimingPoint.id,
                },
            });

            const timingPointOrder = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId: input.timingPoint.raceId } });

            const order = JSON.parse(timingPointOrder.order) as number[];
            const newOrder = [...order];
            newOrder.splice(input.desiredIndex, 0, newTimingPoint.id);

            await ctx.db.timingPointOrder.update({
                where: { raceId: input.timingPoint.raceId },
                data: { order: JSON.stringify(newOrder) },
            });

            return newTimingPoint;
        }),
});

export type TimingPointRouter = typeof timingPointRouter;
