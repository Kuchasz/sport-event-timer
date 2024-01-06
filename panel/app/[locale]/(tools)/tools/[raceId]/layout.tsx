import type { Metadata } from "next";
import type { ReactNode } from "react";
import TimerLayout from "./timer-layout";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import deepmerge from "deepmerge";
import { Task } from "@set/utils/dist/task";
import { trpcRSC } from "trpc-core-rsc";

export default async function (props: { children: ReactNode; params: { locale: string; raceId: string } }) {
    const locale = useLocale();

    if (props?.params?.locale !== locale) {
        notFound();
    }

    const race = await Task.tryCatch(trpcRSC.race.race.query({ raceId: Number(props.params.raceId) }));
    if (race.type !== "success") notFound();

    let messages;

    try {
        const localeMessages = (await import(`../../../../../i18n/resources/${locale}.json`)).default;
        const defaultMessages = (await import(`../../../../../i18n/resources/en.json`)).default;

        messages = deepmerge(defaultMessages, localeMessages) as any;
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang="en">
            <body className="flex h-full w-full flex-col text-zinc-900">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <TimerLayout>{props.children}</TimerLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export function generateMetadata({ params }: { params: { locale: string; raceId: number } }): Metadata {
    return {
        title: "Timer",
        manifest: `/api/manifest/${params.raceId}/timer`,
    };
}
