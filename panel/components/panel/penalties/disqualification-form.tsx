import { Button } from "../../button";
import { PoorFullTimepicker } from "../../poor-timepicker";
import { PoorSelect } from "../../poor-select";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { Form, FormInput } from "form";

import { PoorCombo } from "components/poor-combo";
import { useTranslations } from "next-intl";
import { disqualificationSchema } from "modules/disqualification/models";

type Disqualification = AppRouterInputs["disqualification"]["update"];

type DisqualificationFormProps = {
    onReject: () => void;
    onResolve: (disqualification: Disqualification) => void;
    initialDisqualification: Disqualification;
    bibNumbers: { id: string; name: string }[];
    raceDate: number;
    isLoading: boolean;
    timingPoints: AppRouterOutputs["timingPoint"]["timingPoints"];
};

export const DisqualificationForm = ({
    onReject,
    onResolve,
    initialDisqualification,
    bibNumbers,
    isLoading,
    timingPoints,
}: DisqualificationFormProps) => {
    const t = useTranslations();
    const reasonsTranslations = useTranslations("timeMeasurement.penalties.disqualification.disqualificationReasons");

    const reasons = Object.values(reasonsTranslations);

    return (
        <Form<Disqualification> initialValues={initialDisqualification} validationSchema={disqualificationSchema} onSubmit={onResolve}>
            <div className="flex flex-col">
                {timingPoints?.length && (
                    <FormInput<Disqualification, "bibNumber">
                        label={t("timeMeasurement.penalties.disqualification.form.timingPoint.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorSelect
                                initialValue={value}
                                items={bibNumbers}
                                placeholder={t("timeMeasurement.penalties.disqualification.form.timingPoint.placeholder")}
                                nameKey="name"
                                valueKey="id"
                                onChange={onChange}
                            />
                        )}
                        name="bibNumber"
                    />
                )}
                <div className="p-2"></div>
                <div className="flex">
                    <FormInput<Disqualification, "reason">
                        label={t("timeMeasurement.penalties.disqualification.form.bibNumber.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorCombo
                                initialValue={value}
                                placeholder={t("timeMeasurement.penalties.disqualification.form.bibNumber.placeholder")}
                                items={reasons}
                                onChange={onChange}
                            />
                        )}
                        name="reason"
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
