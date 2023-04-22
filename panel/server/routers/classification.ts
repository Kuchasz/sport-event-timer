import { GenderEnum } from "../../models";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const categoriesSchema = z.array(z.object({
    id: z.number().min(1).optional(),
    name: z.string({ required_error: "name is required" }),
    gender: GenderEnum.optional(),
    minAge: z.number().min(1).optional(),
    maxAge: z.number().max(199).optional(),
    isSpecial: z.boolean()
}));

const classificationSchema = z.object({
    id: z.number().nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
    categories: categoriesSchema
});

const classificationsSchema = z.object({
    id: z.number(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
    categories: categoriesSchema
});

export const classificationRouter =
    router({
        classifications: protectedProcedure.input(z.object({
            raceId: z.number({ required_error: "raceId is required" })
        })).output(z.array(classificationsSchema)).query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const classifications = await ctx.db.classification.findMany({ where: { raceId }, include: { categories: true } });

            return classifications.map((c, index) => ({ ...c, index: index + 1 }) as z.infer<typeof classificationsSchema>);
        }),
        categories: protectedProcedure.input(z.object({
            classificationId: z.number({ required_error: "classificationId is required" })
        })).query(async ({ input, ctx }) => {
            const classificationId = input.classificationId;
            const ageCategories = await ctx.db.category.findMany({ where: { classificationId } });

            return await categoriesSchema.parseAsync(ageCategories);
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
            const { categories: ageCategories, ...classification } = data;

            const categories = ageCategories.map(c => ({ where: { id: c.id }, create: c, update: c }));

            return await ctx.db.classification.update({
                where: { id: id! },
                data: {
                    ...classification,
                    categories: {
                        upsert: categories
                    }
                }
            });
        }),
        add: protectedProcedure.input(classificationSchema).mutation(async ({ input, ctx }) => {
            const { id, ...data } = input;
            return await ctx.db.classification.create({
                data: {
                    ...data,
                    categories: {
                        create: data.categories
                    }
                }
            });
        })
    });

export type ClassificationRouter = typeof classificationRouter;
