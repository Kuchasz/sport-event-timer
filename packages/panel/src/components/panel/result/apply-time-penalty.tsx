import { Button } from "src/components/button";
import { PoorCombo } from "src/components/poor-combo";
import { PoorNumberInput } from "src/components/poor-number-input";
import { Form, FormInput } from "src/form";
import { disqualificationReasons } from "src/modules/disqualification/models";
import { timePenaltySchema } from "src/modules/time-penalty/models";
import { useTranslations } from "next-intl";
import type { AppRouterInputs } from "src/trpc";
import { trpc } from "src/trpc-core";

type TimePenalty = AppRouterInputs["timePenalty"]["applyPenalty"];

type ApplyTimePenaltyProps = {
    onResolve: (penalty: TimePenalty) => void;
    onReject: () => void;
    raceId: number;
    bibNumber: string;
};

export const ApplyTimePenalty = ({ raceId, bibNumber, onReject, onResolve }: ApplyTimePenaltyProps) => {
    const applyTimePenaltyMutation = trpc.timePenalty.applyPenalty.useMutation();
    const reasonsTranslations = useTranslations("timeMeasurement.penalties.timePenalty.timePenaltyReasons");
    const reasons = disqualificationReasons.map(r => reasonsTranslations(r));

    const t = useTranslations();

    const initialTimePenalty: TimePenalty = {
        bibNumber,
        raceId,
        reason: "",
        time: 0,
    };

    const applyTimePenalty = async (timePenalty: TimePenalty) => {
        const penalty = await applyTimePenaltyMutation.mutateAsync(timePenalty);
        onResolve(penalty);
    };

    return (
        <Form<TimePenalty> initialValues={initialTimePenalty} validationSchema={timePenaltySchema} onSubmit={applyTimePenalty}>
            <FormInput<TimePenalty, "time">
                label={t("pages.result.applyTimePenalty.form.time.label")}
                description={t("pages.result.applyTimePenalty.form.time.description")}
                className="flex-1"
                render={({ value, onChange }) => (
                    <PoorNumberInput
                        value={value}
                        required
                        placeholder={t("pages.result.applyTimePenalty.form.time.placeholder")}
                        onChange={e => onChange({ target: { value: e.target.value ?? 0 } })}
                    />
                )}
                name="time"
            />
            <div className="p-2"></div>
            <FormInput<TimePenalty, "reason">
                label={t("pages.result.applyTimePenalty.form.reason.label")}
                description={t("pages.result.applyTimePenalty.form.reason.description")}
                className="flex-1"
                render={({ value, onChange }) => (
                    <PoorCombo
                        initialValue={value}
                        placeholder={t("pages.result.applyTimePenalty.form.reason.placeholder")}
                        items={reasons}
                        onChange={onChange}
                    />
                )}
                name="reason"
            />
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button loading={applyTimePenaltyMutation.isLoading} type="submit">
                    {t("shared.save")}
                </Button>
            </div>
        </Form>
    );
};
