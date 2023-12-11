import enTranslations from "./resources/en.json";
import plTranslations from "./resources/pl.json";
import { errorKeys } from "../modules/shared/error-keys";
import { createNestedObject, getObjectSlice } from "@set/utils/dist/object";

describe("Errors translations", () => {
    //eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const rootKeys = [...new Set<string>(Object.values(errorKeys).map(k => k.split(".")[0]))];
    const allValues = createNestedObject(Object.values(errorKeys).map(k => [k, expect.any(String)]));
    const slicedPlTranslations = getObjectSlice(plTranslations, rootKeys);
    const slicedEnTranslations = getObjectSlice(enTranslations, rootKeys);

    test("Polish error translations", () => {
        expect(slicedPlTranslations).toMatchObject(expect.objectContaining(allValues));
    });
    test("English error translations", () => {
        expect(slicedEnTranslations).toMatchObject(expect.objectContaining(allValues));
    });
});
