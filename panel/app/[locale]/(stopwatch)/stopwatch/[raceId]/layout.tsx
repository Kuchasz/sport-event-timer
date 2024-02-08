import { Task } from "@set/utils/dist/task";
import { authenticate, getServerSession } from "auth";
import { SessionProvider } from "auth/provider";
import { locales, type Locales } from "i18n/locales";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TrpcProvider } from "providers";
import type { ReactNode } from "react";
import { trpcRSC } from "trpc-core-rsc";
import { StopwatchLayout } from "./stopwatch-layout";

export default async function ({
    children,
    params,
    title,
}: {
    children: ReactNode;
    params: { locale: string; raceId: string };
    title: ReactNode;
}) {
    await authenticate();
    const isValidLocale = locales.includes(params.locale as Locales);
    const session = await getServerSession();
    if (!isValidLocale) notFound();

    const race = await Task.tryCatch(trpcRSC.race.race.query({ raceId: Number(params.raceId) }));
    if (race.type !== "success") notFound();

    const { locale } = params;

    let messages;

    try {
        messages = (await import(`../../../i18n/resources/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html className="h-full w-full" lang="en">
            <body className="flex h-full w-full flex-col text-zinc-900">
                <NextIntlClientProvider timeZone="Europe/Warsaw" locale={locale} messages={messages}>
                    <SessionProvider session={session!}>
                        <TrpcProvider toastConfirmations={false} enableSubscriptions={true}>
                            <StopwatchLayout title={title}>{children}</StopwatchLayout>
                        </TrpcProvider>
                    </SessionProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export function generateMetadata({ params }: { params: { locale: string; raceId: number } }): Metadata {
    return {
        title: "Stopwatch",
        manifest: `/api/manifest/${params.raceId}/stopwatch`,
    };
}
