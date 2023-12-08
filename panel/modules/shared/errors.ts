import { TRPCError } from "@trpc/server";

export class DomainError extends TRPCError {
    constructor(messageKey: string) {
        super({
            message: messageKey,
            code: "BAD_REQUEST",
        });
    }
}

const raiseError = (messageKey: string) => new DomainError(messageKey);

export const createErrors = <T extends Record<string, string>>(errors: T) =>
    Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, raiseError(v)])) as { [Key in keyof T]: DomainError };
