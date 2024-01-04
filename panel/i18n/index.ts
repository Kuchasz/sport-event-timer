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

type FlattenKeys<T> = T extends object ? { [K in keyof T]: `${K & string}.${FlattenKeys<T[K]>}` }[keyof T] : "";

// type Omitf<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type TrpcClientKeys = `mutations.${SubKeys<typeof trpc>}.title` | `mutations.${SubKeys<typeof trpc>}.description`;
type TranslationKeys = FlattenKeys<typeof enTranslations>;

type EEE = Exclude<TrpcClientKeys, keyof TranslationKeys>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const aawad: EEE = "";

// type MutationMessagesKeys = Record<`mutations.${TrpcClientKeys}`, { title: string; description: string }>;

// export const possiblyInvalidEnTranslations: MutationMessagesKeys = enTranslations;

// type LeafNode = { title: string; description: string };

// type NonFunctionLeafNodes<T> = {
//     // [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K] extends TrpcNode ? NonFunctionLeafNodes<T[K]> : LeafNode;
//     [K in keyof T]: T[K] extends TrpcNode ? LeafNode : NonFunctionLeafNodes<T[K]>;
// };

// type MutationMessagesKeys = NonFunctionLeafNodes<typeof trpc>;

// export const possiblyInvalidEnTranslations: MutationMessagesKeys = enTranslations;

// type DeepPick<T, K extends string> = K extends keyof T
//     ? { [P in K]: T[P] }
//     : K extends `${infer First}.${infer Rest}`
//     ? First extends keyof T
//         ? { [P in First]: DeepPick<T[First], Rest> }
//         : never
//     : never;

// type DeepReplace<T, Replacement> = T extends object ? { [K in keyof T]: DeepReplace<T[K], Replacement> } : Replacement;

// type DeepReplacePick<T, K extends string, Replacement> = K extends keyof T
//     ? { [P in K]: Replacement }
//     : K extends `${infer First}.${infer Rest}`
//     ? First extends keyof T
//         ? { [P in First]: DeepReplacePick<T[First], Rest, Replacement> }
//         : never
//     : never;

// // Example usage:
// type ExampleType = {
//     prop1: {
//         subProp1: string;
//         subProp2: number;
//     };
//     prop2: boolean;
//     prop3: string[];
// };

// Pick a nested property using dot notation
// type PickedProp = { mutations: DeepReplacePick<typeof trpc, TrpcClientKeys, { title: string; description: string }> };

// export const possiblyInvalidEnTranslations: PickedProp = enTranslations;

export const locales = ["en", "pl"] as const;
export type Locales = (typeof locales)[number];
