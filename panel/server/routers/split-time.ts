import { createRange, hasUndefinedBetweenValues, isNotAscendingOrder } from "@set/utils/dist/array";
import { z } from "zod";
import { manualSplitTimeSchema } from "../../modules/split-time/models";
import { protectedProcedure, router } from "../trpc";

const combine = (nestedEntries: [string, { time: number; manual: boolean }][]) => {
    const nestedObject = {} as any;

    nestedEntries.forEach(([key, value]) => {
        const keys = key.split(".");
        let currentObject = nestedObject;

        keys.forEach((nestedKey, index) => {
            if (index === keys.length - 1) {
                // Last key, set the value
                currentObject[nestedKey] = value;
            } else {
                // Create nested objects if not exist
                currentObject[nestedKey] = currentObject[nestedKey] || {};
                // Move to the next level
                currentObject = currentObject[nestedKey];
            }
        });
    });

    return nestedObject as Record<string, Record<number, Record<number, { time: number; manual: boolean }>>>;
};

export const splitTimeRouter = router({
    splitTimes: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;

            const allPlayers = await ctx.db.player.findMany({
                where: { raceId },
                include: { profile: true },
            });

            const splitTimes = await ctx.db.splitTime.findMany({ where: { raceId } });
            const manualSplitTimes = await ctx.db.manualSplitTime.findMany({ where: { raceId } });

            const unorderTimingPoints = await ctx.db.timingPoint.findMany({ where: { raceId } });
            const timingPointsOrder = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId } });
            const timingPoints = (JSON.parse(timingPointsOrder.order) as number[]).map(p => unorderTimingPoints.find(tp => tp.id === p)!);
            const startTimingPoint = timingPoints[0];

            const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });
            const raceDateStart = race?.date.getTime();

            const splitTimesMap = splitTimes.map(
                st => [`${st.bibNumber}.${st.timingPointId}.${st.lap}`, { time: Number(st.time), manual: false }] as const,
            );
            const manualSplitTimesMap = manualSplitTimes.map(
                st => [`${st.bibNumber}.${st.timingPointId}.${st.lap}`, { time: Number(st.time), manual: true }] as const,
            );
            const startTimesMap = allPlayers.map(
                p => [`${p.bibNumber}.${startTimingPoint.id}.0`, { time: raceDateStart + p.startTime!, manual: false }] as const,
            );

            const allTimesMap = combine([...startTimesMap, ...splitTimesMap, ...manualSplitTimesMap] as any);

            const timesInOrder = timingPoints.flatMap(tp =>
                createRange({ from: 0, to: tp.laps }).map(lap => ({ timingPointId: tp.id, lap })),
            );

            const times = allPlayers
                .map(p => ({
                    bibNumber: p.bibNumber,
                    name: p.profile.name,
                    lastName: p.profile.lastName,
                    times: allTimesMap[p.bibNumber],
                }))
                .map(t => ({
                    ...t,
                    hasError: isNotAscendingOrder(
                        timesInOrder
                            .filter(tio => t.times[tio.timingPointId]?.[tio.lap] !== undefined)
                            .map(tio => t.times[tio.timingPointId]?.[tio.lap]),
                        x => x.time,
                    ),
                    hasWarning: hasUndefinedBetweenValues(
                        timesInOrder.map(tio => t.times[tio.timingPointId]?.[tio.lap]),
                        x => x?.time,
                    ),
                }));

            return times;
        }),
    update: protectedProcedure.input(manualSplitTimeSchema).mutation(async ({ input, ctx }) => {
        const { id: _id, ...splitTime } = input;

        const existingManualSplitTime = await ctx.db.manualSplitTime.findFirst({
            where: {
                raceId: splitTime.raceId,
                bibNumber: splitTime.bibNumber,
                timingPointId: splitTime.timingPointId,
                lap: splitTime.lap,
            },
        });

        if (!existingManualSplitTime) {
            return await ctx.db.manualSplitTime.create({ data: splitTime });
        } else
            await ctx.db.manualSplitTime.update({
                where: {
                    timingPointId_lap_bibNumber: {
                        bibNumber: splitTime.bibNumber,
                        timingPointId: splitTime.timingPointId,
                        lap: splitTime.lap,
                    },
                },
                data: splitTime,
            });
    }),
    revert: protectedProcedure
        .input(z.object({ bibNumber: z.string(), timingPointId: z.number(), lap: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const { ...data } = input;
            return await ctx.db.manualSplitTime.delete({
                where: { timingPointId_lap_bibNumber: { bibNumber: data.bibNumber, timingPointId: data.timingPointId, lap: data.lap } },
            });
        }),
});

export type SplitTimeRouter = typeof splitTimeRouter;
