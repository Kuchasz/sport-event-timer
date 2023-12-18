import { excludeItems } from "@set/utils/dist/array";
import { getAllPropertyNames } from "@set/utils/dist/object";
import { errorKeys } from "../modules/shared/error-keys";
import { locales } from "./index";

describe("Errors translations", () => {
    const errorTranslationKeys = Object.values(errorKeys);
    const nonEnglishLocales = excludeItems(locales as unknown as string[], ["en"]);

    test.each(locales)("%s error translations", async locale => {
        const translations = await import(`./resources/${locale}.json`);
        const notTranslatedErrorKeys = excludeItems(errorTranslationKeys, getAllPropertyNames(translations));
        expect(notTranslatedErrorKeys).toHaveLength(0);
    });

    test.each(nonEnglishLocales)("%s missing translations", async locale => {
        const translations = await import(`./resources/${locale}.json`);
        const englishTranslations = await import("./resources/en.json");

        const translationsEquality = hasEqualStructure(translations, englishTranslations);

        expect(translationsEquality).toBeTruthy();
    });
});

const hasEqualStructure = (obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean =>
    Object.keys(obj1).every(key => {
        const v = obj1[key];

        if (typeof v === "object" && v !== null) {
            return hasEqualStructure(v as Record<string, unknown>, obj2[key] as Record<string, unknown>);
        }

        return obj2.hasOwnProperty(key);
    });
