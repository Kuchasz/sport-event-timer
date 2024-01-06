import { useTranslations } from "next-intl";
import { Button } from "../components/button";
import "../globals.scss";

export default function Error({ error: _err }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations("shared.errors");
    return (
        <html className="h-full w-full">
            <body className="flex h-full w-full items-center justify-center">
                <div className="flex items-center">
                    <div className="m-12 flex flex-col items-start">
                        <div className="rounded-lg bg-blue-300 px-3 py-1 text-sm font-medium">{t("notFound.code")}</div>
                        <h2 className="pt-2 text-5xl font-semibold">{t("notFound.title")}</h2>
                        <p className="py-6">{t("notFound.description")}</p>
                        <div className="flex">
                            <Button outline>{t("goBack")}</Button>
                            <Button className="ml-2">{t("goHome")}</Button>
                        </div>
                    </div>
                    <img className="h-64 -scale-x-100" src="/assets/sad_dino.png"></img>
                </div>
            </body>
        </html>
    );
}
