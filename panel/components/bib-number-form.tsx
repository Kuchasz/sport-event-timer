import { Button } from "./button";
import { AppRouterInputs } from "trpc";
import { PoorInput } from "./poor-input";
import { Form, FormInput } from "form";
import { bibNumberSchema } from "modules/bib-number/models";
import { useTranslations } from "next-intl";

type BibNumber = AppRouterInputs["bibNumber"]["add"];

type BibNumberFormProps = {
    onReject: () => void;
    onResolve: (BibNumber: BibNumber) => void;
    initialBibNumber: BibNumber;
};

export const BibNumberForm = ({ onReject, onResolve, initialBibNumber }: BibNumberFormProps) => {
    const t = useTranslations();
    return (
        <Form<BibNumber> validationSchema={bibNumberSchema} initialValues={initialBibNumber} onSubmit={onResolve}>
            <div className="flex">
                <FormInput<BibNumber, "number">
                    label={t("pages.bibNumbers.form.number.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.bibNumbers.form.number.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="number"
                />
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button type="submit">{t("shared.save")}</Button>
            </div>
        </Form>
    );
};
