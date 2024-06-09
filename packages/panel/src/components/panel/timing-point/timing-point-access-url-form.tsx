import { PoorButton } from "../../poor-button";
import { PoorInput } from "../../poor-input";
import type { AppRouterInputs } from "src/trpc";
import { PoorCheckbox } from "../../poor-checkbox";
import { Form, FormInput } from "src/components/form";
import { timingPointAccessUrlSchema } from "src/modules/timing-point/models";
import { useTranslations } from "next-intl";

type TimingPointAccessUrl = AppRouterInputs["timingPoint"]["addTimingPointAccessUrl"];

type TimingPointAccessKeyProps = {
    onReject: () => void;
    onResolve: (timingPoint: TimingPointAccessUrl) => void;
    initialTimingPointAccessUrl: TimingPointAccessUrl;
    isLoading: boolean;
};

export const TimingPointAccessUrlForm = ({ onReject, onResolve, initialTimingPointAccessUrl, isLoading }: TimingPointAccessKeyProps) => {
    const t = useTranslations();
    return (
        <Form<TimingPointAccessUrl>
            initialValues={initialTimingPointAccessUrl}
            onSubmit={onResolve}
            validationSchema={timingPointAccessUrlSchema}>
            <FormInput<TimingPointAccessUrl, "name">
                label={t("pages.timingPoint.sections.accessUrls.form.name.label")}
                description={t("pages.timingPoint.sections.accessUrls.form.name.description")}
                className="grow"
                render={({ value, onChange }) => (
                    <PoorInput
                        placeholder={t("pages.timingPoint.sections.accessUrls.form.name.placeholder")}
                        value={value}
                        onChange={onChange}
                    />
                )}
                name="name"
            />
            <div className="p-2"></div>
            <FormInput<TimingPointAccessUrl, "code">
                label={t("pages.timingPoint.sections.accessUrls.form.code.label")}
                description={t("pages.timingPoint.sections.accessUrls.form.code.description")}
                className="grow"
                render={({ value, onChange }) => (
                    <PoorInput
                        placeholder={t("pages.timingPoint.sections.accessUrls.form.code.placeholder")}
                        value={value}
                        onChange={onChange}
                    />
                )}
                name="code"
            />
            <div className="p-2"></div>
            <FormInput<TimingPointAccessUrl, "canAccessOthers">
                label={t("pages.timingPoint.sections.accessUrls.form.canAccessOthers.label")}
                description={t("pages.timingPoint.sections.accessUrls.form.canAccessOthers.description")}
                render={({ value, onChange }) => (
                    <PoorCheckbox
                        label={t("pages.timingPoint.sections.accessUrls.form.canAccessOthers.label")}
                        value={value}
                        onChange={onChange}
                    />
                )}
                name="canAccessOthers"
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
