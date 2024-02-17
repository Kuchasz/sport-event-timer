import { Task } from "@set/utils/dist/task";
import { authenticate, getServerSession } from "src/auth";
import { SessionProvider } from "src/auth/provider";
import { locales, type Locales } from "src/i18n/locales";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TrpcProvider } from "src/providers";
import { trpcRSC } from "src/trpc-core-rsc";
import { StopwatchLayout } from "./stopwatch-layout";
import { getLocales } from "src/i18n";

export default async function ({
    children,
    params,
    title,
}: {
    children: React.ReactNode;
    params: { locale: string; raceId: string };
    title: React.ReactNode;
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
        messages = await getLocales(locale);
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
