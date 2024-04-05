import { daysFromNow } from "@set/utils/dist/datetime";
import { z } from "zod";
import { timingPointErrors } from "../../modules/timing-point/errors";
import { timingPointAccessUrlSchema, timingPointSchema, type TimingPointType } from "../../modules/timing-point/models";
import { protectedProcedure, router } from "../trpc";

export const timingPointRouter = router({
    timingPoints: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const timingPoints = await ctx.db.timingPoint.findMany({
                where: { raceId },
                include: { _count: { select: { timingPointAccessUrl: true, split: true } } },
            });

            return timingPoints.map(timingPoint => ({
                ...timingPoint,
                type: timingPoint.type as TimingPointType,
                splits: timingPoint._count.split,
                numberOfAccessUrls: timingPoint._count.timingPointAccessUrl,
            }));
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
            const timingPoint = await ctx.db.timingPoint.findFirstOrThrow({
                where: { raceId, id: timingPointId },
            });
            return {
                ...timingPoint,
                type: timingPoint.type as TimingPointType,
            };
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

        return await ctx.db.timingPoint.update({ where: { id: id! }, data });
    }),
    delete: protectedProcedure.input(timingPointSchema).mutation(async ({ input, ctx }) => {
        const { id } = input;

        const numberOfTimingPoints = await ctx.db.timingPoint.count({ where: { raceId: input.raceId } });
        if (numberOfTimingPoints <= 2) throw timingPointErrors.AT_LEAST_TWO_TIMING_POINTS_REQUIRED;

        const existsAnySplit = await ctx.db.split.findFirst({ where: { raceId: input.raceId, timingPointId: id! } });
        if (existsAnySplit) throw timingPointErrors.DELETE_NOT_ALLOWED_WHEN_USED_IN_SPLITS;

        await ctx.db.timingPointAccessUrl.deleteMany({ where: { timingPointId: id! } });
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

            return newTimingPoint;
        }),
});

export type TimingPointRouter = typeof timingPointRouter;
