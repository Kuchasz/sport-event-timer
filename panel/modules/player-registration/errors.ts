import { createErrors } from "../shared/errors";

const sharedSpace = "playersManagement.playerRegistration.errors";

export const playerRegistrationErrorKeys = {
    REGISTRATION_PROMOTED_TO_PLAYER: `${sharedSpace}.registrationPromotedToPlayer`,
} as const;

export const playerRegistrationErrors = createErrors(playerRegistrationErrorKeys);
