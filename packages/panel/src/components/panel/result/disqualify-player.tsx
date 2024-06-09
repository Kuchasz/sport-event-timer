import { PoorButton } from "src/components/poor-button";
import { PoorCombo } from "src/components/poor-combo";
import { Form, FormInput } from "src/components/form";
import { disqualificationReasons, disqualificationSchema } from "src/modules/disqualification/models";
import { useTranslations } from "next-intl";
import type { AppRouterInputs } from "src/trpc";
import { trpc } from "src/trpc-core";

type Disqualification = AppRouterInputs["disqualification"]["disqualify"];

type ApplyDisqualificationProps = {
    onResolve: (penalty: Disqualification) => void;
    onReject: () => void;
    raceId: number;
    bibNumber: string;
};

export const DisqualifyPlayer = ({ raceId, bibNumber, onReject, onResolve }: ApplyDisqualificationProps) => {
    const disqualifyMutation = trpc.disqualification.disqualify.useMutation();
    const reasonsTranslations = useTranslations("timeMeasurement.penalties.disqualification.disqualificationReasons");
    const reasons = disqualificationReasons.map(r => reasonsTranslations(r));

    const t = useTranslations();

    const initialDisqualification: Disqualification = {
        bibNumber,
        raceId,
        reason: "",
    };

    const applyDisqualification = async (Disqualification: Disqualification) => {
        const disqualification = await disqualifyMutation.mutateAsync(Disqualification);
        onResolve(disqualification);
    };

    return (
        <Form<Disqualification>
            initialValues={initialDisqualification}
            validationSchema={disqualificationSchema}
            onSubmit={applyDisqualification}>
            <div className="flex flex-col">
                <FormInput<Disqualification, "reason">
                    label={t("pages.result.disqualify.form.reason.label")}
                    description={t("pages.result.disqualify.form.reason.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorCombo
                            initialValue={value}
                            placeholder={t("pages.result.disqualify.form.reason.placeholder")}
                            items={reasons}
                            onChange={onChange}
                        />
                    )}
                    name="reason"
                />

                <div className="mt-4 flex justify-between">
                    <PoorButton onClick={onReject} outline>
                        {t("shared.cancel")}
                    </PoorButton>
                    <PoorButton loading={disqualifyMutation.isLoading} type="submit">
                        {t("shared.save")}
                    </PoorButton>
                </div>
            </div>
        </Form>
    );
};
