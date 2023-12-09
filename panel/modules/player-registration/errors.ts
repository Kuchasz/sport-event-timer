import { createErrors } from "modules/shared/errors";

const sharedSpace = "playersManagement.playerRegistration.errors";

export const playerRegistrationErrors = createErrors({
    REGISTRATION_PROMOTED_TO_PLAYER: `${sharedSpace}.registrationPromotedToPlayer`,
});
