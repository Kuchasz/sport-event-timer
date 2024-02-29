import { disqualificationSchema } from "../../modules/disqualification/models";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const disqualificationRouter = router({
    allDisqualifications: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const players = await ctx.db.player.findMany({ where: { raceId }, include: { profile: true } });
            const playersByBibNumbers = new Map<string, string>(players.map(p => [p.bibNumber, `${p.profile.name} ${p.profile.lastName}`]));
            const disqualifications = await ctx.db.disqualification.findMany({ where: { raceId } });

            return disqualifications.map(p => ({ ...p, player: playersByBibNumbers.get(p.bibNumber) }));
        }),
    disqualifications: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const disqualifications = await ctx.db.disqualification.findMany({ where: { raceId } });
            return Object.fromEntries(disqualifications.map(tp => [tp.bibNumber, tp.id])) as Record<string, number>;
        }),
    disqualify: protectedProcedure.input(disqualificationSchema).mutation(async ({ input, ctx }) => {
        const { id: _id, ...disqualification } = input;

        return await ctx.db.disqualification.create({ data: disqualification });
    }),
    update: protectedProcedure.input(disqualificationSchema).mutation(async ({ input, ctx }) => {
        const { id, ...disqualification } = input;

        return await ctx.db.disqualification.update({ where: { id: id! }, data: disqualification });
    }),
    revert: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
        const { id } = input;

        return await ctx.db.disqualification.delete({
            where: { id },
        });
    }),
});

export type DisqualificationRouter = typeof disqualificationRouter;
