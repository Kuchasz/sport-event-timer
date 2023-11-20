import { router } from "../trpc";
import { actionRouter } from "./action";
import { apiKeyRouter } from "./api-key";
import { classificationRouter } from "./classification";
import { ntpRouter } from "./ntp";
import { playerRouter } from "./player";
import { raceRouter } from "./race";
import { resultRouter } from "./result";
import { splitTimeRouter } from "./split-time";
import { timingPointRouter } from "./timing-point";
import { playerRegistrationRouter } from "./player-registration";
import { userRouter } from "./user";
import { bibNumberRouter } from "./bib-number";
import { timePenaltyRouter } from "./time-penalty";
import { disqualificationRouter } from "./disqualification";

export const appRouter = router({
    classification: classificationRouter,
    player: playerRouter,
    race: raceRouter,
    timingPoint: timingPointRouter,
    action: actionRouter,
    ntp: ntpRouter,
    splitTime: splitTimeRouter,
    result: resultRouter,
    apiKey: apiKeyRouter,
    playerRegistration: playerRegistrationRouter,
    user: userRouter,
    bibNumber: bibNumberRouter,
    timePenalty: timePenaltyRouter,
    disqualification: disqualificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
