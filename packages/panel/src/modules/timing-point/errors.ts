import { createErrors } from "../shared/errors";

const sharedSpace = "timeMeasurement.timingPoint.errors";

export const timingPointErrorKeys = {
    AT_LEAST_TWO_TIMING_POINTS_REQUIRED: `${sharedSpace}.atLeastTwoTimingPointsRequired`,
    DELETE_NOT_ALLOWED_WITH_SPLIT_TIMES_REGISTERED: `${sharedSpace}.deleteNotAllowedWithSplitTimesRegistered`,
    SPLIT_TIMES_FOR_LAPS_REGISTERED: `${sharedSpace}.splitTimesForLapsRegistered`,
    LAPS_ALLOWED_ONLY_ON_CHECKPOINT: `${sharedSpace}.lapsAllowedOnlyOnCheckpoint`,
} as const;

export const timingPointErrors = createErrors(timingPointErrorKeys);
