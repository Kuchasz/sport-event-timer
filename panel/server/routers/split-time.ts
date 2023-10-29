import { manualSplitTimeSchema } from "../../modules/split-time/models";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const splitTimeRouter = router({
    splitTimes: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;

            const allPlayers = await ctx.db.player.findMany({
                where: { raceId },
                include: { splitTime: true, manualSplitTime: true, profile: true },
            });
            const unorderTimingPoints = await ctx.db.timingPoint.findMany({ where: { raceId } });
            const timingPointsOrder = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId } });
            const timingPoints = (JSON.parse(timingPointsOrder.order) as number[]).map(p => unorderTimingPoints.find(tp => tp.id === p));
            const startTimingPoint = timingPoints[0];

            const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });

            const raceDateStart = race?.date.getTime();

            return allPlayers.map(p => ({
                bibNumber: p.bibNumber,
                name: p.profile.name,
                lastName: p.profile.lastName,
                times: {
                    ...Object.fromEntries([[startTimingPoint?.id, { time: raceDateStart + p.startTime!, manual: false }]]),
                    ...Object.fromEntries(p.splitTime.map(st => [st.timingPointId, { time: Number(st.time), manual: false }])),
                    ...Object.fromEntries(p.manualSplitTime.map(st => [st.timingPointId, { time: Number(st.time), manual: true }])),
                },
            }));
        }),
    update: protectedProcedure.input(manualSplitTimeSchema).mutation(async ({ input, ctx }) => {
        const { id: _id, ...splitTime } = input;

        const existingManualSplitTime = await ctx.db.manualSplitTime.findFirst({
            where: {
                raceId: splitTime.raceId,
                bibNumber: splitTime.bibNumber,
                timingPointId: splitTime.timingPointId,
            },
        });

        if (!existingManualSplitTime) {
            return await ctx.db.manualSplitTime.create({ data: splitTime });
        } else
            await ctx.db.manualSplitTime.update({
                where: {
                    timingPointId_bibNumber: {
                        bibNumber: splitTime.bibNumber,
                        timingPointId: splitTime.timingPointId,
                    },
                },
                data: splitTime,
            });
    }),
    revert: protectedProcedure.input(z.object({ bibNumber: z.string(), timingPointId: z.number() })).mutation(async ({ input, ctx }) => {
        const { ...data } = input;
        return await ctx.db.manualSplitTime.delete({
            where: { timingPointId_bibNumber: { bibNumber: data.bibNumber, timingPointId: data.timingPointId } },
        });
    }),
});

export type SplitTimeRouter = typeof splitTimeRouter;
