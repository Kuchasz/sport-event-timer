import { type Metadata } from "next";
import { type ReactNode } from "react";

export default function (props: { children: ReactNode }) {
    return props.children;
}

export function generateMetadata({ params }: { params: { locale: string; raceId: number } }): Metadata {
    return {
        title: "Start List",
        manifest: `/api/manifest/${params.raceId}/start-list`,
    };
}
