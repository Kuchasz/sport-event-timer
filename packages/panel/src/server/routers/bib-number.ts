import { createRange, excludeItems } from "@set/utils/dist/array";
import { addRangeBibNumberSchema, bibNumberSchema } from "../../modules/bib-number/models";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const bibNumberRouter = router({
    numbers: protectedProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const bibNumbers = await ctx.db.bibNumber.findMany({ where: { raceId }, orderBy: { number: "asc" } });

            return bibNumbers.map((c, index) => ({ ...c, index: index + 1 }));
        }),
    playersNumbers: protectedProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const playersBibNumbers = await ctx.db.player.findMany({
                where: { raceId },
                select: { bibNumber: true },
            });

            return playersBibNumbers.map(b => b.bibNumber);
        }),
    nonDisqualifiedPlayerNumbers: protectedProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
                bibNumber: z.string().optional(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { raceId, bibNumber } = input;
            const playersBibNumbers = await ctx.db.player.findMany({
                where: { AND: [{ raceId }, { NOT: { bibNumber } }] },
                select: { bibNumber: true },
            });

            const disqualifiedBibNumbers = await ctx.db.disqualification.findMany({
                where: { AND: [{ raceId }, { NOT: { bibNumber } }] },
                select: { bibNumber: true },
            });

            return [
                ...(bibNumber ? [bibNumber] : []),
                ...excludeItems(
                    playersBibNumbers.map(p => p.bibNumber),
                    disqualifiedBibNumbers.map(d => d.bibNumber),
                ),
            ];
        }),
    availableNumbers: protectedProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const bibNumbers = await ctx.db.bibNumber.findMany({ where: { raceId }, select: { number: true }, orderBy: { number: "asc" } });
            const playersBibNumbers = await ctx.db.player.findMany({
                where: { raceId },
                select: { bibNumber: true },
            });

            const allBibNumbers = bibNumbers.map(x => x.number);
            const allPlayersBibNumbers = new Set(playersBibNumbers.map(x => x.bibNumber));

            return allBibNumbers.filter(n => !allPlayersBibNumbers.has(n)).map(x => x.toString());
        }),
    delete: protectedProcedure.input(z.object({ bibNumberId: z.number() })).mutation(async ({ input, ctx }) => {
        return await ctx.db.bibNumber.delete({ where: { id: input.bibNumberId } });
    }),
    deleteAll: protectedProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const raceId = input.raceId;

            await ctx.db.bibNumber.deleteMany({ where: { raceId } });
        }),
    update: protectedProcedure.input(bibNumberSchema).mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;

        return await ctx.db.bibNumber.update({
            where: { id: id! },
            data,
        });
    }),
    add: protectedProcedure.input(bibNumberSchema).mutation(async ({ input, ctx }) => {
        const { id: _id, ...data } = input;
        return await ctx.db.bibNumber.create({
            data,
        });
    }),
    addRange: protectedProcedure.input(addRangeBibNumberSchema).mutation(async ({ input, ctx }) => {
        const { raceId, startNumber, endNumber, omitDuplicates } = input;

        let omitNumbers: string[] = [];
        if (omitDuplicates) {
            omitNumbers = (await ctx.db.bibNumber.findMany({ where: { raceId } })).map(n => n.number);
        }

        const potentialBibNumbers = createRange({ from: startNumber, to: endNumber }).map(s => s.toString());
        const excludedBibNumbers = excludeItems(potentialBibNumbers, omitNumbers);

        const createBibNumbers = excludedBibNumbers.map(number => ctx.db.bibNumber.create({ data: { raceId, number } }));
        await ctx.db.$transaction(createBibNumbers);
    }),
});

export type BibNumnerRouter = typeof bibNumberRouter;
