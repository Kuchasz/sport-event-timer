import { publicProcedure, router } from "../trpc";
import { groupBy, sort, toLookup, toMap } from "@set/utils/dist/array";
import { z } from "zod";
import { calculateAge } from "@set/utils/dist/datetime";

export const resultRouter = router({
    results: publicProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;

            const allPlayers = await ctx.db.player.findMany({
                where: { raceId },
                include: { splitTime: true, manualSplitTime: true, absence: true, profile: true },
            });

            const disqualifications = await toMap(
                ctx.db.disqualification.findMany({
                    where: { raceId },
                }),
                d => d.bibNumber,
                d => d.id,
            );

            const timePenalties = await toLookup(
                ctx.db.timePenalty.findMany({ where: { raceId } }),
                p => p.bibNumber,
                p => ({ time: p.time, reason: p.reason }),
            );

            const unorderTimingPoints = await ctx.db.timingPoint.findMany({ where: { raceId } });
            const timingPointsOrder = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId } });
            const timingPoints = (JSON.parse(timingPointsOrder.order) as number[]).map(p => unorderTimingPoints.find(tp => tp.id === p));
            const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });

            const startTimingPoint = timingPoints.at(0);
            const endTimingPoint = timingPoints.at(-1);

            if (!startTimingPoint || !endTimingPoint) return [];

            const raceDateStart = race?.date.getTime();

            const playersWithTimes = allPlayers.map(p => ({
                id: p.id,
                bibNumber: p.bibNumber,
                name: p.profile.name,
                lastName: p.profile.lastName,
                classificationId: p.classificationId,
                team: p.profile.team,
                gender: p.profile.gender,
                age: calculateAge(p.profile.birthDate),
                yearOfBirth: p.profile.birthDate.getFullYear(),
                times: {
                    ...Object.fromEntries([[startTimingPoint?.id, { time: raceDateStart + p.startTime!, manual: false }]]),
                    ...Object.fromEntries(p.splitTime.map(st => [st.timingPointId, { time: Number(st.time), manual: false }])),
                    ...Object.fromEntries(p.manualSplitTime.map(st => [st.timingPointId, { time: Number(st.time), manual: true }])),
                },
                absences: {
                    ...Object.fromEntries(p.absence.map(a => [a.timingPointId, true])),
                },
                disqualification: disqualifications[p.bibNumber],
                timePenalties: timePenalties[p.bibNumber] ?? [],
                totalTimePenalty: (timePenalties[p.bibNumber] ?? []).reduce((sum, curr) => sum + curr.time, 0),
            }));

            const times = playersWithTimes.filter(p => !p.disqualification);

            const disqualifiedPlayers = playersWithTimes
                .filter(d => d.disqualification)
                .map(t => ({
                    ...t,
                    invalidState: "dsq",
                    start: undefined,
                    finish: undefined,
                    result: Number.MAX_VALUE,
                    ageCategory: undefined,
                    openCategory: undefined,
                }));

            const absentPlayers = times
                .filter(t => t.absences[startTimingPoint?.id] || t.absences[endTimingPoint?.id])
                .map(t => ({
                    ...t,
                    invalidState: t.absences[startTimingPoint.id] ? "dns" : t.absences[endTimingPoint.id] ? "dnf" : undefined,
                    start: undefined,
                    finish: undefined,
                    result: Number.MAX_VALUE,
                    ageCategory: undefined,
                    openCategory: undefined,
                }));

            const results = times
                .filter(t => t.times[startTimingPoint?.id] && t.times[endTimingPoint?.id])
                .map(t => ({
                    ...t,
                    start: t.times[startTimingPoint.id]?.time,
                    finish: t.times[endTimingPoint.id]?.time,
                    result: t.times[endTimingPoint.id]?.time - t.times[startTimingPoint.id]?.time,
                    invalidState: undefined,
                }));

            const classifications = await ctx.db.classification.findMany({ where: { raceId }, include: { categories: true } });

            const resultsWithCategories = results.map(r => ({
                ...r,
                ageCategory: classifications
                    .find(c => r.classificationId === c.id)!
                    .categories.filter(c => !!c.minAge && !!c.maxAge)
                    .find(c => c.minAge! <= r.age && c.maxAge! >= r.age && (!c.gender || c.gender === r.gender)),
                openCategory: classifications
                    .find(c => r.classificationId === c.id)!
                    .categories.filter(c => !c.minAge && !c.maxAge && !!c.gender)
                    .find(c => c.gender === r.gender),
            }));

            const playersByAgeCategories = Object.fromEntries(
                Object.entries(
                    groupBy(
                        resultsWithCategories.filter(r => !!r.ageCategory),
                        r => r.ageCategory!.id.toString(),
                    ),
                ).map(([catId, results]) => [catId, sort(results, r => r.result)]),
            );
            const playersByOpenCategories = Object.fromEntries(
                Object.entries(
                    groupBy(
                        resultsWithCategories.filter(r => !!r.openCategory),
                        r => r.openCategory!.id.toString(),
                    ),
                ).map(([catId, results]) => [catId, sort(results, r => r.result)]),
            );

            const sorted = sort([...resultsWithCategories, ...absentPlayers, ...disqualifiedPlayers], r => r.result).map(r => ({
                ...r,
                ageCategoryPlace: r.ageCategory ? playersByAgeCategories[r.ageCategory.id].indexOf(r) + 1 : undefined,
                openCategoryPlace: r.openCategory ? playersByOpenCategories[r.openCategory.id].indexOf(r) + 1 : undefined,
            }));

            const winningResult = sorted[0]?.result;

            return sorted.map(s => ({ ...s, gap: winningResult && s.result ? s.result - winningResult : undefined }));
        }),
});

export type ResultRouter = typeof resultRouter;
