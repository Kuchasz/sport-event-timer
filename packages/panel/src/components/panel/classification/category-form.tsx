import { useTranslations } from "next-intl";
import { Form, FormInput } from "src/components/form";
import { PoorCheckbox } from "src/components/poor-checkbox";
import { PoorRadioGroup, PoorRadioGroupItem, PoorRadioGroupLabel, PoorRadioGroupOption } from "src/components/poor-radio-group";
import { categorySchema } from "src/modules/classification/models";
import type { AppRouterInputs } from "src/trpc";
import { PoorButton } from "../../poor-button";
import { PoorInput } from "../../poor-input";
import { PoorNumberInput } from "../../poor-number-input";

type Category = AppRouterInputs["classification"]["addCategory"];

type CategoryFormProps = {
    onReject: () => void;
    onResolve: (category: Category) => void;
    initialCategory: Category;
    isLoading: boolean;
};

export const CategoryForm = ({ onReject, onResolve, initialCategory, isLoading }: CategoryFormProps) => {
    const t = useTranslations();

    return (
        <Form<Category> initialValues={initialCategory} validationSchema={categorySchema} onSubmit={onResolve}>
            <FormInput<Category, "name">
                label={t("pages.classifications.categories.form.name.label")}
                description={t("pages.classifications.categories.form.name.description")}
                render={({ value, onChange }) => (
                    <PoorInput
                        placeholder={t("pages.classifications.categories.form.name.placeholder")}
                        value={value}
                        onChange={onChange}
                    />
                )}
                name="name"
            />
            <div className="p-2"></div>
            <FormInput<Category, "abbrev">
                label={t("pages.classifications.categories.form.abbrev.label")}
                description={t("pages.classifications.categories.form.abbrev.description")}
                render={({ value, onChange }) => (
                    <PoorInput
                        placeholder={t("pages.classifications.categories.form.name.placeholder")}
                        value={value}
                        onChange={onChange}
                    />
                )}
                name="abbrev"
            />
            <div className="p-2"></div>
            <FormInput<Category, "minAge">
                className="grow basis-full"
                label={t("pages.classifications.categories.form.minAge.label")}
                description={t("pages.classifications.categories.form.minAge.description")}
                render={({ value, onChange }) => (
                    <PoorNumberInput
                        placeholder={t("pages.classifications.categories.form.minAge.placeholder")}
                        value={value}
                        onChange={onChange}
                    />
                )}
                name="minAge"
            />
            <div className="p-2"></div>
            <FormInput<Category, "maxAge">
                className="grow basis-full"
                label={t("pages.classifications.categories.form.maxAge.label")}
                description={t("pages.classifications.categories.form.maxAge.description")}
                render={({ value, onChange }) => (
                    <PoorNumberInput
                        placeholder={t("pages.classifications.categories.form.maxAge.placeholder")}
                        value={value}
                        onChange={onChange}
                    />
                )}
                name="maxAge"
            />
            <div className="p-2"></div>
            <FormInput<Category, "gender">
                className="grow basis-full"
                label={t("pages.classifications.categories.form.gender.label")}
                description={t("pages.classifications.categories.form.gender.description")}
                render={({ value, onChange }) => (
                    <PoorRadioGroup value={value} onChange={e => onChange({ target: { value: e.target.value } })}>
                        <PoorRadioGroupItem>
                            <PoorRadioGroupOption value={undefined}></PoorRadioGroupOption>
                            <PoorRadioGroupLabel>{t("pages.classifications.categories.form.gender.kind.any")}</PoorRadioGroupLabel>
                        </PoorRadioGroupItem>
                        <PoorRadioGroupItem>
                            <PoorRadioGroupOption value="male"></PoorRadioGroupOption>
                            <PoorRadioGroupLabel>{t("pages.classifications.categories.form.gender.kind.male")}</PoorRadioGroupLabel>
                        </PoorRadioGroupItem>
                        <PoorRadioGroupItem>
                            <PoorRadioGroupOption value="female"></PoorRadioGroupOption>
                            <PoorRadioGroupLabel>{t("pages.classifications.categories.form.gender.kind.female")}</PoorRadioGroupLabel>
                        </PoorRadioGroupItem>
                    </PoorRadioGroup>
                )}
                name="gender"
            />
            <div className="p-2"></div>
            <FormInput<Category, "isSpecial">
                label={t("pages.classifications.categories.form.isSpecial.label")}
                description={t("pages.classifications.categories.form.isSpecial.description")}
                className="flex-1"
                render={({ value, onChange }) => (
                    <PoorCheckbox label={t("pages.classifications.categories.form.isSpecial.label")} value={value} onChange={onChange} />
                )}
                name="isSpecial"
            />
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
