import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const bibNumberSchema = z.object({
    id: z.number().nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    number: z.number({ required_error: "number is required" })
});

export const bibNumberRouter =
    router({
        numbers: protectedProcedure.input(z.object({
            raceId: z.number({ required_error: "raceId is required" })
        })).query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const bibNumbers = await ctx.db.bibNumber.findMany({ where: { raceId } });

            return bibNumbers.map((c, index) => ({ ...c, index: index + 1 }));
        }),
        delete: protectedProcedure
            .input(z.object({ bibNumberId: z.number() }))
            .mutation(async ({ input, ctx }) => {
                return await ctx.db.bibNumber.delete({ where: { id: input.bibNumberId } });
            }),
        update: protectedProcedure.input(bibNumberSchema).mutation(async ({ input, ctx }) => {
            const { id, ...data } = input;

            return await ctx.db.bibNumber.update({
                where: { id: id! },
                data
            });
        }),
        add: protectedProcedure.input(bibNumberSchema).mutation(async ({ input, ctx }) => {
            const { id, ...data } = input;
            return await ctx.db.bibNumber.create({
                data
            });
        })
    });

export type BibNumnerRouter = typeof bibNumberRouter;
