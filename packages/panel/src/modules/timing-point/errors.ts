import { createErrors } from "../shared/errors";

const sharedSpace = "timeMeasurement.timingPoint.errors";

export const timingPointErrorKeys = {
    AT_LEAST_TWO_TIMING_POINTS_REQUIRED: `${sharedSpace}.atLeastTwoTimingPointsRequired`,
    DELETE_NOT_ALLOWED_WHEN_USED_IN_SPLITS: `${sharedSpace}.deleteNotAllowedWhenUsedInSplits`,
} as const;

export const timingPointErrors = createErrors(timingPointErrorKeys);
