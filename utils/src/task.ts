export const Task = {
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}