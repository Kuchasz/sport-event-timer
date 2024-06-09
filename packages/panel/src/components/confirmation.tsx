import { useTranslations } from "use-intl";
import { PoorButton } from "./poor-button";

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
                <PoorButton onClick={onReject} outline>
                    {t("shared.cancel")}
                </PoorButton>
                <PoorButton onClick={() => onResolve(true)}>{t("shared.ok")}</PoorButton>
            </div>
        </div>
    );
};
