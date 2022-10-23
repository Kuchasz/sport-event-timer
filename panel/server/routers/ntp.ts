import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const ntpRouter = router({
    sync: publicProcedure.input(z.number()).output(z.number()).mutation(() => Date.now())
});

export type NTPRouter = typeof ntpRouter;
