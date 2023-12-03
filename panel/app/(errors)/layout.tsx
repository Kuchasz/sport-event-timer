import type { ReactNode } from "react";
import "../../globals.scss";

export default function PanelLayout(props: { children: ReactNode }) {
    return (
        <html className="h-full w-full">
            <body className="flex h-full w-full flex-col text-zinc-900">{props.children}</body>
        </html>
    );
}
