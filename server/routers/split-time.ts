import * as trpc from "@trpc/server";
import { db } from "../db";
import { readState } from "./action";
import { z } from "zod";

const manualSplitTimeSchema = z.object({
    id: z.number().min(1).nullish(),
    bibNumber: z.number({ required_error: "bibNumber is required" }),
    time: z.number().optional(),
    raceId: z.number({ required_error: "raceId is required" }),
    timingPointId: z.number({ required_error: "timingPointId is required" })
});

type ActualSplitTime = { id: number; bibNumber: number; time: number; timeKeeperId: number };
type ExistingSplitTime = { id: number; bibNumber: number; time: bigint; timingPointId: number };

const areSplitTimesEqual = (actual: ActualSplitTime, existing: ExistingSplitTime) =>
    actual.bibNumber === existing.bibNumber &&
    actual.time === Number(existing.time) &&
    actual.timeKeeperId === existing.timingPointId;

const updateSplitTimes = async () => {
    const existingSplitTimes = await db.splitTime.findMany();
    const existingSplitTimesMap = new Map(existingSplitTimes.map(st => [st.id, st]));

    const actualSplitTimes = readState().timeStamps.filter(st => st.bibNumber);
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
                raceId: 1,
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

setInterval(updateSplitTimes, 5000);

export const splitTimeRouter = trpc
    .router()
    .query("split-times", {
        input: z.object({
            raceId: z.number({ required_error: "raceId is required" })
        }),
        async resolve(req) {
            const raceId = req.input.raceId;

            const allPlayers = await db.player.findMany({
                where: { raceId },
                include: { splitTime: true, manualSplitTime: true }
            });

            const startTimingPoint = await db.timingPoint.findFirst({ where: { raceId }, orderBy: { order: "asc" } });
            const race = await db.race.findFirstOrThrow({ where: { id: raceId }, select: { date: true } });

            const raceDateStart = race?.date.getTime();

            return allPlayers.map(p => ({
                bibNumber: p.bibNumber,
                name: p.name,
                lastName: p.lastName,
                times: {
                    ...Object.fromEntries([
                        [startTimingPoint?.id, { time: raceDateStart + p.startTime!, manual: false }]
                    ]),
                    ...Object.fromEntries(
                        p.splitTime.map(st => [st.timingPointId, { time: Number(st.time), manual: false }])
                    ),
                    ...Object.fromEntries(
                        p.manualSplitTime.map(st => [st.timingPointId, { time: Number(st.time), manual: true }])
                    )
                }
            }));
        }
    })
    .mutation("update", {
        input: manualSplitTimeSchema,
        async resolve(req) {
            const { id, ...splitTime } = req.input;

            const existingManualSplitTime = await db.manualSplitTime.findFirst({
                where: {
                    raceId: splitTime.raceId,
                    bibNumber: splitTime.bibNumber,
                    timingPointId: splitTime.timingPointId
                }
            });

            if (!existingManualSplitTime) {
                return await db.manualSplitTime.create({ data: splitTime });
            } else
                await db.manualSplitTime.update({
                    where: {
                        timingPointId_bibNumber: {
                            bibNumber: splitTime.bibNumber,
                            timingPointId: splitTime.timingPointId
                        }
                    },
                    data: splitTime
                });
        }
    })
    .mutation("revert", {
        input: z.object({
            bibNumber: z.number(),
            timingPointId: z.number()
        }),
        async resolve(req) {
            const { ...data } = req.input;
            return await db.manualSplitTime.delete({
                where: { timingPointId_bibNumber: { bibNumber: data.bibNumber, timingPointId: data.timingPointId } }
            });
        }
    });

export type SplitTimeRouter = typeof splitTimeRouter;
