import { getRequestConfig } from "next-intl/server";
import { type trpc } from "trpc-core";

export default getRequestConfig(async ({ locale }) => ({
    messages: (await import(`./resources/${locale}.json`)).default,
}));

//eslint-disable-next-line
type TrpcNode = Record<string, Function>;

type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}.${P}` : never) : never;

type SubKeys<T> = T extends TrpcNode
    ? never
    : {
          [K in keyof T]: T[K] extends TrpcNode ? K : Join<K, SubKeys<T[K]>>;
      }[keyof T];

type TrpcClientKeys = SubKeys<typeof trpc>;
type MutationMessagesKeys = Record<`mutations.${TrpcClientKeys}`, { title: string; description: string }>;

export const locales = ["en", "pl"] as const;
export type Locales = (typeof locales)[number];
