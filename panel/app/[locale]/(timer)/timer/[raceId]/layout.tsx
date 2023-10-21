import { Metadata } from "next";
import { ReactNode } from "react";
import TimerLayout from "./timer-layout";

export default function ({ children }: { children: ReactNode }) {
    return (
        <html className="h-full w-full" lang="en">
            <body className="flex h-full w-full flex-col text-zinc-900">
                <TimerLayout>{children}</TimerLayout>
            </body>
        </html>
    );
}

export async function generateMetadata({ params }: { params: { locale: string; raceId: number } }): Promise<Metadata> {
    return {
        title: "Timer",
        manifest: `/api/manifest/${params.raceId}/timer`,
        themeColor: "#000000",
    };
}
