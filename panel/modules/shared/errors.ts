import { TRPCError } from "@trpc/server";

export class DomainError extends TRPCError {
    constructor(messageKey: string) {
        super({
            message: messageKey,
            code: "BAD_REQUEST",
        });
    }
}
