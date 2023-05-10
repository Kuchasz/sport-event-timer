import { protectedProcedure, router } from "../trpc";
import { groupBy, sort } from "@set/utils/dist/array";
import { z } from "zod";
import { calculateAge } from "@set/utils/dist/datetime";

export const resultRouter = router({
    results: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;

            const allPlayers = await ctx.db.player.findMany({
                where: { raceId },
                include: { splitTime: true, manualSplitTime: true }
            });

            const unorderTimingPoints = await ctx.db.timingPoint.findMany({ where: { raceId } });
            const timingPointsOrder = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId } });
            const timingPoints = (JSON.parse(timingPointsOrder.order) as number[]).map(p => unorderTimingPoints.find(tp => tp.id === p));
            const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });

            const startTimingPoint = timingPoints.at(0);
            const endTimingPoint = timingPoints.at(-1);

            if (!startTimingPoint || !endTimingPoint) return [];

            const raceDateStart = race?.date.getTime();

            const times = allPlayers.map(p => ({
                bibNumber: p.bibNumber,
                name: p.name,
                lastName: p.lastName,
                classificationId: p.classificationId,
                team: p.team,
                gender: p.gender,
                age: calculateAge(p.birthDate),
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

            const classifications = await ctx.db.classification.findMany({ where: { raceId }, include: { categories: true } });

            // const classificationsWithPlayers = classifications.map(c => ({ ...c, players: allPlayers.filter(p => p.classificationId === c.id) }));

            const resultsWithCategories = results.map(r => ({
                ...r,
                ageCategory:
                    classifications
                        .find(c => r.classificationId === c.id)!
                        .categories
                        .filter(c => !!c.minAge && !!c.maxAge)
                        .find(c => c.minAge! <= r.age && c.maxAge! >= r.age),
                openCategory:
                    classifications
                        .find(c => r.classificationId === c.id)!
                        .categories
                        .filter(c => !c.minAge && !c.maxAge && !!c.gender)
                        .find(c => c.gender === r.gender),
            }));

            const playersByAgeCategories = Object.fromEntries(Object.entries(groupBy(resultsWithCategories.filter(r => !!r.ageCategory), r => r.ageCategory!.id!.toString())).map(([catId, results]) => [catId, sort(results, r => r.result)]));
            const playersByOpenCategories = Object.fromEntries(Object.entries(groupBy(resultsWithCategories.filter(r => !!r.openCategory), r => r.openCategory!.id!.toString())).map(([catId, results]) => [catId, sort(results, r => r.result)]));

            return sort(resultsWithCategories, r => r.result).map(r => ({
                ...r, 
                ageCategoryPlace: r.ageCategory ? playersByAgeCategories[r.ageCategory.id].indexOf(r) : undefined,
                openCategoryPlace: r.openCategory ? playersByOpenCategories[r.openCategory.id].indexOf(r) : undefined
            }));
        })
});

export type ResultRouter = typeof resultRouter;
