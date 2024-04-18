import { hasUndefinedBetweenValues, isNotAscendingOrder } from "@set/utils/dist/array";
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
                classificationId: z.number({ required_error: "classificationId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { raceId, classificationId } = input;

            const classificationPlayers = await ctx.db.player.findMany({
                where: { raceId, classificationId },
                include: { profile: true },
            });

            const splitTimes = await ctx.db.splitTime.findMany({ where: { raceId } });
            const manualSplitTimes = await ctx.db.manualSplitTime.findMany({ where: { raceId } });

            const unorderedSplits = await ctx.db.split.findMany({ where: { raceId, classificationId } });

            const splitOrder = await ctx.db.splitOrder.findUniqueOrThrow({ where: { raceId, classificationId } });
            const splits = (JSON.parse(splitOrder.order) as number[]).map(p => unorderedSplits.find(s => s.id === p)!);
            const startSplit = splits[0];

            const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });
            const raceDateStart = race?.date.getTime();

            const splitTimesMap = splitTimes.map(
                st => [`${st.bibNumber}.${st.splitId}`, { time: Number(st.time), manual: false }] as ResultEntry,
            );
            const manualSplitTimesMap = manualSplitTimes.map(
                st => [`${st.bibNumber}.${st.splitId}`, { time: Number(st.time), manual: true }] as ResultEntry,
            );
            const startTimesMap = classificationPlayers.map(
                p => [`${p.bibNumber}.${startSplit.id}`, { time: raceDateStart + p.startTime!, manual: false }] as ResultEntry,
            );

            const allTimesMap = fromDeepEntries([...startTimesMap, ...splitTimesMap, ...manualSplitTimesMap]);

            const timesInOrder = splits;

            const times = classificationPlayers
                .map(p => ({
                    bibNumber: p.bibNumber,
                    name: p.profile.name,
                    lastName: p.profile.lastName,
                    times: allTimesMap[p.bibNumber],
                }))
                .map(t => ({
                    ...t,
                    hasError: isNotAscendingOrder(
                        timesInOrder.filter(tio => t.times[tio.id] !== undefined).map(tio => t.times[tio.id]),
                        x => x.time,
                    ),
                    hasWarning: hasUndefinedBetweenValues(
                        timesInOrder.map(tio => t.times[tio.id]),
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
    revert: protectedProcedure
        .input(z.object({ bibNumber: z.string(), timingPointId: z.number(), lap: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const { ...data } = input;
            return await ctx.db.manualSplitTime.delete({
                where: { splitId_bibNumber: { bibNumber: data.bibNumber, splitId: data.timingPointId } },
            });
        }),
});

export type SplitTimeRouter = typeof splitTimeRouter;
