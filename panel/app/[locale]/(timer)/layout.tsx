"use client";

import Head from "next/head";
import { useParams } from "next/navigation";
import { TrpcProvider } from "providers";
import { ReactNode } from "react";
import "../../../globals.scss";

export default function TimerLayout({ children }: { children: ReactNode }) {
    const { raceId } = useParams() as { raceId: string };

    return (
        <html className="w-full h-full" lang="en">
            <body className="w-full h-full flex flex-col text-zinc-900">
                <Head>
                    <title>Timer</title>
                    {raceId && <link key="manifest" rel="manifest" href={`/api/manifest/${raceId}/timer`} />}
                </Head>
                <TrpcProvider>{children}</TrpcProvider>
            </body>
        </html>
    );
}
