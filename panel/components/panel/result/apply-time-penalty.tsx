import type { AppRouterInputs } from "trpc";
import { Form, FormInput } from "form";
import { useTranslations } from "next-intl";
import { Button } from "components/button";
import { trpc } from "trpc-core";
import { timePenaltySchema } from "modules/time-penalty/models";
import { PoorNumberInput } from "components/poor-number-input";
import { PoorInput } from "components/poor-input";

type TimePenalty = AppRouterInputs["timePenalty"]["applyPenalty"];

type ApplyTimePenaltyProps = {
    onResolve: (penalty: TimePenalty) => void;
    onReject: () => void;
    raceId: number;
    bibNumber: string;
};

export const ApplyTimePenalty = ({ raceId, bibNumber, onReject, onResolve }: ApplyTimePenaltyProps) => {
    const applyTimePenaltyMutation = trpc.timePenalty.applyPenalty.useMutation();
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
            <div className="flex flex-col">
                <FormInput<TimePenalty, "time">
                    label={t("pages.result.applyTimePenalty.form.time.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorNumberInput
                            value={value}
                            placeholder={t("pages.result.applyTimePenalty.form.time.placeholder")}
                            onChange={e => onChange({ target: { value: e.target.value ?? 0 } })}
                        />
                    )}
                    name="time"
                />
                <div className="p-2"></div>
                <div className="flex">
                    <FormInput<TimePenalty, "reason">
                        label={t("pages.result.applyTimePenalty.form.reason.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorInput
                                value={value}
                                placeholder={t("pages.result.applyTimePenalty.form.reason.placeholder")}
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
                    <Button loading={applyTimePenaltyMutation.isLoading} type="submit">
                        {t("shared.save")}
                    </Button>
                </div>
            </div>
        </Form>
    );
};
