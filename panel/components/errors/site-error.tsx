import { Button } from "components/button";
import { useTranslations } from "next-intl";

type ErrorProps = {
    code: string;
    title: string;
    description: string;
};

export const SiteError = ({ code, title, description }: ErrorProps) => {
    const t = useTranslations("shared.errors");
    return (
        <div className="flex items-center">
            <div className="m-12 flex flex-col items-start">
                <div className="rounded-lg bg-blue-300 px-3 py-1 text-sm font-medium">{code}</div>
                <h2 className="pt-2 text-5xl font-semibold">{title}</h2>
                <p className="py-6">{description}</p>
                <div className="flex">
                    <Button outline>{t("goBack")}</Button>
                    <Button className="ml-2">{t("goHome")}</Button>
                </div>
            </div>
            <img className="h-64 -scale-x-100" src="/assets/sad_dino.png"></img>
        </div>
    );
};
