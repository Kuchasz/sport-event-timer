export const Task = {
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    tryCatch: async <T>(promise: Promise<T>) => {
        try {
            const result = await promise;
            return { type: "success", result } as const;
        } catch (err) {
            return { type: "failure" } as const;
        }
    },
};
