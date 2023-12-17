import { Form, FormInput } from "form";
import type { AppRouterInputs } from "trpc";
import { Button } from "../../button";
import { PoorSelect } from "../../poor-select";

import { PoorCombo } from "components/poor-combo";
import { PoorNumberInput } from "components/poor-number-input";
import { timePenaltySchema } from "modules/time-penalty/models";
import { useTranslations } from "next-intl";
import { disqualificationReasons } from "modules/disqualification/models";

type TimePenalty = AppRouterInputs["timePenalty"]["update"];

type TimePenaltyFormProps = {
    onReject: () => void;
    onResolve: (TimePenalty: TimePenalty) => void;
    initialTimePenalty: TimePenalty;
    bibNumbers: string[];
    isLoading: boolean;
};

export const TimePenaltyForm = ({ onReject, onResolve, initialTimePenalty, bibNumbers, isLoading }: TimePenaltyFormProps) => {
    const reasonsTranslations = useTranslations("timeMeasurement.penalties.timePenalty.timePenaltyReasons");
    const reasons = disqualificationReasons.map(r => reasonsTranslations(r));

    const t = useTranslations();

    const bibNumbersPositions = bibNumbers.map(b => ({ name: b, id: b }));

    return (
        <Form<TimePenalty> initialValues={initialTimePenalty} validationSchema={timePenaltySchema} onSubmit={onResolve}>
            <div className="flex flex-col">
                {bibNumbers.length && (
                    <FormInput<TimePenalty, "bibNumber">
                        label={t("timeMeasurement.penalties.timePenalty.form.bibNumber.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorSelect
                                initialValue={value}
                                items={bibNumbersPositions}
                                placeholder={t("timeMeasurement.penalties.timePenalty.form.bibNumber.placeholder")}
                                nameKey="name"
                                valueKey="id"
                                onChange={onChange}
                            />
                        )}
                        name="bibNumber"
                    />
                )}
                <div className="flex">
                    <FormInput<TimePenalty, "reason">
                        label={t("timeMeasurement.penalties.timePenalty.form.reason.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorCombo
                                initialValue={value}
                                placeholder={t("timeMeasurement.penalties.timePenalty.form.reason.placeholder")}
                                items={reasons}
                                onChange={onChange}
                            />
                        )}
                        name="reason"
                    />
                    <div className="p-2"></div>
                    <FormInput<TimePenalty, "time">
                        label={t("timeMeasurement.penalties.timePenalty.form.time.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorNumberInput
                                value={value}
                                placeholder={t("timeMeasurement.penalties.timePenalty.form.time.placeholder")}
                                onChange={e => onChange({ target: { value: e.target.value ?? 0 } })}
                            />
                        )}
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
