import { Form, FormInput } from "src/components/form";
import { PoorButton } from "../../poor-button";
import { PoorInput } from "../../poor-input";
import type { AppRouterInputs } from "src/trpc";
import { classificationSchema } from "src/modules/classification/models";
import { useTranslations } from "next-intl";
type Classification = AppRouterInputs["classification"]["add"];

type ClassificationFormProps = {
    onReject: () => void;
    onResolve: (classification: Classification) => void;
    initialClassification: Classification;
    isLoading: boolean;
};

export const ClassificationForm = ({ onReject, onResolve, initialClassification, isLoading }: ClassificationFormProps) => {
    const t = useTranslations();

    return (
        <Form<Classification> initialValues={initialClassification} validationSchema={classificationSchema} onSubmit={onResolve}>
            <div className="flex flex-col">
                <FormInput<Classification, "name">
                    label={t("pages.classifications.form.name.label")}
                    description={t("pages.classifications.form.name.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.classifications.form.name.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="name"
                />
                <div className="mt-4 flex justify-between">
                    <PoorButton onClick={onReject} outline>
                        {t("shared.cancel")}
                    </PoorButton>
                    <PoorButton loading={isLoading} type="submit">
                        {t("shared.save")}
                    </PoorButton>
                </div>
            </div>
        </Form>
    );
};
