import { sportKinds } from "@set/utils/dist/sport-kind";
import { z } from "zod";
import sharedErrorCodes from "../shared/error-codes";

export const sportKindEnum = z.enum(sportKinds, { required_error: sharedErrorCodes.required });

export type SportKind = z.infer<typeof sportKindEnum>;
