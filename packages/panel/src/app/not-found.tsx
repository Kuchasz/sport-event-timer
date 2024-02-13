import enTranslations from "../i18n/resources/en.json";
import "../globals.scss";
import { SiteError } from "src/components/errors/site-error";

export default function Error({ error: _err }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html className="h-full w-full">
            <body className="flex h-full w-full items-center justify-center">
                <SiteError
                    code={enTranslations.shared.errors.notFound.code}
                    title={enTranslations.shared.errors.notFound.title}
                    description={enTranslations.shared.errors.notFound.description}
                    goBack={enTranslations.shared.errors.goBack}
                    goHome={enTranslations.shared.errors.goHome}></SiteError>
            </body>
        </html>
    );
}
