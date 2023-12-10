import { playerRegistrationErrorKeys } from "../player-registration/errors";
import { playerErrorKeys } from "../player/errors";

export const errorKeys = { ...playerErrorKeys, ...playerRegistrationErrorKeys };
