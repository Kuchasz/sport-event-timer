import { raceErrorKeys } from "../race/errors";
import { playerRegistrationErrorKeys } from "../player-registration/errors";
import { playerErrorKeys } from "../player/errors";
import { sharedErrorKeys } from "./errors";
import { timingPointErrorKeys } from "../timing-point/errors";
import { userErrorKeys } from "../user/errors";
import { classificationErrorKeys } from "../classification/errors";

export const errorKeys = {
    ...sharedErrorKeys,
    ...playerErrorKeys,
    ...playerRegistrationErrorKeys,
    ...raceErrorKeys,
    ...timingPointErrorKeys,
    ...userErrorKeys,
    ...classificationErrorKeys,
};
