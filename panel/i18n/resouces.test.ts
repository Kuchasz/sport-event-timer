import enTranslations from "./resources/en.json";
import plTranslations from "./resources/pl.json";
import { errorKeys } from "../modules/shared/error-keys";

describe("Errors translations", () => {
    //eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const allValues = createNestedObject(Object.values(errorKeys).map(k => [k, expect.any(String)]));

    test("Polish error translations", () => {
        expect(plTranslations).toMatchObject(expect.objectContaining(allValues));
    });
    test("English error translations", () => {
        expect(enTranslations).toMatchObject(expect.objectContaining(allValues));
    });
});

function createNestedObject(entries: [string, string][]): Record<string, any> {
    const result: Record<string, any> = {};

    entries.forEach(([path, value]) => {
        const keys: string[] = path.split(".");
        let currentLevel: Record<string, any> = result;

        keys.forEach((key, index) => {
            if (!currentLevel[key]) {
                if (index === keys.length - 1) {
                    // Last key, assign the value
                    currentLevel[key] = value;
                } else {
                    // Create an empty object for the next level
                    currentLevel[key] = {};
                }
            }

            // Move to the next level
            currentLevel = currentLevel[key];
        });
    });

    return result;
}
