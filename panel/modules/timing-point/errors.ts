import { createErrors } from "../shared/errors";

const sharedSpace = "timeMeasurement.timingPoint.errors";

export const timingPointErrorKeys = {
    AT_LEAST_TWO_TIMING_POINTS_REQUIRED: `${sharedSpace}.atLeastTwoTimingPointsRequired`,
} as const;

export const timingPointErrors = createErrors(timingPointErrorKeys);
