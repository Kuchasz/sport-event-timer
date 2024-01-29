import { Button } from "../../button";
import { PoorInput } from "../../poor-input";
import type { AppRouterInputs } from "trpc";
import { Form, FormInput } from "form";
import { type TimingPointType, timingPointSchema } from "modules/timing-point/models";
import { useTranslations } from "next-intl";
import { PoorNumberInput } from "components/poor-number-input";

type TimingPoint = AppRouterInputs["timingPoint"]["update"];

type TimingPointFormProps = {
    onReject?: () => void;
    onResolve: (timingPoint: TimingPoint) => void;
    initialTimingPoint: TimingPoint;
    isLoading: boolean;
    timingPointType: TimingPointType;
};

export const TimingPointForm = ({ onReject, onResolve, initialTimingPoint, isLoading, timingPointType }: TimingPointFormProps) => {
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
                <FormInput<TimingPoint, "shortName">
                    label={t("pages.timingPoints.form.shortName.label")}
                    description={t("pages.timingPoints.form.shortName.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.timingPoints.form.shortName.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="shortName"
                />
            </div>
            {timingPointType === "checkpoint" && (
                <div className="flex">
                    <FormInput<TimingPoint, "laps">
                        label={t("pages.timingPoints.form.laps.label")}
                        description={t("pages.timingPoints.form.laps.description")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorNumberInput
                                placeholder={t("pages.timingPoints.form.laps.placeholder")}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                        name="laps"
                    />
                </div>
            )}
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
                    <Button onClick={onReject} outline>
                        {t("shared.cancel")}
                    </Button>
                ) : (
                    <div></div>
                )}
                <Button loading={isLoading} type="submit">
                    {t("shared.save")}
                </Button>
            </div>
        </Form>
    );
};
