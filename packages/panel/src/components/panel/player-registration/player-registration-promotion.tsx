import { PoorButton } from "../../poor-button";
import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { PoorSelect } from "../../poor-select";
import { PoorTimepicker } from "../../poor-timepicker";
import { trpc } from "src/trpc-core";
import { playerPromotionSchema } from "src/modules/player/models";
import { useTranslations } from "next-intl";
import { Form, FormInput } from "src/components/form";
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
            <FormInput<PlayerPromotion, "classificationId">
                label={t("pages.playerRegistrations.promoteToPlayer.form.classification.label")}
                description={t("pages.playerRegistrations.promoteToPlayer.form.classification.description")}
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
                description={t("pages.playerRegistrations.promoteToPlayer.form.bibNumber.description")}
                className="flex-1"
                render={({ value, onChange }) => (
                    <PoorCombo
                        initialValue={value}
                        placeholder={t("pages.playerRegistrations.promoteToPlayer.form.bibNumber.placeholder")}
                        items={bibNumbers}
                        onChange={onChange}
                        allowCustomValue
                        notFoundMessage={t("pages.playerRegistrations.promoteToPlayer.form.bibNumber.notFoundMessage")}
                    />
                )}
                name="bibNumber"
            />
            <div className="p-2"></div>
            <FormInput<PlayerPromotion, "startTime">
                label={t("pages.playerRegistrations.promoteToPlayer.form.startTime.label")}
                description={t("pages.playerRegistrations.promoteToPlayer.form.startTime.description")}
                className="flex-1"
                render={({ value, onChange }) => <PoorTimepicker value={value} onChange={onChange} />}
                name="startTime"
            />

            <div className="mt-4 flex justify-between">
                <PoorButton onClick={onReject} outline>
                    {t("shared.cancel")}
                </PoorButton>
                <PoorButton loading={isLoading} type="submit">
                    {t("shared.save")}
                </PoorButton>
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
    const promotePlayerRegistrationMutation = trpc.player.promoteRegistration.useMutation();

    const utils = trpc.useUtils();
    if (!classifications || !bibNumbers) return;

    const initialPlayerPromotion: PlayerPromotion = {
        classificationId: classifications[0]!.id,
        bibNumber: initialBibNumber ?? "0",
        startTime: initialStartTime,
    };

    const promoteToPlayer = async (player: PlayerPromotion) => {
        await promotePlayerRegistrationMutation.mutateAsync({ raceId: raceId, registrationId: playerRegistrationId, player });

        onResolve(player);

        void utils.player.lastAvailableBibNumber.invalidate({ raceId: raceId });
        void utils.player.lastAvailableStartTime.invalidate({ raceId: raceId });
    };

    return (
        <PlayerRegistrationPromotionForm
            isLoading={promotePlayerRegistrationMutation.isPending}
            onReject={onReject}
            onResolve={promoteToPlayer}
            classifications={classifications}
            initialPlayerPromotion={initialPlayerPromotion}
            bibNumbers={bibNumbers}
        />
    );
};
