import { Button } from "../../button";
import { PoorInput } from "../../poor-input";
import type { AppRouterInputs } from "trpc";
import { Form, FormInput } from "form";
import { apiKeySchema } from "modules/api-key/models";
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
                    className="grow"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.settings.apiKeys.form.name.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="name"
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
