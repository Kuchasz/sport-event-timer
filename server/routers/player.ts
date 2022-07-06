import * as fs from "../async-fs";
import * as trpc from "@trpc/server";
import { RegistrationPlayer } from "@set/timer/model";
import { z } from "zod";

const ClassificationsEnum = z.enum(["rnk_pro", "rnk_fun", "rnk_tt", "gc", "all"]);

export const playerRouter = trpc.router().query("players", {
    input: ClassificationsEnum,
    async resolve(req) {
        const players = await fs.readCsvAsync<RegistrationPlayer[]>("../uploaded-players.csv");
        return players.filter(p => req.input === "all" || p.classificationId === req.input);
    }
});

export type PlayerRouter = typeof playerRouter;
