import { excludeItems } from "@set/utils/dist/array";
import { getAllPropertyNames } from "@set/utils/dist/object";
import { errorKeys } from "../modules/shared/error-keys";
import enTranslations from "./resources/en.json";
import plTranslations from "./resources/pl.json";

describe("Errors translations", () => {
    const errorTranslationKeys = Object.values(errorKeys) as string[];

    test("Polish error translations", () => {
        const notTranslatedErrorKeys = excludeItems(errorTranslationKeys, getAllPropertyNames(plTranslations));
        expect(notTranslatedErrorKeys).toHaveLength(0);
    });
    test("English error translations", () => {
        const notTranslatedErrorKeys = excludeItems(errorTranslationKeys, getAllPropertyNames(enTranslations));
        expect(notTranslatedErrorKeys).toHaveLength(0);
    });
});
