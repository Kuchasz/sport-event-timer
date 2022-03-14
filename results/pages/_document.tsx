import Document, {
    Head,
    Html,
    Main,
    NextScript
    } from "next/document";

export default class MyDocument extends Document {
    render() {
        return (
            <Html className="w-full h-full" lang="en">
                <Head />
                <body className="w-full h-full flex flex-col text-zinc-900">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
