import { createErrors } from "../shared/errors";

const sharedSpace = "identity.user.errors";

export const userErrorKeys = {
    REGISTRATION_SYSTEM_DISABLED: `${sharedSpace}.registrationSystemDisabled`,
} as const;

export const userErrors = createErrors(userErrorKeys);
