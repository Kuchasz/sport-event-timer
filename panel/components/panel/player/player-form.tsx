import { Button } from "../../button";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { PoorSelect } from "../../poor-select";
import { PoorTimepicker } from "../../poor-timepicker";
import { PoorCombo } from "../../poor-combo";
import { Form, FormInput } from "form";
import { playerSchema } from "modules/player/models";
import { useTranslations } from "next-intl";

type Player = AppRouterInputs["player"]["edit"]["player"];

type PlayerFormProps = {
    onReject: () => void;
    onResolve: (player: Player) => void;
    initialPlayer: Player;
    classifications: AppRouterOutputs["classification"]["classifications"];
    bibNumbers: string[];
    isLoading: boolean;
};

export const PlayerForm = ({ onReject, onResolve, initialPlayer, classifications, bibNumbers, isLoading }: PlayerFormProps) => {
    const t = useTranslations();

    return (
        <Form<Player> initialValues={initialPlayer} validationSchema={playerSchema} onSubmit={onResolve}>
            <FormInput<Player, "classificationId">
                label={t("pages.players.form.classification.label")}
                description={t("pages.players.form.classification.description")}
                className="flex-1"
                render={({ value, onChange }) => (
                    <PoorSelect
                        initialValue={value}
                        items={classifications}
                        placeholder={t("pages.players.form.classification.placeholder")}
                        nameKey="name"
                        valueKey="id"
                        onChange={onChange}></PoorSelect>
                )}
                name="classificationId"
            />
            <div className="p-2"></div>
            <FormInput<Player, "bibNumber">
                label={t("pages.players.form.bibNumber.label")}
                description={t("pages.players.form.bibNumber.description")}
                className="flex-1"
                render={({ value, onChange }) => (
                    <PoorCombo
                        initialValue={value}
                        placeholder={t("pages.players.form.bibNumber.placeholder")}
                        items={bibNumbers}
                        onChange={onChange}
                    />
                )}
                name="bibNumber"
            />
            <div className="p-2"></div>
            <FormInput<Player, "startTime">
                label={t("pages.players.form.startTime.label")}
                description={t("pages.players.form.startTime.description")}
                className="flex-1"
                render={({ value, onChange }) => (
                    <PoorTimepicker placeholder={t("pages.players.form.startTime.placeholder")} value={value} onChange={onChange} />
                )}
                name="startTime"
            />
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button loading={isLoading} type="submit">
                    {t("shared.save")}
                </Button>
            </div>
        </Form>
    );
};
