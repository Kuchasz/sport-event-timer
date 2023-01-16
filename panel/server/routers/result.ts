import { protectedProcedure, router } from "../trpc";
import { db } from "../db";
import { sort } from "@set/utils/dist/array";
import { z } from "zod";

export const resultRouter = router({
    results: protectedProcedure
        .input(z.object({raceId: z.number({ required_error: "raceId is required" })}))
        .query(async (req) => {
            const raceId = req.input.raceId;

            const allPlayers = await db.player.findMany({
                where: { raceId },
                include: { splitTime: true, manualSplitTime: true }
            });

            const unorderTimingPoints = await db.timingPoint.findMany({ where: { raceId } });
            const timingPointsOrder = await db.timingPointOrder.findUniqueOrThrow({where: {raceId}});
            const timingPoints = (JSON.parse(timingPointsOrder.order) as number[]).map(p => unorderTimingPoints.find(tp => tp.id === p));
            const race = await db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });

            const startTimingPoint = timingPoints.at(0);
            const endTimingPoint = timingPoints.at(-1);

            if (!startTimingPoint || !endTimingPoint) return [];

            const raceDateStart = race?.date.getTime();

            const times = allPlayers.map(p => ({
                bibNumber: p.bibNumber,
                name: p.name,
                lastName: p.lastName,
                team: p.team,
                gender: p.gender,
                times: {
                    ...Object.fromEntries([[startTimingPoint?.id, { time: raceDateStart + p.startTime!, manual: false }]]),
                    ...Object.fromEntries(
                        p.splitTime.map(st => [st.timingPointId, { time: Number(st.time), manual: false }])
                    ),
                    ...Object.fromEntries(
                        p.manualSplitTime.map(st => [st.timingPointId, { time: Number(st.time), manual: true }])
                    )
                }
            }));

            const results = times
                .filter(t => t.times[startTimingPoint?.id] && t.times[endTimingPoint?.id])
                .map(t => ({
                    ...t,
                    start: t.times[startTimingPoint.id].time,
                    finish: t.times[endTimingPoint.id].time,
                    result: t.times[endTimingPoint.id].time - t.times[startTimingPoint.id].time
                }));

            return sort(results, r => r.result);
    })
});

export type ResultRouter = typeof resultRouter;
