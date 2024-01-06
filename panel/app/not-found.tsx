import { useTranslations } from "next-intl";
import "../globals.scss";
import { SiteError } from "components/errors/site-error";

export default function Error({ error: _err }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations("shared.errors");
    return (
        <html className="h-full w-full">
            <body className="flex h-full w-full items-center justify-center">
                <SiteError code={t("notFound.code")} title={t("notFound.title")} description={t("notFound.description")}></SiteError>
            </body>
        </html>
    );
}
