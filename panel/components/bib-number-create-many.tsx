import { Button } from "./button";
import type { AppRouterInputs } from "trpc";
import { PoorNumberInput } from "./poor-number-input";
import { PoorCheckbox } from "./poor-checkbox";
import { addRangeBibNumberSchema } from "modules/bib-number/models";
import { Form, FormInput, FormInputInline } from "form";
import { useTranslations } from "next-intl";
import { trpc } from "trpc-core";

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
                <FormInput<CreateManyBibNumbers, "startNumber">
                    label={t("pages.bibNumbers.createMany.form.startNumber.label")}
                    render={({ value, onChange }) => (
                        <PoorNumberInput
                            placeholder={t("pages.bibNumbers.createMany.form.startNumber.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value! } })}
                        />
                    )}
                    name="startNumber"
                />

                <div className="p-2"></div>
                <FormInput<CreateManyBibNumbers, "endNumber">
                    label={t("pages.bibNumbers.createMany.form.endNumber.label")}
                    render={({ value, onChange }) => (
                        <PoorNumberInput
                            placeholder={t("pages.bibNumbers.createMany.form.endNumber.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value! } })}
                        />
                    )}
                    name="endNumber"
                />
                <div className="p-2"></div>
                <FormInputInline<CreateManyBibNumbers, "omitDuplicates">
                    label={t("pages.bibNumbers.createMany.form.omitDuplicates.label")}
                    render={({ value, onChange }) => (
                        <PoorCheckbox
                            label={t("pages.bibNumbers.createMany.form.omitDuplicates.label")}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                    name="omitDuplicates"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button loading={addRangeBibNumberMutation.isLoading} type="submit">
                    {t("shared.save")}
                </Button>
            </div>
        </Form>
    );
};
