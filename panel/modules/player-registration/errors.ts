import { createErrors } from "../shared/errors";

const sharedSpace = "playersManagement.playerRegistration.errors";

export const playerRegistrationErrorKeys = {
    REGISTRATION_PROMOTED_TO_PLAYER: `${sharedSpace}.registrationPromotedToPlayer`,
    EXCEEDED_NUMBER_OF_REGISTRATIONS: `${sharedSpace}.exceededNumberOfRegistrations`,
    REGISTRATION_DISABLED: `${sharedSpace}.registrationDisabled`,
} as const;

export const playerRegistrationErrors = createErrors(playerRegistrationErrorKeys);
