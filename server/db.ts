import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient(); //new PrismaClient({ log: ["error", "info", "query"] });
