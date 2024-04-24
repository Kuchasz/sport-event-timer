import { z } from "zod";
import { cacheMiddleware, protectedProcedure, publicProcedure, router } from "../trpc";
import { groupBy, hasUndefinedBetweenValues, isNotAscendingOrder, sort, toLookup, toMap } from "@set/utils/dist/array";
import { fromDeepEntries } from "@set/utils/dist/object";
import { calculateAge } from "@set/utils/dist/datetime";

type ResultEntry = [string, number];

export const resultRouter = router({
    results: publicProcedure
        .use(cacheMiddleware)
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
                classificationId: z.number({ required_error: "classificationId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { raceId, classificationId } = input;

            const allPlayers = await ctx.db.player.findMany({
                where: { raceId, classificationId },
                include: { absence: true, profile: true },
            });

            const splitTimes = await ctx.db.splitTime.findMany({ where: { raceId, player: { classificationId } } });
            const splitsOrderString = await ctx.db.splitOrder.findUniqueOrThrow({ where: { raceId, classificationId } });
            const splits = await ctx.db.split.findMany({ where: { raceId, classificationId } });
            const splitsOrder = JSON.parse(splitsOrderString.order) as number[];

            const manualSplitTimes = await ctx.db.manualSplitTime.findMany({ where: { raceId, player: { classificationId } } });

            const splitsInOrder = splitsOrder.map(split => splits.find(s => split === s.id)!);

            const disqualifications = toMap(
                await ctx.db.disqualification.findMany({
                    where: { raceId, player: { classificationId } },
                }),
                d => d.bibNumber,
                d => ({ id: d.id, reason: d.reason }),
            );

            const timePenalties = toLookup(
                await ctx.db.timePenalty.findMany({ where: { raceId, player: { classificationId } } }),
                p => p.bibNumber,
                p => ({ time: p.time, reason: p.reason, id: p.id }),
            );

            //todo: should handle new timing points here
            const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });

            const classification = await ctx.db.classification.findFirstOrThrow({
                where: { raceId, id: classificationId },
                include: { categories: true },
            });

            const raceDateStart = race?.date.getTime();

            const startSplit = splitsInOrder.at(0)!;
            const endSplit = splitsInOrder.at(-1)!;

            const splitTimesMap = splitTimes.map(st => [`${st.bibNumber}.${st.splitId}`, Number(st.time)] as ResultEntry);
            const manualSplitTimesMap = manualSplitTimes.map(st => [`${st.bibNumber}.${st.splitId}`, Number(st.time)] as ResultEntry);
            const startTimesMap = allPlayers.map(p => [`${p.bibNumber}.${startSplit.id}`, raceDateStart + p.startTime!] as ResultEntry);

            const allTimesMap = fromDeepEntries([...startTimesMap, ...splitTimesMap, ...manualSplitTimesMap]);

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
                times: allTimesMap[p.bibNumber],
                absences: Object.fromEntries(p.absence.map(a => [a.splitId, true])),
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
                .filter(t => t.absences[startSplit?.id] || t.absences[endSplit?.id])
                .map(t => ({
                    ...t,
                    invalidState: t.absences[startSplit.id] ? "dns" : t.absences[endSplit.id] ? "dnf" : undefined,
                    start: undefined,
                    finish: undefined,
                    result: Number.MAX_VALUE,
                    ageCategory: undefined,
                    openCategory: undefined,
                }));

            const classifiedPlayers = times
                .filter(t => t.times[startSplit?.id] && t.times[endSplit?.id])
                .map(t => ({
                    ...t,
                    start: t.times[startSplit.id],
                    finish: t.times[endSplit.id],
                    result: t.times[endSplit.id] - t.times[startSplit.id] + t.totalTimePenalty,
                    invalidState: undefined,
                    ageCategory: classification.categories
                        .filter(c => !!c.minAge && !!c.maxAge)
                        .find(c => c.minAge! <= t.age && c.maxAge! >= t.age && (!c.gender || c.gender === t.gender))!,
                    openCategory: classification.categories
                        .filter(c => !c.minAge && !c.maxAge && !!c.gender)
                        .find(c => c.gender === t.gender)!,
                }));

            const playersByAgeCategories = Object.fromEntries(
                Object.entries(
                    groupBy(
                        classifiedPlayers.filter(r => !!r.ageCategory),
                        r => r.ageCategory.id.toString(),
                    ),
                ).map(([catId, results]) => [catId, sort(results, r => r.result)]),
            );

            const playersByOpenCategories = Object.fromEntries(
                Object.entries(
                    groupBy(
                        classifiedPlayers.filter(r => !!r.openCategory),
                        r => r.openCategory.id.toString(),
                    ),
                ).map(([catId, results]) => [catId, sort(results, r => r.result)]),
            );

            const sorted = sort([...classifiedPlayers, ...absentPlayers, ...disqualifiedPlayers], r => r.result).map(r => ({
                ...r,
                ageCategoryPlace: r.ageCategory ? playersByAgeCategories[r.ageCategory.id].indexOf(r) + 1 : undefined,
                openCategoryPlace: r.openCategory ? playersByOpenCategories[r.openCategory.id].indexOf(r) + 1 : undefined,
            }));

            const winningResult = sorted[0]?.result;

            const result = sorted.map(s => ({ ...s, gap: winningResult && s.result ? s.result - winningResult : undefined }));

            return result;
        }),
    directorsResults: protectedProcedure
        .use(cacheMiddleware)
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
                classificationId: z.number({ required_error: "classificationId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { raceId, classificationId } = input;

            const allPlayers = await ctx.db.player.findMany({
                where: { raceId, classificationId },
                include: { absence: true, profile: true },
            });

            const splitTimes = await ctx.db.splitTime.findMany({ where: { raceId, player: { classificationId } } });
            const splitsOrderString = await ctx.db.splitOrder.findUniqueOrThrow({ where: { raceId, classificationId } });
            const splits = await ctx.db.split.findMany({ where: { raceId, classificationId } });
            const splitsOrder = JSON.parse(splitsOrderString.order) as number[];

            const manualSplitTimes = await ctx.db.manualSplitTime.findMany({ where: { raceId, player: { classificationId } } });

            const splitsInOrder = splitsOrder.map(split => splits.find(s => split === s.id)!);

            const disqualifications = toMap(
                await ctx.db.disqualification.findMany({
                    where: { raceId, player: { classificationId } },
                }),
                d => d.bibNumber,
                d => ({ id: d.id, reason: d.reason }),
            );

            const timePenalties = toLookup(
                await ctx.db.timePenalty.findMany({ where: { raceId, player: { classificationId } } }),
                p => p.bibNumber,
                p => ({ time: p.time, reason: p.reason, id: p.id }),
            );

            //todo: should handle new timing points here
            const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });

            const classification = await ctx.db.classification.findFirstOrThrow({
                where: { raceId, id: classificationId },
                include: { categories: true },
            });

            const raceDateStart = race?.date.getTime();

            const startSplit = splitsInOrder.at(0)!;
            const endSplit = splitsInOrder.at(-1)!;

            const splitTimesMap = splitTimes.map(st => [`${st.bibNumber}.${st.splitId}`, Number(st.time)] as ResultEntry);
            const manualSplitTimesMap = manualSplitTimes.map(st => [`${st.bibNumber}.${st.splitId}`, Number(st.time)] as ResultEntry);
            const startTimesMap = allPlayers.map(p => [`${p.bibNumber}.${startSplit.id}`, raceDateStart + p.startTime!] as ResultEntry);

            const allTimesMap = fromDeepEntries([...startTimesMap, ...splitTimesMap, ...manualSplitTimesMap]);

            const playersWithTimes = allPlayers
                .map(p => ({
                    id: p.id,
                    bibNumber: p.bibNumber,
                    name: p.profile.name,
                    lastName: p.profile.lastName,
                    classificationId: p.classificationId,
                    team: p.profile.team,
                    gender: p.profile.gender,
                    age: calculateAge(p.profile.birthDate),
                    yearOfBirth: p.profile.birthDate.getFullYear(),
                    times: allTimesMap[p.bibNumber],
                    absences: Object.fromEntries(p.absence.map(a => [a.splitId, true])),
                    disqualification: disqualifications[p.bibNumber],
                    timePenalties: timePenalties[p.bibNumber] ?? [],
                    totalTimePenalty: (timePenalties[p.bibNumber] ?? []).reduce((sum, curr) => sum + curr.time, 0),
                }))
                .map(p => ({
                    ...p,
                    hasError: isNotAscendingOrder(
                        splitsInOrder.filter(tio => p.times[tio.id] !== undefined).map(tio => p.times[tio.id]),
                        x => x,
                    ),
                    hasWarning: hasUndefinedBetweenValues(
                        splitsInOrder.map(tio => p.times[tio.id]),
                        x => x,
                    ),
                }));

            const disqualifiedPlayers = playersWithTimes
                .filter(t => t.disqualification)
                .map(t => ({
                    ...t,
                    invalidState: "dsq",
                    result: Number.MAX_VALUE,
                    ageCategory: undefined,
                    openCategory: undefined,
                }));

            const absentPlayers = playersWithTimes
                .filter(t => !t.disqualification && (t.absences[startSplit?.id] || t.absences[endSplit?.id]))
                .map(t => ({
                    ...t,
                    invalidState: t.absences[startSplit.id] ? "dns" : t.absences[endSplit.id] ? "dnf" : undefined,
                    result: Number.MAX_VALUE,
                    ageCategory: undefined,
                    openCategory: undefined,
                }));

            const classifiedPlayers = playersWithTimes
                .filter(t => !t.disqualification && t.times[startSplit?.id] && t.times[endSplit?.id])
                .map(t => ({
                    ...t,
                    result: t.times[endSplit.id] - t.times[startSplit.id] + t.totalTimePenalty,
                    invalidState: undefined,
                    ageCategory: classification.categories
                        .filter(c => !!c.minAge && !!c.maxAge)
                        .find(c => c.minAge! <= t.age && c.maxAge! >= t.age && (!c.gender || c.gender === t.gender))!,
                    openCategory: classification.categories
                        .filter(c => !c.minAge && !c.maxAge && !!c.gender)
                        .find(c => c.gender === t.gender)!,
                }));

            const playersByAgeCategories = Object.fromEntries(
                Object.entries(
                    groupBy(
                        classifiedPlayers.filter(r => !!r.ageCategory),
                        r => r.ageCategory.id.toString(),
                    ),
                ).map(([catId, results]) => [catId, sort(results, r => r.result)]),
            );

            const playersByOpenCategories = Object.fromEntries(
                Object.entries(
                    groupBy(
                        classifiedPlayers.filter(r => !!r.openCategory),
                        r => r.openCategory.id.toString(),
                    ),
                ).map(([catId, results]) => [catId, sort(results, r => r.result)]),
            );

            const sorted = sort([...classifiedPlayers, ...absentPlayers, ...disqualifiedPlayers], r => r.result).map(r => ({
                ...r,
                ageCategoryPlace: r.ageCategory ? playersByAgeCategories[r.ageCategory.id].indexOf(r) + 1 : undefined,
                openCategoryPlace: r.openCategory ? playersByOpenCategories[r.openCategory.id].indexOf(r) + 1 : undefined,
            }));

            const winningResult = sorted[0]?.result;

            const result = sorted.map(s => ({ ...s, gap: winningResult && s.result ? s.result - winningResult : undefined }));

            return result;
        }),
});

export type ResultRouter = typeof resultRouter;
