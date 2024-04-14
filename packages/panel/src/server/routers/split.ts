import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { splitSchema } from "../../modules/split/model";
import { arraysMatches } from "@set/utils/dist/array";
import { splitErrors } from "../../modules/split/errors";

export const splitRouter = router({
    splits: protectedProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
                classificationId: z.number({ required_error: "classificationId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { raceId, classificationId } = input;
            const splits = await ctx.db.split.findMany({
                where: { raceId, classificationId },
            });

            return splits;
        }),
    updateSplits: protectedProcedure
        .input(
            z.object({
                raceId: z.number(),
                classificationId: z.number(),
                order: z.array(z.number()),
                splits: z.array(splitSchema),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { raceId, order, classificationId, splits } = input;

            const splitIds = splits.map(s => s.id);

            if (!arraysMatches(splitIds, order)) throw splitErrors.ORDER_ARRAY_MUST_MATCH_SPLITS_DEFINITIONS;

            const splitsToUpdate = splits.filter(s => s.id > 0);
            const splitsToCreate = splits.filter(s => s.id < 0);

            const existingSplits = await ctx.db.split.findMany({ where: { raceId, classificationId } });

            const updates = splitsToUpdate.map(s => ctx.db.split.update({ where: { id: s.id }, data: s }));
            const creates = splitsToCreate.map(s => ctx.db.split.create({ data: { ...s, raceId, classificationId } }));

            await ctx.db.splitOrder.update({ where: { raceId, classificationId }, data: { order: JSON.stringify(order) } });
        }),
    splitsOrder: protectedProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
                classificationId: z.number({ required_error: "classificationId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { raceId, classificationId } = input;
            const { order } = await ctx.db.splitOrder.findUniqueOrThrow({ where: { raceId, classificationId }, select: { order: true } });
            return JSON.parse(order) as number[];
        }),
    // update: protectedProcedure.input(timingPointSchema).mutation(async ({ input, ctx }) => {
    //     const { id, ...data } = input;

    //     return await ctx.db.timingPoint.update({ where: { id: id! }, data });
    // }),
    // delete: protectedProcedure.input(timingPointSchema).mutation(async ({ input, ctx }) => {
    //     const { id } = input;

    //     const numberOfTimingPoints = await ctx.db.timingPoint.count({ where: { raceId: input.raceId } });
    //     if (numberOfTimingPoints <= 2) throw timingPointErrors.AT_LEAST_TWO_TIMING_POINTS_REQUIRED;

    //     const existsAnySplit = await ctx.db.split.findFirst({ where: { raceId: input.raceId, timingPointId: id! } });
    //     if (existsAnySplit) throw timingPointErrors.DELETE_NOT_ALLOWED_WHEN_USED_IN_SPLITS;

    //     await ctx.db.timingPointAccessUrl.deleteMany({ where: { timingPointId: id! } });
    //     return await ctx.db.timingPoint.delete({ where: { id: id! } });
    // }),
    // add: protectedProcedure
    //     .input(
    //         z.object({
    //             timingPoint: timingPointSchema,
    //             desiredIndex: z.number({ required_error: "Desired Index is required" }),
    //         }),
    //     )
    //     .mutation(async ({ input, ctx }) => {
    //         const newTimingPoint = await ctx.db.timingPoint.create({
    //             data: {
    //                 type: "checkpoint",
    //                 name: input.timingPoint.name,
    //                 shortName: input.timingPoint.shortName,
    //                 description: input.timingPoint.description,
    //                 raceId: input.timingPoint.raceId,
    //             },
    //         });

    //         await ctx.db.timingPointAccessUrl.create({
    //             data: {
    //                 raceId: input.timingPoint.raceId,
    //                 name: "Default",
    //                 canAccessOthers: false,
    //                 expireDate: daysFromNow(5),
    //                 token: "blah",
    //                 timingPointId: newTimingPoint.id,
    //             },
    //         });

    //         return newTimingPoint;
    //     }),
});

export type SplitRouter = typeof splitRouter;
