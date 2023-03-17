import { db, stopwatchStateProvider } from "./db";
import * as fastq from "fastq";

type ActualSplitTime = { id: number; bibNumber: number; time: number; timingPointId: number };
type ExistingSplitTime = { id: number; bibNumber: string; time: bigint; timingPointId: number };

const areSplitTimesEqual = (actual: ActualSplitTime, existing: ExistingSplitTime) =>
    actual.bibNumber.toString() === existing.bibNumber && actual.time === Number(existing.time) && actual.timingPointId === existing.timingPointId;

type UpdateSplitTimesTask = {
    raceId: number;
};

const updateSplitTimes = async ({ raceId }: UpdateSplitTimesTask) => {
    const existingPlayers = await db.player.findMany({ where: { raceId, NOT: { bibNumber: null } }, select: { bibNumber: true } });

    const existingSplitTimes = await db.splitTime.findMany({ where: { raceId } });
    const existingSplitTimesMap = new Map(existingSplitTimes.map(st => [st.id, st]));

    const actualBibNumbers = new Set(existingPlayers.map(p => p.bibNumber!));
    const stopwatchState = await stopwatchStateProvider.get(raceId);

    const actualSplitTimes = stopwatchState.timeStamps!.filter(st => st.bibNumber && actualBibNumbers.has(st.bibNumber.toString()));
    const actualSplitTimesMap = new Map(actualSplitTimes.map(st => [st.id, st]));

    const existing = new Set(existingSplitTimes.map(e => e.id));
    const actual = new Set(actualSplitTimes.map(a => a.id));

    const toCreate = new Set([...actual].filter(e => !existing.has(e)));
    const toUpdate = new Set([...existing].filter(x => actual.has(x)));
    const toDelete = new Set([...existing].filter(e => !actual.has(e)));

    const newSplitTimes = [...toCreate]
        .map(id => ({ id, data: actualSplitTimesMap.get(id) }))
        .map(({ id, data }) => ({
            id,
            bibNumber: data!.bibNumber!.toString(),
            time: data!.time,
            raceId,
            timingPointId: data?.timingPointId!,
        }));

    await db.$transaction(newSplitTimes.map(data => db.splitTime.create({ data })));

    const splitTimesToUpdate = [...toUpdate]
        .map(id => ({
            existing: existingSplitTimesMap.get(id)! as ExistingSplitTime,
            actual: actualSplitTimesMap.get(id) as ActualSplitTime,
        }))
        .filter(({ actual, existing }) => !areSplitTimesEqual(actual, existing));

    await db.$transaction(splitTimesToUpdate.map(data => db.splitTime.update({ where: { id: data.actual.id }, data: { ...data.actual, bibNumber: data.actual.bibNumber.toString() } })));

    await db.$transaction([...toDelete].map(id => db.splitTime.delete({ where: { id } })));
};

export const updateSplitTimesQueue: fastq.queueAsPromised<UpdateSplitTimesTask> = fastq.promise(updateSplitTimes, 1);
