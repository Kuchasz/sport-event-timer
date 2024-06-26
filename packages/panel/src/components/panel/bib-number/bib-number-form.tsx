import { Form, SmallFormInput } from "src/components/form";
import { bibNumberSchema } from "src/modules/bib-number/models";
import { useTranslations } from "next-intl";
import type { AppRouterInputs } from "src/trpc";
import { PoorButton } from "../../poor-button";
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
            <div>
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
                <PoorButton onClick={onReject} outline>
                    {t("shared.cancel")}
                </PoorButton>
                <PoorButton loading={isLoading} type="submit">
                    {t("shared.save")}
                </PoorButton>
            </div>
        </Form>
    );
};
