import { z } from "zod";

export const disqualificationSchema = z.object({
    id: z.number().nullish(),
    raceId: z.number(),
    bibNumber: z.string(),
    reason: z.string(),
});

export const disqualificationReasons = [
    "illegalSubstanceUse",
    "ruleViolations",
    "incompleteGear",
    "outsideAssistance",
    "failureToFollowCourse",
    "falseStart",
    "disorderlyConduct",
    "missedCheckpoints",
    "courseCutting",
    "noVisibleBib",
    "invalidBibPlacement",
    "unsportsmanlikeConduct",
    "littering",
    "unauthorizedAssistance",
    "failureToFinishInTime",
    "equipmentViolations",
    "inadequateLightingNightRaces",
] as const;
