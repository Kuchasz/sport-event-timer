import { createErrors } from "../shared/errors";

const sharedSpace = "timeMeasurement.split.errors";

export const splitErrorKeys = {
    ORDER_ARRAY_MUST_MATCH_SPLITS_DEFINITIONS: `${sharedSpace}.orderArrayMustMatchSplitsDefinitions`,
} as const;

export const splitErrors = createErrors(splitErrorKeys);
