import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { uuidv4 } from "@set/utils/dist/uuid";
import { raceApiKeySchema } from "../../modules/api-key/models";

export const apiKeyRouter = router({
    list: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const { raceId } = input;
            return await ctx.db.apiKey.findMany({
                where: { raceId: raceId },
            });
        }),
    addApiKey: protectedProcedure.input(raceApiKeySchema).mutation(async ({ input, ctx }) => {
        const key = `${uuidv4()}${uuidv4()}`.replaceAll("-", "");

        return await ctx.db.apiKey.create({
            data: {
                key,
                name: input.key.name,
                raceId: input.raceId,
            },
        });
    }),
    editApiKey: protectedProcedure.input(raceApiKeySchema).mutation(async ({ input, ctx }) => {
        return await ctx.db.apiKey.update({
            data: {
                name: input.key.name,
            },
            where: {
                id: input.key.id!,
            },
        });
    }),
    removeApiKey: protectedProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
                keyId: z.number({ required_error: "keyId is required" }),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            return await ctx.db.apiKey.delete({ where: { id: input.keyId } });
        }),
});

export type ApiKeyRouter = typeof apiKeyRouter;
