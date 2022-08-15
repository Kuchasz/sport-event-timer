import * as trpc from "@trpc/server";
import { add, remove, update } from "@set/timer/dist/slices/time-keepers";
import { db } from "../db";
import { dispatchAction } from "./action";
import { z } from "zod";

const timingPointSchema = z.object({
    id: z.number().min(1).nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
    order: z.number({ required_error: "order is required" })
});

export const timingPointRouter = trpc
    .router()
    .query("timingPoints", {
        input: z.object({
            raceId: z.number({ required_error: "raceId is required" })
        }),
        async resolve(req) {
            const raceId = req.input.raceId;
            return await db.timingPoint.findMany({ where: { raceId } });
        }
    })
    .mutation("update", {
        input: timingPointSchema,
        async resolve(req) {
            const { id, ...data } = req.input;

            dispatchAction(
                data.raceId,
                "",
                update({ id: id!, name: data.name, order: data.order })
            );

            return await db.timingPoint.update({ where: { id: id! }, data });
        }
    })
    .mutation("delete", {
        input: timingPointSchema,
        async resolve({ input }) {
            const { id } = input;

            dispatchAction(
                input.raceId,
                "",
                remove({ id: id! })
            );

            return await db.timingPoint.delete({ where: { id: id! } });
        }
    })
    .mutation("add", {
        input: timingPointSchema,
        async resolve(req) {
            const { input } = req;

            const newTimingPoint = await db.timingPoint.create({
                data: {
                    name: input.name,
                    order: input.order,
                    raceId: input.raceId
                }
            });

            dispatchAction(
                input.raceId,
                "",
                add({ id: newTimingPoint.id, name: newTimingPoint.name, order: newTimingPoint.order })
            );

            return newTimingPoint;
        }
    });

export type TimingPointRouter = typeof timingPointRouter;
