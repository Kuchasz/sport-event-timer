import type { AppRouterInputs } from "trpc";
import { Form, FormInput } from "form";
import { useTranslations } from "next-intl";
import { Button } from "components/button";
import { trpc } from "trpc-core";
import { PoorInput } from "components/poor-input";
import { disqualificationSchema } from "modules/disqualification/models";

type Disqualification = AppRouterInputs["disqualification"]["disqualify"];

type ApplyDisqualificationProps = {
    onResolve: (penalty: Disqualification) => void;
    onReject: () => void;
    raceId: number;
    bibNumber: string;
};

export const DisqualifyPlayer = ({ raceId, bibNumber, onReject, onResolve }: ApplyDisqualificationProps) => {
    const disqualifyMutation = trpc.disqualification.disqualify.useMutation();
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
                        <PoorInput value={value} placeholder={t("pages.result.disqualify.form.reason.placeholder")} onChange={onChange} />
                    )}
                    name="reason"
                />

                <div className="mt-4 flex justify-between">
                    <Button onClick={onReject} outline>
                        {t("shared.cancel")}
                    </Button>
                    <Button loading={disqualifyMutation.isLoading} type="submit">
                        {t("shared.save")}
                    </Button>
                </div>
            </div>
        </Form>
    );
};
