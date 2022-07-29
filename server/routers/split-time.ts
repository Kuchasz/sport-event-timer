import * as trpc from "@trpc/server";
import { db } from "../db";
import { readState } from "./action";
import { z } from "zod";

type ActualSplitTime = { id: number; bibNumber: number; time: number; timeKeeperId: number };
type ExistingSplitTime = { id: number; bibNumber: number; measuredTime: bigint; timingPointId: number };

const areSplitTimesEqual = (actual: ActualSplitTime, existing: ExistingSplitTime) =>
    actual.bibNumber === existing.bibNumber &&
    actual.time === Number(existing.measuredTime) &&
    actual.timeKeeperId === existing.timingPointId;

setInterval(async () => {
    const existingSplitTimes = await db.splitTime.findMany();
    const existingSplitTimesMap = new Map(existingSplitTimes.map(st => [st.id, st]));

    const actualSplitTimes = readState().timeStamps.filter(st => st.bibNumber);
    const actualSplitTimesMap = new Map(actualSplitTimes.map(st => [st.id, st]));

    const existing = new Set(existingSplitTimes.map(e => e.id));
    const actual = new Set(actualSplitTimes.map(a => a.id));

    const toCreate = new Set([...actual].filter(e => !existing.has(e)));
    const toUpdate = new Set([...existing].filter(x => actual.has(x)));
    const toDelete = new Set([...existing].filter(e => !actual.has(e)));

    toCreate.forEach(async id => {
        const data = actualSplitTimesMap.get(id);
        await db.splitTime.create({
            data: {
                id,
                bibNumber: data?.bibNumber!,
                measuredTime: data?.time!,
                raceId: 1,
                timingPointId: data?.timeKeeperId!
            }
        });
    });

    toDelete.forEach(async id => {
        await db.splitTime.delete({ where: { id } });
    });

    toUpdate.forEach(async id => {
        const existing = existingSplitTimesMap.get(id)! as ExistingSplitTime;
        const actual = actualSplitTimesMap.get(id) as ActualSplitTime;
        if (!areSplitTimesEqual(actual, existing)) {
            await db.splitTime.update({
                where: { id },
                data: {
                    measuredTime: actual.time,
                    bibNumber: actual.bibNumber
                }
            });
        }
    });
}, 5000);

export const splitTimeRouter = trpc.router().query("split-times", {
    input: z.object({
        raceId: z.number({ required_error: "raceId is required" })
    }),
    async resolve(req) {
        const raceId = req.input.raceId;
        const splitTimes = await db.splitTime.findMany({
            where: { raceId },
            include: { player: true, timingPoint: true }
        });
        return splitTimes.map(st => ({ ...st, measuredTime: Number(st.measuredTime) }));
    }
});

export type TimingPointRouter = typeof splitTimeRouter;
