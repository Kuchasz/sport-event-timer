import { getRequestConfig } from "next-intl/server";
import { type trpc } from "trpc-core";
import type enTranslations from "./resources/en.json";

const getLocale = getRequestConfig(async ({ locale }) => ({
    messages: (await import(`./resources/${locale}.json`)).default,
}));

export default getLocale;

//eslint-disable-next-line
type TrpcNode = Record<string, Function>;

type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}.${P}` : never) : never;

type SubKeys<T> = T extends TrpcNode
    ? never
    : {
          [K in keyof T]: T[K] extends TrpcNode ? K : Join<K, SubKeys<T[K]>>;
      }[keyof T];

type FlattenObjectKeys<T extends Record<string, unknown>, Key = keyof T> = Key extends string
    ? T[Key] extends Record<string, unknown>
        ? `${Key}.${FlattenObjectKeys<T[Key]>}`
        : `${Key}`
    : never;

type TrpcClientKeys = `mutations.${SubKeys<typeof trpc>}.title` | `mutations.${SubKeys<typeof trpc>}.description`;
type TranslationKeys = FlattenObjectKeys<typeof enTranslations>;
type ExcludedKeys = Exclude<TrpcClientKeys, TranslationKeys>;

type PotentialMissingTranslations = ExcludedKeys extends never ? "" : ExcludedKeys;

export const potentialInvalidMissingTranslation: PotentialMissingTranslations = "";
