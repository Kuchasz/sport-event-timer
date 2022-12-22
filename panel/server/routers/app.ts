import { router } from "../trpc";
import { actionRouter } from "./action";
import { apiKeyRouter } from "./apiKey";
import { classificationRouter } from "./classification";
import { ntpRouter } from "./ntp";
import { playerRouter } from "./player";
import { raceRouter } from "./race";
import { resultRouter } from "./result";
import { splitTimeRouter } from "./split-time";
import { timingPointRouter } from "./timing-point";

export const appRouter = router({
    classification: classificationRouter,
    player: playerRouter,
    race: raceRouter,
    timingPoint: timingPointRouter,
    action: actionRouter,
    ntp: ntpRouter,
    splitTime: splitTimeRouter,
    result: resultRouter,
    apiKey: apiKeyRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
