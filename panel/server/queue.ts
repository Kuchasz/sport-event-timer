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
    const existingAbsences = await db.absence.findMany({ where: { raceId } });

    const actualBibNumbers = new Set(existingPlayers.map(p => p.bibNumber!));
    const stopwatchState = await stopwatchStateProvider.get(raceId);

    const actualSplitTimes = stopwatchState.timeStamps!.filter(st => st.bibNumber && actualBibNumbers.has(st.bibNumber.toString()));
    const actualSplitTimesMap = new Map(actualSplitTimes.map(st => [st.id, st]));
    const actualAbsences = stopwatchState.absences!.filter(a => a.bibNumber && actualBibNumbers.has(a.bibNumber.toString()));
    const actualAbsencesMap = new Map(actualAbsences.map(a => [a.id, a]));

    const splitTimes_existing = new Set(existingSplitTimes.map(e => e.id));
    const splitTimes_actual = new Set(actualSplitTimes.map(a => a.id));
    const absences_existing = new Set(existingAbsences.map(e => e.id));
    const absences_actual = new Set(actualAbsences.map(a => a.id));

    const splitTimes_toCreate = new Set([...splitTimes_actual].filter(e => !splitTimes_existing.has(e)));
    const splitTimes_toUpdate = new Set([...splitTimes_existing].filter(x => splitTimes_actual.has(x)));
    const splitTimes_toDelete = new Set([...splitTimes_existing].filter(e => !splitTimes_actual.has(e)));
    const absences_toCreate = new Set([...absences_actual].filter(e => !absences_existing.has(e)));
    const absences_toDelete = new Set([...absences_existing].filter(e => !absences_actual.has(e)));

    const newSplitTimes = [...splitTimes_toCreate]
        .map(id => ({ id, data: actualSplitTimesMap.get(id) }))
        .map(({ id, data }) => ({
            id,
            bibNumber: data!.bibNumber!.toString(),
            time: data!.time,
            raceId,
            timingPointId: data?.timingPointId!,
        }));
    const newAbsences = [...absences_toCreate]
        .map(id => ({ id, data: actualAbsencesMap.get(id) }))
        .map(({ id, data }) => ({
            id,
            bibNumber: data!.bibNumber!.toString(),
            raceId,
            timingPointId: data?.timingPointId!,
        }));

    const splitTimesToUpdate = [...splitTimes_toUpdate]
        .map(id => ({
            existing: existingSplitTimesMap.get(id)! as ExistingSplitTime,
            actual: actualSplitTimesMap.get(id) as ActualSplitTime,
        }))
        .filter(({ actual, existing }) => !areSplitTimesEqual(actual, existing));

    await db.$transaction([...splitTimes_toDelete].map(id => db.splitTime.delete({ where: { id_raceId: { id, raceId } } })));
    await db.$transaction([...absences_toDelete].map(id => db.absence.delete({ where: { id_raceId: { id, raceId } } })));

    await db.$transaction(newSplitTimes.map(data => db.splitTime.create({ data })));
    await db.$transaction(newAbsences.map(data => db.absence.create({ data })));

    await db.$transaction(splitTimesToUpdate.map(data => db.splitTime.update({ where: { id_raceId: { id: data.actual.id, raceId } }, data: { ...data.actual, bibNumber: data.actual.bibNumber.toString() } })));
};

export const updateSplitTimesQueue: fastq.queueAsPromised<UpdateSplitTimesTask> = fastq.promise(updateSplitTimes, 1);
