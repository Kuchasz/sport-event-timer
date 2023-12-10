import { createErrors } from "../shared/errors";

const sharedSpace = "playersManagement.player.errors";

export const playerErrorKeys = {
    PLAYER_WITHOUT_START_TIME_EXISTS: `${sharedSpace}.playerWithoutStartTimeExists`,
    BIB_NUMBER_ALREADY_TAKEN: `${sharedSpace}.bibNumberAlreadyTaken`,
    START_TIME_ALREADY_TAKEN: `${sharedSpace}.startTimeAlreadyTaken`,
    CLASSIFICATION_NOT_FOUND: `${sharedSpace}.classificationNotFound`,
    REGISTRATION_ALREADY_PROMOTED: `${sharedSpace}.registrationAlreadyPromoted`,
} as const;

export const playerErrors = createErrors(playerErrorKeys);
