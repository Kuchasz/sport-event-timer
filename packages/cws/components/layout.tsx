import type { FC } from "hono/jsx";

export const Layout: FC = props => {
    return (
        <html>
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body className="p-8">{props.children}</body>
        </html>
    );
};
