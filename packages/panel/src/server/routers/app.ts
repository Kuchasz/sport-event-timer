import { router } from "../trpc";
import { resultRouter } from "./result";

export const appRouter = router({
    // classification: classificationRouter,
    // player: playerRouter,
    // race: raceRouter,
    // timingPoint: timingPointRouter,
    // action: actionRouter,
    // ntp: ntpRouter,
    // splitTime: splitTimeRouter,
    result: resultRouter,
    // apiKey: apiKeyRouter,
    // playerRegistration: playerRegistrationRouter,
    // user: userRouter,
    // bibNumber: bibNumberRouter,
    // timePenalty: timePenaltyRouter,
    // disqualification: disqualificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
