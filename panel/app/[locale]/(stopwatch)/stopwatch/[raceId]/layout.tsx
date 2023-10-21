import { Metadata } from "next";
import React, { ReactNode } from "react";
import { StopwatchLayout } from "./stopwatch-layout";

export default function ({ children }: { children: ReactNode }) {
    return (
        <html className="h-full w-full" lang="en">
            <body className="flex h-full w-full flex-col text-zinc-900">
                <StopwatchLayout>{children}</StopwatchLayout>
            </body>
        </html>
    );
}

export async function generateMetadata({ params }: { params: { locale: string; raceId: number } }): Promise<Metadata> {
    return {
        title: "Stopwatch",
        manifest: `/api/manifest/${params.raceId}/stopwatch`,
        themeColor: "#000000",
    };
}
