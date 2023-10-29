import { Button } from "../../button";
import { PoorFullTimepicker } from "../../poor-timepicker";
import { PoorSelect } from "../../poor-select";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { Form, FormInput } from "form";
import { splitTimeSchema } from "modules/split-time/models";
import { PoorCombo } from "components/poor-combo";
import { useTranslations } from "next-intl";

type SplitTime = AppRouterInputs["splitTime"]["update"];

type SplitTimeFormProps = {
    onReject: () => void;
    onResolve: (splitTime: SplitTime) => void;
    initialSplitTime: SplitTime;
    bibNumbers: string[];
    raceDate: number;
    isLoading: boolean;
    timingPoints: AppRouterOutputs["timingPoint"]["timingPoints"];
};

export const SplitTimeForm = ({
    onReject,
    onResolve,
    initialSplitTime,
    bibNumbers,
    isLoading,
    raceDate,
    timingPoints,
}: SplitTimeFormProps) => {
    const t = useTranslations();

    return (
        <Form<SplitTime> initialValues={initialSplitTime} validationSchema={splitTimeSchema} onSubmit={onResolve}>
            <div className="flex flex-col">
                {timingPoints?.length && (
                    <FormInput<SplitTime, "timingPointId">
                        label={t("pages.splitTimes.form.timingPoint.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorSelect
                                initialValue={value}
                                items={timingPoints}
                                placeholder={t("pages.splitTimes.form.timingPoint.placeholder")}
                                nameKey="name"
                                valueKey="id"
                                onChange={onChange}
                            />
                        )}
                        name="timingPointId"
                    />
                )}
                <div className="p-2"></div>
                <div className="flex">
                    <FormInput<SplitTime, "bibNumber">
                        label={t("pages.splitTimes.form.bibNumber.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorCombo
                                initialValue={value}
                                placeholder={t("pages.splitTimes.form.bibNumber.placeholder")}
                                items={bibNumbers}
                                onChange={onChange}
                            />
                        )}
                        name="bibNumber"
                    />
                    <div className="p-2"></div>
                    <FormInput<SplitTime, "time">
                        label={t("pages.splitTimes.form.time.label")}
                        className="flex-1"
                        render={({ value, onChange }) => <PoorFullTimepicker date={raceDate} value={value} onChange={onChange} />}
                        name="time"
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
            </div>
        </Form>
    );
};
