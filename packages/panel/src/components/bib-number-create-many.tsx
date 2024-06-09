import { Form, FormInput, SmallFormInput } from "src/components/form";
import { addRangeBibNumberSchema } from "src/modules/bib-number/models";
import { useTranslations } from "next-intl";
import type { AppRouterInputs } from "src/trpc";
import { trpc } from "src/trpc-core";
import { PoorButton } from "./poor-button";
import { PoorCheckbox } from "./poor-checkbox";
import { PoorNumberInput } from "./poor-number-input";

type CreateManyBibNumbers = AppRouterInputs["bibNumber"]["addRange"];

type BibNumberFormProps = {
    onReject: () => void;
    onResolve: (result: CreateManyBibNumbers) => void;
    initialConfig: CreateManyBibNumbers;
};

export const BibNumberCreateManyForm = ({ onReject, onResolve, initialConfig }: BibNumberFormProps) => {
    const addRangeBibNumberMutation = trpc.bibNumber.addRange.useMutation();
    const t = useTranslations();

    const saveChanges = async (createManyBibNumbers: CreateManyBibNumbers) => {
        await addRangeBibNumberMutation.mutateAsync(createManyBibNumbers);
        onResolve(createManyBibNumbers);
    };

    return (
        <Form<CreateManyBibNumbers> initialValues={initialConfig} validationSchema={addRangeBibNumberSchema} onSubmit={saveChanges}>
            <div className="flex">
                <SmallFormInput<CreateManyBibNumbers, "startNumber">
                    label={t("pages.bibNumbers.createMany.form.startNumber.label")}
                    className="flex-grow"
                    render={({ value, onChange }) => (
                        <PoorNumberInput
                            placeholder={t("pages.bibNumbers.createMany.form.startNumber.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="startNumber"
                />
                <div className="p-2"></div>
                <SmallFormInput<CreateManyBibNumbers, "endNumber">
                    label={t("pages.bibNumbers.createMany.form.endNumber.label")}
                    className="flex-grow"
                    render={({ value, onChange }) => (
                        <PoorNumberInput
                            placeholder={t("pages.bibNumbers.createMany.form.endNumber.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="endNumber"
                />
            </div>
            <div className="p-2"></div>
            <FormInput<CreateManyBibNumbers, "omitDuplicates">
                label={t("pages.bibNumbers.createMany.form.omitDuplicates.label")}
                description={t("pages.bibNumbers.createMany.form.omitDuplicates.description")}
                render={({ value, onChange }) => (
                    <PoorCheckbox label={t("pages.bibNumbers.createMany.form.omitDuplicates.label")} value={value} onChange={onChange} />
                )}
                name="omitDuplicates"
            />

            <div className="mt-4 flex justify-between">
                <PoorButton onClick={onReject} outline>
                    {t("shared.cancel")}
                </PoorButton>
                <PoorButton loading={addRangeBibNumberMutation.isLoading} type="submit">
                    {t("shared.save")}
                </PoorButton>
            </div>
        </Form>
    );
};
