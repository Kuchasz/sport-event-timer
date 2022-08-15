import { db, stopwatchStateProvider } from "./db";
import * as fastq from "fastq";

type ActualSplitTime = { id: number; bibNumber: number; time: number; timeKeeperId: number };
type ExistingSplitTime = { id: number; bibNumber: number; time: bigint; timingPointId: number };

const areSplitTimesEqual = (actual: ActualSplitTime, existing: ExistingSplitTime) =>
    actual.bibNumber === existing.bibNumber &&
    actual.time === Number(existing.time) &&
    actual.timeKeeperId === existing.timingPointId;

type UpdateSplitTimesTask = {
    raceId: number
}

const updateSplitTimes = async ({ raceId }: UpdateSplitTimesTask) => {
    const existingSplitTimes = await db.splitTime.findMany({ where: { raceId } });
    const existingSplitTimesMap = new Map(existingSplitTimes.map(st => [st.id, st]));

    const stopwatchState = await stopwatchStateProvider.get(raceId);

    const actualSplitTimes = stopwatchState.timeStamps!.filter(st => st.bibNumber);
    const actualSplitTimesMap = new Map(actualSplitTimes.map(st => [st.id, st]));

    const existing = new Set(existingSplitTimes.map(e => e.id));
    const actual = new Set(actualSplitTimes.map(a => a.id));

    const toCreate = new Set([...actual].filter(e => !existing.has(e)));
    const toUpdate = new Set([...existing].filter(x => actual.has(x)));
    const toDelete = new Set([...existing].filter(e => !actual.has(e)));

    for (const id of toCreate) {
        const data = actualSplitTimesMap.get(id);
        await db.splitTime.create({
            data: {
                id,
                bibNumber: data?.bibNumber!,
                time: data?.time!,
                raceId,
                timingPointId: data?.timeKeeperId!
            }
        });
    }

    for (const id of toUpdate) {
        const existing = existingSplitTimesMap.get(id)! as ExistingSplitTime;
        const actual = actualSplitTimesMap.get(id) as ActualSplitTime;
        if (!areSplitTimesEqual(actual, existing)) {
            await db.splitTime.update({
                where: { id },
                data: {
                    time: actual.time,
                    bibNumber: actual.bibNumber
                }
            });
        }
    }

    for (const id of toDelete) {
        await db.splitTime.delete({ where: { id } });
    }
};

export const updateSplitTimesQueue: fastq.queueAsPromised<UpdateSplitTimesTask> = fastq.promise(updateSplitTimes, 1)