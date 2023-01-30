import { db } from "../db";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { GenderEnum } from "../schema";

const ageCategoriesSchema = z.array(z.object({
    id: z.number().min(1).optional(),
    name: z.string({ required_error: "name is required" }),
    gender: GenderEnum.optional(),
    minAge: z.number().min(1).optional(),
    maxAge: z.number().max(199).optional(),
    isSpecial: z.boolean()
}));

const classificationSchema = z.object({
    id: z.number().min(1).nullish(),
    raceId: z.number({ required_error: "raceId is required" }).min(1),
    name: z.string({ required_error: "name is required" }),
    ageCategories: ageCategoriesSchema
});

export const classificationRouter =
    router({
        classifications: protectedProcedure.input(z.object({
            raceId: z.number({ required_error: "raceId is required" })
        })).query(async (req) => {
            const raceId = req.input.raceId;
            const classifications = await db.classification.findMany({ where: { raceId } });

            return classifications.map((c, index) => ({ ...c, index: index + 1 }));
        }),
        categories: protectedProcedure.input(z.object({
            classificationId: z.number({ required_error: "classificationId is required" })
        })).query(async (req) => {
            const classificationId = req.input.classificationId;
            const ageCategories = await db.category.findMany({ where: { classificationId } });

            return await ageCategoriesSchema.parseAsync(ageCategories);
        }),
        upload: protectedProcedure.input(z.object({
            classifications: z.array(
                z.object({
                    name: z.string({ required_error: "name is required" })
                })
            ),
            raceId: z.number().min(1)
        })).mutation(async (req) => {
            const { classifications, raceId } = req.input;
            classifications.forEach(async classification => {
                await db.classification.create({ data: { ...classification, raceId } });
            });
        }),
        update: protectedProcedure.input(classificationSchema).mutation(async (req) => {
            const { id, ...data } = req.input;
            const { ageCategories, ...classification } = data;

            const categories = ageCategories.map(c => ({ where: { id: c.id }, create: c, update: c }));

            return await db.classification.update({
                where: { id: id! },
                data: {
                    ...classification,
                    categories: {
                        upsert: categories
                    }
                }
            });
        }),
        add: protectedProcedure.input(classificationSchema).mutation(async (req) => {
            const { id, ...data } = req.input;
            return await db.classification.create({ data });
        })
    });

export type ClassificationRouter = typeof classificationRouter;
