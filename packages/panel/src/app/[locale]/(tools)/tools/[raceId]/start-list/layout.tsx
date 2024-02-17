import { type Metadata } from "next";

export default function (props: { children: React.ReactNode }) {
    return props.children;
}

export function generateMetadata({ params }: { params: { locale: string; raceId: number } }): Metadata {
    return {
        title: "Start List",
        manifest: `/api/manifest/${params.raceId}/start-list`,
        themeColor: [
            {
                color: "#ffbb51",
                media: "(prefers-color-scheme: light)",
            },
            {
                color: "#ffbb51",
                media: "(prefers-color-scheme: dark)",
            },
        ],
    };
}
