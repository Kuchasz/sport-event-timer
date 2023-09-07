import { Button } from "./button";
import { PoorInput } from "./poor-input";
import { AppRouterInputs } from "trpc";
import { Form, FormInput } from "form";
import { apiKeySchema } from "modules/api-key/models";
import { useTranslations } from "next-intl";

type ApiKey = AppRouterInputs["apiKey"]["addApiKey"]["key"];

type ApiKeyFormProps = {
    onReject: () => void;
    onResolve: (apiKey: ApiKey) => void;
    initialApiKey: ApiKey;
};

export const ApiKeyForm = ({ onReject, onResolve, initialApiKey }: ApiKeyFormProps) => {
    const t = useTranslations();
    return (
        <Form<ApiKey> onSubmit={onResolve} initialValues={initialApiKey} validationSchema={apiKeySchema}>
            <div className="flex">
                <FormInput<ApiKey, "name">
                    label={t("pages.settings.apiKeys.form.name.label")}
                    className="grow"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.settings.apiKeys.form.name.placeholder")}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                    name="name"
                />
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} className="ml-2">
                    {t("shared.cancel")}
                </Button>
                <Button type="submit">{t("shared.save")}</Button>
            </div>
        </Form>
    );
};
