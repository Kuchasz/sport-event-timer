import { Form, SmallFormInput } from "form";
import { bibNumberSchema } from "modules/bib-number/models";
import { useTranslations } from "next-intl";
import type { AppRouterInputs } from "trpc";
import { Button } from "../../button";
import { PoorInput } from "../../poor-input";

type BibNumber = AppRouterInputs["bibNumber"]["add"];

type BibNumberFormProps = {
    onReject: () => void;
    onResolve: (BibNumber: BibNumber) => void;
    initialBibNumber: BibNumber;
    isLoading: boolean;
};

export const BibNumberForm = ({ onReject, onResolve, initialBibNumber, isLoading }: BibNumberFormProps) => {
    const t = useTranslations();
    return (
        <Form<BibNumber> validationSchema={bibNumberSchema} initialValues={initialBibNumber} onSubmit={onResolve}>
            <div className="flex">
                <SmallFormInput<BibNumber, "number">
                    label={t("pages.bibNumbers.form.number.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.bibNumbers.form.number.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="number"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button loading={isLoading} type="submit">
                    {t("shared.save")}
                </Button>
            </div>
        </Form>
    );
};
