import { fromDeepEntries } from "@set/utils/dist/object";
import { z } from "zod";
import { manualSplitTimeSchema } from "../../modules/split-time/models";
import { protectedProcedure, router } from "../trpc";
import { calculateMedian } from "@set/utils/dist/number";
import { distinctArray, groupBy, mapWithPrevious } from "@set/utils/dist/array";
import { Split } from "@prisma/client";

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
            // const { raceId, classificationId, bibNumber, splitId } = input;
            const { raceId, classificationId } = input;

            const splits = await ctx.db.split.findMany({
                where: { raceId, classificationId },
            });
            const splitsOrder = await ctx.db.splitOrder.findFirstOrThrow({ where: { raceId, classificationId } });
            const order = JSON.parse(splitsOrder.order) as number[];
            const splitsInOrder = order.map(id => splits.find(s => s.id === id)!);

            const measuredSplitTimes = await ctx.db.splitTime.findMany({ where: { raceId, splitId: { in: order } } });
            const manualSplitTimes = await ctx.db.manualSplitTime.findMany({ where: { raceId, splitId: { in: order } } });

            const measuredPlayersTimes = measuredSplitTimes.map(
                st => [`${st.bibNumber}.${st.splitId}`, Number(st.time)] as [string, number],
            );
            const manualPlayersTimes = manualSplitTimes.map(st => [`${st.bibNumber}.${st.splitId}`, Number(st.time)] as [string, number]);

            const playersTimesMap = fromDeepEntries([...measuredPlayersTimes, ...manualPlayersTimes]);

            const candidate = estimateSplitTimeBasedOnLegsMedians({
                splitsInOrder,
                playersTimesMap,
                splitId: input.splitId,
                bibNumber: input.bibNumber,
            });

            console.log("candidate: ", candidate);

            // const playerRegisteredSplits = distinctArray(
            //     playerLegTimes.flatMap(([[, s1, s2]]) => [s1, s2]).filter(s => s !== undefined) as number[],
            // );

            // const playerHas

            // const startSplit = splitsInOrder[0];

            // // const medians = mapWithPrevious(splitsInOrder, (current, previous) => {
            // //     if (!previous) return [[current.id, undefined], 0];

            // //     const legTimes = playersTimes.map(st => st[current.id] - st[previous.id]).filter(t => !isNaN(t));

            // //     const legMedian = calculateMedian(legTimes);

            // //     return [[current.id, previous.id], legMedian];
            // // });

            // const split = splitsInOrder.find(s => s.id === splitId)!;
            // const previousSplit = splitsInOrder[splitsInOrder.indexOf(split) - 1];
            // const previousPreviousSplit = splitsInOrder[splitsInOrder.indexOf(split) - 2];

            // const previousLegTime = playersTimesMap[bibNumber][previousSplit.id] - playersTimesMap[bibNumber][previousPreviousSplit.id];

            return { playerEstimatedSplitTime: 0, distanceEstimatedSplitTime: 0 };
        }),
});

const estimateSplitTimeBasedOnLegsMedians = ({
    splitsInOrder,
    playersTimesMap,
    splitId,
    bibNumber,
}: {
    splitsInOrder: Split[];
    playersTimesMap: Record<string, Record<number, number>>;
    splitId: number;
    bibNumber: string;
}) => {
    const legsInOrder = mapWithPrevious(splitsInOrder, (current, previous) => [previous?.id, current.id] as [number | undefined, number]);

    const playersLegTimes = Object.entries(playersTimesMap).flatMap(([bibNumber, times]) =>
        legsInOrder.map(
            ([previous, current]) =>
                [[bibNumber, previous, current], previous && times[current] && times[previous] ? times[current] - times[previous] : 0] as [
                    [string, number | undefined, number],
                    number,
                ],
        ),
    );

    const legsMedians = Object.entries(groupBy(playersLegTimes, ([[, previousId, currentId]]) => `${previousId}.${currentId}`)).map(
        ([key, legTimes]) => [key.split(".").map(Number), calculateMedian(legTimes.map(([, time]) => time))] as [[number, number], number],
    );

    if (legsMedians.length === 0) return null;

    const playerLegTimes = playersLegTimes.filter(([[bn]]) => bn === bibNumber);

    const siblingPlayerLegTimes = playerLegTimes.filter(([[, s1, s2]]) => s1 === splitId || s2 === splitId);

    const playerLegCandidate = siblingPlayerLegTimes.find(([, t]) => t !== 0) ?? playerLegTimes.find(([, t]) => t !== 0);

    if (!playerLegCandidate) return 0;

    const legMedianCandidate = legsMedians.find(([[s1, s2]]) => playerLegCandidate[0][1] === s1 && playerLegCandidate[0][2] === s2);

    const timeRatio = playerLegCandidate[1] / legMedianCandidate![1];

    return legsMedians.find(([[, s2]]) => s2 === splitId)![1] * timeRatio;
};

export type SplitTimeRouter = typeof splitTimeRouter;
