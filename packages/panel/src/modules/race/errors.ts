import { createErrors } from "../shared/errors";

const sharedSpace = "raceManagement.race.errors";

export const raceErrorKeys = {
    AT_LEAST_ONE_RACE_REQUIRED: `${sharedSpace}.atLeastOneRaceRequired`,
} as const;

export const raceErrors = createErrors(raceErrorKeys);
