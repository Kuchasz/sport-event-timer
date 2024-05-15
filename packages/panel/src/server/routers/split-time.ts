import { type Split } from "@prisma/client";
import { groupBy, mapNeighbours } from "@set/utils/dist/array";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import { calculateMedian } from "@set/utils/dist/number";
import { fromDeepEntries } from "@set/utils/dist/object";
import { z } from "zod";
import { manualSplitTimeSchema } from "../../modules/split-time/models";
import { protectedProcedure, router } from "../trpc";

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

            const candidate = estimateSplitTimeBasedOnSplitMedian({
                splitsInOrder,
                playersTimesMap,
                targetSplitId: input.splitId,
                bibNumber: input.bibNumber,
            });

            const candidate2 = estimateSplitTimeBasedOnPlayersTimesAndSplitMedians({
                splitsInOrder,
                playersTimesMap,
                targetSplitId: input.splitId,
                bibNumber: input.bibNumber,
            });

            console.log("candidate: ", formatTimeWithMilliSec(candidate));
            console.log("candidate2: ", formatTimeWithMilliSec(candidate2));

            return { playerEstimatedSplitTime: 0, distanceEstimatedSplitTime: 0 };
        }),
});

const estimateSplitTimeBasedOnPlayersTimesAndSplitMedians = ({
    splitsInOrder,
    playersTimesMap,
    targetSplitId,
    bibNumber,
}: {
    splitsInOrder: Split[];
    playersTimesMap: Record<string, Record<number, number>>;
    targetSplitId: number;
    bibNumber: string;
}) => {
    const startSplitId = splitsInOrder[0].id;

    const playersLegTimes = Object.entries(playersTimesMap).flatMap(([bibNumber, times]) =>
        splitsInOrder.map(({ id: splitId }) => ({
            bibNumber,
            splitId,
            time: times[splitId] && times[startSplitId] ? times[splitId] - times[startSplitId] : 0,
        })),
    );

    const legsMedians = Object.entries(groupBy(playersLegTimes, ({ splitId }) => splitId)).map(([key, legTimes]) => ({
        splitId: Number(key),
        time: calculateMedian(legTimes.map(({ time }) => time)),
    }));

    if (legsMedians.length === 0) return 0;

    const neighbourPlayerLegTimes = mapNeighbours(
        playersLegTimes.filter(item => item.bibNumber === bibNumber),
        targetSplitId,
        ({ splitId }) => splitId,
    );

    const playerLegCandidate = neighbourPlayerLegTimes.find(({ time }) => time !== 0);

    if (!playerLegCandidate) return 0;

    const legMedianCandidate = legsMedians.find(({ splitId }) => playerLegCandidate.splitId === splitId);

    const timeRatio = playerLegCandidate.time / legMedianCandidate!.time;
    const legMedian = legsMedians.find(({ splitId }) => splitId === targetSplitId);

    const legTime = legMedian!.time * timeRatio;
    const fromStartTime = playersTimesMap[bibNumber][startSplitId] + legTime;

    return fromStartTime;
};

const estimateSplitTimeBasedOnSplitMedian = ({
    splitsInOrder,
    playersTimesMap,
    targetSplitId,
    bibNumber,
}: {
    splitsInOrder: Split[];
    playersTimesMap: Record<string, Record<number, number>>;
    targetSplitId: number;
    bibNumber: string;
}) => {
    const startSplitId = splitsInOrder[0].id;

    const playersTimes = Object.entries(playersTimesMap).flatMap(([, times]) =>
        times[targetSplitId] && times[startSplitId] ? times[targetSplitId] - times[startSplitId] : 0,
    );

    const splitMedian = calculateMedian(playersTimes);

    if (splitMedian === 0) return 0;

    const fromStartTime = playersTimesMap[bibNumber][startSplitId] + splitMedian;

    return fromStartTime;
};

export type SplitTimeRouter = typeof splitTimeRouter;
