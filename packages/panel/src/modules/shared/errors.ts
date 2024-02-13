import { TRPCError } from "@trpc/server";

export class DomainError extends Error {
    constructor(public messageKey: string) {
        super();
    }
}

const raiseError = (messageKey: string) => new TRPCError({ code: "BAD_REQUEST", message: messageKey, cause: new DomainError(messageKey) });

export const createErrors = <T extends Record<string, string>>(errors: T) =>
    Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, raiseError(v)])) as { [Key in keyof T]: TRPCError };

export const sharedErrorKeys = {
    UNAUTHORIZED: "shared.unauthorized",
};

export const sharedErrors = createErrors(sharedErrorKeys);
