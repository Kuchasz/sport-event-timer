import { fromDeepEntries } from "@set/utils/dist/object";
import { z } from "zod";
import { manualSplitTimeSchema } from "../../modules/split-time/models";
import { protectedProcedure, router } from "../trpc";
import { calculateMedian } from "@set/utils/dist/number";

type ResultEntry = [string, { time: number; manual: boolean }];

export const splitTimeRouter = router({
    splitTimes: protectedProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { raceId } = input;

            const splitTimes = await ctx.db.splitTime.findMany({
                where: { raceId },
                include: { split: { include: { timingPoint: true } }, player: { include: { profile: true, classification: true } } },
            });
            const manualSplitTimes = await ctx.db.manualSplitTime.findMany({
                where: { raceId },
                include: { split: { include: { timingPoint: true } }, player: { include: { profile: true, classification: true } } },
            });

            const splitTimesMap = splitTimes.map(
                st => [`${st.bibNumber}.${st.splitId}`, { time: Number(st.time), manual: false }] as ResultEntry,
            );
            const manualSplitTimesMap = manualSplitTimes.map(
                st => [`${st.bibNumber}.${st.splitId}`, { time: Number(st.time), manual: true }] as ResultEntry,
            );

            const allTimesMap = fromDeepEntries([...splitTimesMap, ...manualSplitTimesMap]);

            return splitTimes.map(st => ({
                id: st.id,
                bibNumber: st.player.bibNumber,
                name: st.player.profile.name,
                lastName: st.player.profile.lastName,
                time: allTimesMap[st.bibNumber][st.splitId],
                splitId: st.splitId,
                splitName: st.split.name,
                classificationId: st.player.classificationId,
                classificationName: st.player.classification.name,
                timimingPointId: st.split.timingPointId,
                timingPointName: st.split.timingPoint.name,
            }));
        }),
    update: protectedProcedure.input(manualSplitTimeSchema).mutation(async ({ input, ctx }) => {
        const { id: _id, ...splitTime } = input;

        const existingManualSplitTime = await ctx.db.manualSplitTime.findFirst({
            where: {
                raceId: splitTime.raceId,
                bibNumber: splitTime.bibNumber,
                splitId: splitTime.splitId,
            },
        });

        if (!existingManualSplitTime) {
            return await ctx.db.manualSplitTime.create({ data: splitTime });
        } else
            await ctx.db.manualSplitTime.update({
                where: {
                    splitId_bibNumber: {
                        bibNumber: splitTime.bibNumber,
                        splitId: splitTime.splitId,
                    },
                },
                data: splitTime,
            });
    }),
    revert: protectedProcedure.input(z.object({ bibNumber: z.string(), splitId: z.number() })).mutation(async ({ input, ctx }) => {
        const { ...data } = input;
        return await ctx.db.manualSplitTime.delete({
            where: { splitId_bibNumber: { bibNumber: data.bibNumber, splitId: data.splitId } },
        });
    }),
    estimatedPlayerSplitTime: protectedProcedure
        .input(z.object({ raceId: z.number(), classificationId: z.number(), bibNumber: z.string(), splitId: z.number() }))
        .query(async ({ input, ctx }) => {
            const { raceId, classificationId, bibNumber, splitId } = input;

            const splits = await ctx.db.split.findMany({
                where: { raceId, classificationId },
            });
            const splitsOrder = await ctx.db.splitOrder.findFirstOrThrow({ where: { raceId, classificationId } });
            const order = JSON.parse(splitsOrder.order) as number[];
            const splitsInOrder = order.map(id => splits.find(s => s.id === id)!);

            const measuredSplitTimes = await ctx.db.splitTime.findMany({ where: { raceId, splitId: { in: order } } });
            const manualSplitTimes = await ctx.db.manualSplitTime.findMany({ where: { raceId, splitId: { in: order } } });

            const measuredSplitTimesEntries = measuredSplitTimes.map(
                st => [`${st.bibNumber}.${st.splitId}`, Number(st.time)] as [string, number],
            );
            const manualSplitTimesEntries = manualSplitTimes.map(
                st => [`${st.bibNumber}.${st.splitId}`, Number(st.time)] as [string, number],
            );

            const splitTimesMap = fromDeepEntries([...measuredSplitTimesEntries, ...manualSplitTimesEntries]);

            const medians = Object.fromEntries(
                splitsInOrder.map((s, index) => {
                    if (index === 0) return [s.id, 0];

                    const previousSplit = splitsInOrder[index - 1];
                    const splitTimesForPreviousSplit = splitTimes.filter(st => st.splitId === previousSplit.id);
                    const previousSplitTimes = splitTimesForPreviousSplit.map(st => Number(st.time));
                    const previousSplitTimesMedian = calculateMedian(previousSplitTimes);

                    const splitTimesForSplit = splitTimes.filter(st => st.splitId === s.id);
                    const times = splitTimesForSplit.map(st => Number(st.time));
                    const timesMedian = calculateMedian(times);

                    return [s.id, timesMedian - previousSplitTimesMedian];
                }),
            );

            const previousSplitIndex = splitsInOrder.findIndex(s => s.id === splitId) - 1;
            if (previousSplitIndex < 0) return null;

            const previousSplit = splitsInOrder[previousSplitIndex];
            if (!previousSplit) return null;

            const previousSplitTime = splitTimes.find(st => st.splitId === previousSplit.id && st.bibNumber === bibNumber);
            if (!previousSplitTime) return null;

            const previousSplitMedian = medians[previousSplit.id];
            const previousSplitTimeMedianRatio = Number(previousSplitTime.time) / previousSplitMedian;
            const playerEstimatedSplitTime = previousSplitTimeMedianRatio * medians[splitId];

            return { playerEstimatedSplitTime };
        }),
});

export type SplitTimeRouter = typeof splitTimeRouter;
