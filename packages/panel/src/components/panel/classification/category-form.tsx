import { Button } from "../../button";
import { PoorInput } from "../../poor-input";
import type { AppRouterInputs } from "src/trpc";
import { PoorNumberInput } from "../../poor-number-input";
import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import { categorySchema } from "src/modules/classification/models";
import { Form, FormInput } from "src/form";
import { useTranslations } from "next-intl";
import { PoorCheckbox } from "src/components/poor-checkbox";

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
                    <RadioGroup value={value} onChange={e => onChange({ target: { value: e } })}>
                        <RadioGroup.Option value={null}>
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer rounded-md p-1 text-xs", { ["bg-blue-200"]: checked })}>
                                    {t("pages.classifications.categories.form.gender.kind.any")}
                                </span>
                            )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="male">
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer rounded-md p-1 text-xs", { ["bg-blue-200"]: checked })}>
                                    {t("pages.classifications.categories.form.gender.kind.male")}
                                </span>
                            )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="female">
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer rounded-md p-1 text-xs", { ["bg-blue-200"]: checked })}>
                                    {t("pages.classifications.categories.form.gender.kind.female")}
                                </span>
                            )}
                        </RadioGroup.Option>
                    </RadioGroup>
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
