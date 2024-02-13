import { createErrors } from "../shared/errors";

const sharedSpace = "playersManagement.playerRegistration.errors";

export const playerRegistrationErrorKeys = {
    REGISTRATION_PROMOTED_TO_PLAYER: `${sharedSpace}.registrationPromotedToPlayer`,
    REGISTRATION_LIMIT_REACHED: `${sharedSpace}.registrationLimitReached`,
    REGISTRATION_CUTOFF: `${sharedSpace}.registrationCutoff`,
    REGISTRATION_DISABLED: `${sharedSpace}.registrationDisabled`,
} as const;

export const playerRegistrationErrors = createErrors(playerRegistrationErrorKeys);
