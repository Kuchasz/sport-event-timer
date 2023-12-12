import { raceErrorKeys } from "../race/errors";
import { playerRegistrationErrorKeys } from "../player-registration/errors";
import { playerErrorKeys } from "../player/errors";
import { sharedErrorKeys } from "./errors";
import { timingPointErrorKeys } from "../timing-point/errors";

export const errorKeys = {
    ...sharedErrorKeys,
    ...playerErrorKeys,
    ...playerRegistrationErrorKeys,
    ...raceErrorKeys,
    ...timingPointErrorKeys,
};
