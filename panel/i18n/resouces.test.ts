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

        const notTranslatedErrorKeys = excludeItems(getAllPropertyNames(englishTranslations), getAllPropertyNames(translations));
        expect(notTranslatedErrorKeys).toHaveLength(0);
    });
});
