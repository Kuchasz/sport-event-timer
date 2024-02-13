import { useTranslations } from "use-intl";
import { Button } from "./button";

type ConfirmationProps = {
    onReject: () => void;
    onResolve: (confirmed: boolean) => void;
    message: string;
};

export const Confirmation = ({ message, onReject, onResolve }: ConfirmationProps) => {
    const t = useTranslations();
    return (
        <div className="flex flex-col">
            <div className="flex">
                <span>{message}</span>
            </div>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button onClick={() => onResolve(true)}>{t("shared.ok")}</Button>
            </div>
        </div>
    );
};
