import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import type { Gender } from "../../modules/shared/models";
import { categorySchema, classificationSchema } from "../../modules/classification/models";
import { classificationErrorKeys } from "../../modules/classification/errors";

// const classificationsSchema = z.object({
//     id: z.number(),
//     raceId: z.number({ required_error: "raceId is required" }).min(1),
//     name: z.string({ required_error: "name is required" }),
// });

export const classificationRouter = router({
    classifications: publicProcedure
        .input(
            z.object({
                raceId: z.number({ required_error: "raceId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const classifications = await ctx.db.classification.findMany({ where: { raceId }, include: { categories: true } });

            return classifications.map((c, index) => ({ ...c, categoriesNumber: c.categories.length, index: index + 1 }));
        }),
    categories: protectedProcedure
        .input(
            z.object({
                classificationId: z.number({ required_error: "classificationId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const classificationId = input.classificationId;
            const categories = await ctx.db.category.findMany({ where: { classificationId } });

            return categories.map(c => ({ ...c, gender: c.gender as Gender }));
        }),
    addCategory: protectedProcedure.input(categorySchema).mutation(async ({ input, ctx }) => {
        const { id: _id, ...classification } = input;

        return await ctx.db.category.create({ data: classification });
    }),
    removeCategory: protectedProcedure
        .input(
            z.object({
                categoryId: z.number({ required_error: "categoryId is required" }),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const categoryId = input.categoryId;

            return await ctx.db.category.delete({ where: { id: categoryId } });
        }),
    updateCategory: protectedProcedure.input(categorySchema).mutation(async ({ input, ctx }) => {
        const { id, ...category } = input;

        return await ctx.db.category.update({
            where: { id: id! },
            data: {
                ...category,
            },
        });
    }),
    // upload: protectedProcedure.input(z.object({
    //     classifications: z.array(
    //         z.object({
    //             name: z.string({ required_error: "name is required" })
    //         })
    //     ),
    //     raceId: z.number().min(1)
    // })).mutation(async ({ input, ctx }) => {
    //     const { classifications, raceId } = input;
    //     classifications.forEach(async classification => {
    //         await ctx.db.classification.create({ data: { ...classification, raceId } });
    //     });
    // }),
    update: protectedProcedure.input(classificationSchema).mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        const { raceId: _raceId, ...classification } = data;

        // const categories = subCategories.map(c => ({ where: { id: c.id ?? 0 }, create: c, update: c }));

        return await ctx.db.classification.update({
            where: { id: id! },
            data: {
                ...classification,
            },
        });
    }),
    add: protectedProcedure.input(classificationSchema).mutation(async ({ input, ctx }) => {
        const { id: _id, ...data } = input;
        return await ctx.db.classification.create({
            data: {
                ...data,
            },
        });
    }),
    delete: protectedProcedure.input(z.object({ classificationId: z.number() })).mutation(async ({ input, ctx }) => {
        const numberOfClassifications = await ctx.db.classification.count();
        if (numberOfClassifications <= 1) throw classificationErrorKeys.AT_LEAST_ONE_CLASSIFICATION_REQUIRED;

        const playersCount = await ctx.db.player.count({ where: { classificationId: input.classificationId } });
        if (playersCount) throw classificationErrorKeys.PLAYERS_ASSIGNED_TO_CLASSIFICATION;

        await ctx.db.category.deleteMany({ where: { classificationId: input.classificationId } });

        return await ctx.db.classification.delete({ where: { id: input.classificationId } });
    }),
});

export type ClassificationRouter = typeof classificationRouter;
