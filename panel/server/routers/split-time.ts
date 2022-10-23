import { protectedProcedure, router } from "../trpc";
import { db } from "../db";
import { z } from "zod";

const manualSplitTimeSchema = z.object({
    id: z.number().min(1).nullish(),
    bibNumber: z.number({ required_error: "bibNumber is required" }),
    time: z.number().optional(),
    raceId: z.number({ required_error: "raceId is required" }),
    timingPointId: z.number({ required_error: "timingPointId is required" })
});

export const splitTimeRouter =
    router({
        splitTimes: protectedProcedure
            .input(z.object({raceId: z.number({ required_error: "raceId is required" })}))
            .query(async (req) => {
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
        }),
        update: protectedProcedure
            .input(manualSplitTimeSchema)
            .mutation(async (req) => {
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
        }),
        revert: protectedProcedure
            .input(z.object({ bibNumber: z.number(), timingPointId: z.number() }))
            .mutation(async (req) => {
                const { ...data } = req.input;
                return await db.manualSplitTime.delete({
                    where: { timingPointId_bibNumber: { bibNumber: data.bibNumber, timingPointId: data.timingPointId } }
                });
            })
    });

export type SplitTimeRouter = typeof splitTimeRouter;
