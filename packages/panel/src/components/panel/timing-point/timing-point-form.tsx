import { useTranslations } from "next-intl";
import { Form, FormInput } from "src/components/form";
import { timingPointSchema } from "src/modules/timing-point/models";
import type { AppRouterInputs } from "src/trpc";
import { PoorButton } from "../../poor-button";
import { PoorInput } from "../../poor-input";
type TimingPoint = AppRouterInputs["timingPoint"]["update"];

type TimingPointFormProps = {
    onReject?: () => void;
    onResolve: (timingPoint: TimingPoint) => void;
    initialTimingPoint: TimingPoint;
    isLoading: boolean;
};

export const TimingPointForm = ({ onReject, onResolve, initialTimingPoint, isLoading }: TimingPointFormProps) => {
    const t = useTranslations();
    return (
        <Form<TimingPoint> initialValues={initialTimingPoint} onSubmit={onResolve} validationSchema={timingPointSchema}>
            <div className="flex">
                <FormInput<TimingPoint, "name">
                    label={t("pages.timingPoints.form.name.label")}
                    description={t("pages.timingPoints.form.name.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.timingPoints.form.name.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="name"
                />
            </div>
            <div className="flex">
                <FormInput<TimingPoint, "abbrev">
                    label={t("pages.timingPoints.form.abbrev.label")}
                    description={t("pages.timingPoints.form.abbrev.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.timingPoints.form.abbrev.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="abbrev"
                />
            </div>
            <div className="flex">
                <FormInput<TimingPoint, "description">
                    label={t("pages.timingPoints.form.description.label")}
                    description={t("pages.timingPoints.form.description.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.timingPoints.form.description.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="description"
                />
            </div>
            <div className="mt-4 flex justify-between">
                {onReject ? (
                    <PoorButton onClick={onReject} outline>
                        {t("shared.cancel")}
                    </PoorButton>
                ) : (
                    <div></div>
                )}
                <PoorButton loading={isLoading} type="submit">
                    {t("shared.save")}
                </PoorButton>
            </div>
        </Form>
    );
};
