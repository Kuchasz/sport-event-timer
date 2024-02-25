import { getStaticData } from "../../../src/app/[locale]/(results)/results/[raceId]/[classificationId]/api_static";
import { z } from "zod";
import { cacheMiddleware, publicProcedure, router } from "../trpc";

// type ResultEntry = [string, number];

export const resultRouter = router({
    results: publicProcedure
        .use(cacheMiddleware)
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
                classificationId: z.number({ required_error: "classificationId is required" }),
            }),
        )
        .query(({}) => {
            return getStaticData();
            // const { raceId, classificationId } = input;

            // const allPlayers = await ctx.db.player.findMany({
            //     where: { raceId, classificationId },
            //     include: { absence: true, profile: true },
            // });

            // const splitTimes = await ctx.db.splitTime.findMany({ where: { raceId, player: { classificationId } } });
            // const manualSplitTimes = await ctx.db.manualSplitTime.findMany({ where: { raceId, player: { classificationId } } });

            // const disqualifications = await toMap(
            //     ctx.db.disqualification.findMany({
            //         where: { raceId, player: { classificationId } },
            //     }),
            //     d => d.bibNumber,
            //     d => ({ id: d.id, reason: d.reason }),
            // );

            // const timePenalties = toLookup(
            //     await ctx.db.timePenalty.findMany({ where: { raceId, player: { classificationId } } }),
            //     p => p.bibNumber,
            //     p => ({ time: p.time, reason: p.reason, id: p.id }),
            // );

            // const unorderTimingPoints = await ctx.db.timingPoint.findMany({ where: { raceId } });
            // const timingPointsOrder = await ctx.db.timingPointOrder.findUniqueOrThrow({ where: { raceId } });
            // const timingPoints = (JSON.parse(timingPointsOrder.order) as number[]).map(p => unorderTimingPoints.find(tp => tp.id === p)!);
            // const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });

            // const classification = await ctx.db.classification.findFirstOrThrow({
            //     where: { raceId, id: classificationId },
            //     include: { categories: true },
            // });

            // const raceDateStart = race?.date.getTime();

            // const startTimingPoint = timingPoints.at(0)!;
            // const endTimingPoint = timingPoints.at(-1)!;

            // const splitTimesMap = splitTimes.map(st => [`${st.bibNumber}.${st.timingPointId}.${st.lap}`, Number(st.time)] as ResultEntry);
            // const manualSplitTimesMap = manualSplitTimes.map(
            //     st => [`${st.bibNumber}.${st.timingPointId}.${st.lap}`, Number(st.time)] as ResultEntry,
            // );
            // const startTimesMap = allPlayers.map(
            //     p => [`${p.bibNumber}.${startTimingPoint.id}.0`, raceDateStart + p.startTime!] as ResultEntry,
            // );

            // const allTimesMap = fromDeepEntries([...startTimesMap, ...splitTimesMap, ...manualSplitTimesMap]);

            // const playersWithTimes = allPlayers.map(p => ({
            //     id: p.id,
            //     bibNumber: p.bibNumber,
            //     name: p.profile.name,
            //     lastName: p.profile.lastName,
            //     classificationId: p.classificationId,
            //     team: p.profile.team,
            //     gender: p.profile.gender,
            //     age: calculateAge(p.profile.birthDate),
            //     yearOfBirth: p.profile.birthDate.getFullYear(),
            //     times: allTimesMap[p.bibNumber],
            //     absences: Object.fromEntries(p.absence.map(a => [a.timingPointId, true])),
            //     disqualification: disqualifications[p.bibNumber],
            //     timePenalties: timePenalties[p.bibNumber] ?? [],
            //     totalTimePenalty: (timePenalties[p.bibNumber] ?? []).reduce((sum, curr) => sum + curr.time, 0),
            // }));

            // const times = playersWithTimes.filter(p => !p.disqualification);

            // const disqualifiedPlayers = playersWithTimes
            //     .filter(d => d.disqualification)
            //     .map(t => ({
            //         ...t,
            //         invalidState: "dsq",
            //         start: undefined,
            //         finish: undefined,
            //         result: Number.MAX_VALUE,
            //         ageCategory: undefined,
            //         openCategory: undefined,
            //     }));

            // const absentPlayers = times
            //     .filter(t => t.absences[startTimingPoint?.id] || t.absences[endTimingPoint?.id])
            //     .map(t => ({
            //         ...t,
            //         invalidState: t.absences[startTimingPoint.id] ? "dns" : t.absences[endTimingPoint.id] ? "dnf" : undefined,
            //         start: undefined,
            //         finish: undefined,
            //         result: Number.MAX_VALUE,
            //         ageCategory: undefined,
            //         openCategory: undefined,
            //     }));

            // const results = times
            //     .filter(t => t.times[startTimingPoint?.id]?.[0] && t.times[endTimingPoint?.id]?.[0])
            //     .map(t => ({
            //         ...t,
            //         start: t.times[startTimingPoint.id][0],
            //         finish: t.times[endTimingPoint.id][0],
            //         result: t.times[endTimingPoint.id][0] - t.times[startTimingPoint.id][0] + t.totalTimePenalty,
            //         invalidState: undefined,
            //     }));

            // const resultsWithCategories = results.map(r => ({
            //     ...r,
            //     ageCategory: classification.categories
            //         .filter(c => !!c.minAge && !!c.maxAge)
            //         .find(c => c.minAge! <= r.age && c.maxAge! >= r.age && (!c.gender || c.gender === r.gender))!,
            //     openCategory: classification.categories.filter(c => !c.minAge && !c.maxAge && !!c.gender).find(c => c.gender === r.gender)!,
            // }));

            // const playersByAgeCategories = Object.fromEntries(
            //     Object.entries(
            //         groupBy(
            //             resultsWithCategories.filter(r => !!r.ageCategory),
            //             r => r.ageCategory.id.toString(),
            //         ),
            //     ).map(([catId, results]) => [catId, sort(results, r => r.result)]),
            // );
            // const playersByOpenCategories = Object.fromEntries(
            //     Object.entries(
            //         groupBy(
            //             resultsWithCategories.filter(r => !!r.openCategory),
            //             r => r.openCategory.id.toString(),
            //         ),
            //     ).map(([catId, results]) => [catId, sort(results, r => r.result)]),
            // );

            // const sorted = sort([...resultsWithCategories, ...absentPlayers, ...disqualifiedPlayers], r => r.result).map(r => ({
            //     ...r,
            //     ageCategoryPlace: r.ageCategory ? playersByAgeCategories[r.ageCategory.id].indexOf(r) + 1 : undefined,
            //     openCategoryPlace: r.openCategory ? playersByOpenCategories[r.openCategory.id].indexOf(r) + 1 : undefined,
            // }));

            // const winningResult = sorted[0]?.result;

            // const result = sorted.map(s => ({ ...s, gap: winningResult && s.result ? s.result - winningResult : undefined }));

            // return result;
        }),
});

export type ResultRouter = typeof resultRouter;
