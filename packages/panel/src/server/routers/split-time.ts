import { type Split } from "@prisma/client";
import { groupBy, mapWithPrevious } from "@set/utils/dist/array";
import { calculateMedian } from "@set/utils/dist/number";
import { fromDeepEntries } from "@set/utils/dist/object";
import { z } from "zod";
import { manualSplitTimeSchema } from "../../modules/split-time/models";
import { protectedProcedure, router } from "../trpc";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";

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

            console.log("candidate: ", formatTimeWithMilliSec(candidate!));

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
    const legsInOrder = mapWithPrevious(splitsInOrder, (current, previous) => ({
        fromSplit: previous?.id,
        toSplit: current.id,
    }));

    const playersLegTimes = Object.entries(playersTimesMap).flatMap(([bibNumber, times]) =>
        legsInOrder.map(({ fromSplit, toSplit }) => ({
            bibNumber,
            fromSplit,
            toSplit,
            time: fromSplit && times[toSplit] && times[fromSplit] ? times[toSplit] - times[fromSplit] : 0,
        })),
    );

    const legsMedians = Object.entries(groupBy(playersLegTimes, ({ fromSplit, toSplit }) => `${fromSplit}.${toSplit}`)).map(
        ([key, legTimes]) => ({
            fromSplit: Number(key.split(".")[0]),
            toSplit: Number(key.split(".")[1]),
            time: calculateMedian(legTimes.map(({ time }) => time)),
        }),
    );

    if (legsMedians.length === 0) return null;

    const playerLegTimes = playersLegTimes.filter(item => item.bibNumber === bibNumber);

    const siblingPlayerLegTimes = playerLegTimes.filter(({ fromSplit, toSplit }) => fromSplit === splitId || toSplit === splitId);

    const playerLegCandidate = siblingPlayerLegTimes.find(({ time }) => time !== 0) ?? playerLegTimes.find(({ time }) => time !== 0);

    if (!playerLegCandidate) return 0;

    const legMedianCandidate = legsMedians.find(
        ({ fromSplit, toSplit }) => playerLegCandidate.fromSplit === fromSplit && playerLegCandidate.toSplit === toSplit,
    );

    const timeRatio = playerLegCandidate.time / legMedianCandidate!.time;
    const legMedian = legsMedians.find(({ toSplit, fromSplit }) => toSplit === splitId || fromSplit === splitId);

    const legTime = legMedian!.time * timeRatio;

    // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~");
    // console.log("legCandidate: ", legMedian?.fromSplit, legMedian?.toSplit);
    // console.log("timeRatio: ", timeRatio);
    // console.log("startTime: ", formatTimeWithMilliSec(playersTimesMap[bibNumber][splitsInOrder[0].id]));
    // console.log("medianLegTime: ", formatTimeWithMilliSec(legMedian!.time));
    // console.log("legTime: ", formatTimeWithMilliSec(legTime));

    return playersTimesMap[bibNumber][splitsInOrder[0].id] + legTime;
};

export type SplitTimeRouter = typeof splitTimeRouter;
