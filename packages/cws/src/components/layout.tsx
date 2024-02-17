import type { PropsWithChildren } from "hono/jsx";

export const Layout = ({ children }: PropsWithChildren) => {
    return (
        <html>
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/7.4.47/css/materialdesignicons.min.css"></link>
            </head>
            <body>{children}</body>
        </html>
    );
};
