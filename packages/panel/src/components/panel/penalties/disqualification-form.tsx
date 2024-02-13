import { PoorCombo } from "src/components/poor-combo";
import { Form, FormInput } from "src/form";
import { disqualificationReasons, disqualificationSchema } from "src/modules/disqualification/models";
import { useTranslations } from "next-intl";
import type { AppRouterInputs } from "src/trpc";
import { Button } from "../../button";
import { PoorSelect } from "../../poor-select";

type Disqualification = AppRouterInputs["disqualification"]["update"];

type DisqualificationFormProps = {
    onReject: () => void;
    onResolve: (disqualification: Disqualification) => void;
    initialDisqualification: Disqualification;
    bibNumbers: string[];
    isLoading: boolean;
};

export const DisqualificationForm = ({
    onReject,
    onResolve,
    initialDisqualification,
    bibNumbers,
    isLoading,
}: DisqualificationFormProps) => {
    const reasonsTranslations = useTranslations("timeMeasurement.penalties.disqualification.disqualificationReasons");
    const reasons = disqualificationReasons.map(r => reasonsTranslations(r));

    const t = useTranslations();

    const bibNumbersPositions = bibNumbers.map(b => ({ name: b, id: b }));

    return (
        <Form<Disqualification> initialValues={initialDisqualification} validationSchema={disqualificationSchema} onSubmit={onResolve}>
            <div className="flex flex-col">
                {bibNumbersPositions.length && (
                    <FormInput<Disqualification, "bibNumber">
                        label={t("timeMeasurement.penalties.disqualification.form.bibNumber.label")}
                        description={t("timeMeasurement.penalties.disqualification.form.bibNumber.description")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorSelect
                                initialValue={value}
                                items={bibNumbersPositions}
                                placeholder={t("timeMeasurement.penalties.disqualification.form.bibNumber.placeholder")}
                                nameKey="name"
                                valueKey="id"
                                onChange={onChange}
                            />
                        )}
                        name="bibNumber"
                    />
                )}
                <div className="flex">
                    <FormInput<Disqualification, "reason">
                        label={t("timeMeasurement.penalties.disqualification.form.reason.label")}
                        description={t("timeMeasurement.penalties.disqualification.form.reason.description")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorCombo
                                initialValue={value}
                                placeholder={t("timeMeasurement.penalties.disqualification.form.reason.placeholder")}
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
