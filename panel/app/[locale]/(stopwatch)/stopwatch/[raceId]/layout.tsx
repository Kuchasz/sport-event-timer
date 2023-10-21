import type { Metadata } from "next";
import type { ReactNode } from "react";
import React from "react";
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

export function generateMetadata({ params }: { params: { locale: string; raceId: number } }): Metadata {
    return {
        title: "Stopwatch",
        manifest: `/api/manifest/${params.raceId}/stopwatch`,
        themeColor: "#000000",
    };
}
