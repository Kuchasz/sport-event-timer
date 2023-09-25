import { Button } from "../../button";
import { PoorInput } from "../../poor-input";
import { AppRouterInputs } from "trpc";
import { PoorCheckbox } from "../../poor-checkbox";
import { Form, FormInput } from "form";
import { timingPointAccessUrlSchema } from "modules/timing-point/models";
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
            validationSchema={timingPointAccessUrlSchema}
        >
            <div className="flex">
                <FormInput<TimingPointAccessUrl, "name">
                    label={t('pages.timingPoints.accessUrls.form.name.label')}
                    className="grow"
                    render={({ value, onChange }) => <PoorInput placeholder={t('pages.timingPoints.accessUrls.form.name.placeholder')} value={value} onChange={onChange} />}
                    name="name"
                />
            </div>
            <div className="flex">
                <FormInput<TimingPointAccessUrl, "code">
                    label={t('pages.timingPoints.accessUrls.form.code.name')}
                    className="grow"
                    render={({ value, onChange }) => <PoorInput placeholder={t('pages.timingPoints.accessUrls.form.code.placeholder')} value={value} onChange={onChange} />}
                    name="code"
                />
            </div>
            <div className="flex">
                <FormInput<TimingPointAccessUrl, "canAccessOthers">
                    label={t('pages.timingPoints.accessUrls.form.canAccessOthers.label')}
                    render={({ value, onChange }) => <PoorCheckbox value={value} onChange={onChange} />}
                    name="canAccessOthers"
                />
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button loading={isLoading} type="submit">{t("shared.save")}</Button>
            </div>
        </Form>
    );
};
