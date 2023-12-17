import { Button } from "../../button";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { PoorSelect } from "../../poor-select";
import { PoorTimepicker } from "../../poor-timepicker";
import { trpc } from "trpc-core";
import { playerPromotionSchema } from "modules/player/models";
import { useTranslations } from "next-intl";
import { Form, FormInput } from "form";
import { PoorCombo } from "../../poor-combo";

type PlayerPromotion = AppRouterInputs["player"]["promoteRegistration"]["player"];

type PlayerPromotionFormProps = {
    isLoading: boolean;
    bibNumbers: string[];
    onReject: () => void;
    onResolve: (player: PlayerPromotion) => void;
    initialPlayerPromotion: PlayerPromotion;
    classifications: AppRouterOutputs["classification"]["classifications"];
};

const PlayerRegistrationPromotionForm = ({
    isLoading,
    bibNumbers,
    onReject,
    onResolve,
    initialPlayerPromotion,
    classifications,
}: PlayerPromotionFormProps) => {
    const t = useTranslations();

    return (
        <Form<PlayerPromotion> initialValues={initialPlayerPromotion} validationSchema={playerPromotionSchema} onSubmit={onResolve}>
            <div className="flex flex-col">
                <div className="flex">
                    <FormInput<PlayerPromotion, "classificationId">
                        label={t("pages.playerRegistrations.promoteToPlayer.form.classification.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorSelect
                                initialValue={value}
                                placeholder={t("pages.playerRegistrations.promoteToPlayer.form.classification.placeholder")}
                                items={classifications}
                                nameKey="name"
                                valueKey="id"
                                onChange={onChange}
                            />
                        )}
                        name="classificationId"
                    />
                    <div className="p-2"></div>
                    <FormInput<PlayerPromotion, "bibNumber">
                        label={t("pages.playerRegistrations.promoteToPlayer.form.bibNumber.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorCombo
                                initialValue={value}
                                placeholder={t("pages.playerRegistrations.promoteToPlayer.form.bibNumber.placeholder")}
                                items={bibNumbers}
                                onChange={onChange}
                            />
                        )}
                        name="bibNumber"
                    />
                </div>
                <div className="flex">
                    <FormInput<PlayerPromotion, "startTime">
                        label={t("pages.playerRegistrations.promoteToPlayer.form.startTime.label")}
                        className="flex-1"
                        render={({ value, onChange }) => <PoorTimepicker value={value} onChange={onChange} />}
                        name="startTime"
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

type PlayerPromotionProps = {
    onReject: () => void;
    onResolve: (player: PlayerPromotion) => void;
    raceId: number;
    playerRegistrationId: number;
};

export const PlayerRegistrationPromotion = ({ raceId, playerRegistrationId, onReject, onResolve }: PlayerPromotionProps) => {
    const { data: classifications } = trpc.classification.classifications.useQuery({ raceId });
    const { data: initialBibNumber } = trpc.player.lastAvailableBibNumber.useQuery({ raceId });
    const { data: initialStartTime } = trpc.player.lastAvailableStartTime.useQuery({ raceId });
    const { data: bibNumbers } = trpc.bibNumber.availableNumbers.useQuery({ raceId });
    const promotePlayerRegistration = trpc.player.promoteRegistration.useMutation();

    const utils = trpc.useUtils();
    if (!classifications || !bibNumbers) return;

    const initialPlayerPromotion: PlayerPromotion = {
        classificationId: classifications[0]!.id,
        bibNumber: initialBibNumber ?? "0",
        startTime: initialStartTime,
    };

    const promoteToPlayer = async (player: PlayerPromotion) => {
        await promotePlayerRegistration.mutateAsync({ raceId: raceId, registrationId: playerRegistrationId, player });

        onResolve(player);

        void utils.player.lastAvailableBibNumber.invalidate({ raceId: raceId });
        void utils.player.lastAvailableStartTime.invalidate({ raceId: raceId });
    };

    return (
        <PlayerRegistrationPromotionForm
            isLoading={promotePlayerRegistration.isLoading}
            onReject={onReject}
            onResolve={promoteToPlayer}
            classifications={classifications}
            initialPlayerPromotion={initialPlayerPromotion}
            bibNumbers={bibNumbers}
        />
    );
};
