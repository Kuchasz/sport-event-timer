import { Metadata } from "next";
import { ReactNode } from "react";
import TimerLayout from "./timer-layout";

export default function ({ children }: { children: ReactNode }) {
    return (
        <html className="w-full h-full" lang="en">
            <body className="w-full h-full flex flex-col text-zinc-900">
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
