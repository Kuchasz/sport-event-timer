import { createErrors } from "../shared/errors";

const sharedSpace = "raceManagement.classification.errors";

export const classificationErrorKeys = {
    AT_LEAST_ONE_CLASSIFICATION_REQUIRED: `${sharedSpace}.atLeastOneClassificationRequired`,
    PLAYERS_ASSIGNED_TO_CLASSIFICATION: `${sharedSpace}.playersAssignedToClassification`,
} as const;

export const classificationErrors = createErrors(classificationErrorKeys);
