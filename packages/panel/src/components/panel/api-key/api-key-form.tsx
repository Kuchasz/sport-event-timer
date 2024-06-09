import { PoorButton } from "../../poor-button";
import { PoorInput } from "../../poor-input";
import type { AppRouterInputs } from "src/trpc";
import { Form, FormInput } from "src/components/form";
import { apiKeySchema } from "src/modules/api-key/models";
import { useTranslations } from "next-intl";

type ApiKey = AppRouterInputs["apiKey"]["addApiKey"]["key"];

type ApiKeyFormProps = {
    onReject: () => void;
    onResolve: (apiKey: ApiKey) => void;
    initialApiKey: ApiKey;
    isLoading: boolean;
};

export const ApiKeyForm = ({ onReject, onResolve, initialApiKey, isLoading }: ApiKeyFormProps) => {
    const t = useTranslations();
    return (
        <Form<ApiKey> initialValues={initialApiKey} validationSchema={apiKeySchema} onSubmit={onResolve}>
            <div className="flex">
                <FormInput<ApiKey, "name">
                    label={t("pages.settings.apiKeys.form.name.label")}
                    description={t("pages.settings.apiKeys.form.name.description")}
                    className="grow"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.settings.apiKeys.form.name.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="name"
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
