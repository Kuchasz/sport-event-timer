import { Task } from "@set/utils/dist/task";
import type { Metadata } from "next";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { trpcRSC } from "trpc-core-rsc";
import TimerLayout from "./timer-layout";
import { getLocales } from "i18n";

export default async function (props: { children: ReactNode; params: { locale: string; raceId: string } }) {
    const locale = useLocale();

    if (props?.params?.locale !== locale) {
        notFound();
    }

    const race = await Task.tryCatch(trpcRSC.race.race.query({ raceId: Number(props.params.raceId) }));
    if (race.type !== "success") notFound();

    let messages;

    try {
        messages = await getLocales(locale);
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
        manifest: `/api/manifest/${params.raceId}/countdown`,
    };
}
