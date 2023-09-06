import { Button } from "./button";
import { AppRouterInputs } from "trpc";
import { PoorDatepicker } from "./poor-datepicker";
import { PoorInput } from "./poor-input";
import { countryCodes } from "contry-codes";
import { PoorSelect } from "./poor-select";
import { useCurrentRaceId } from "hooks";
import { genders } from "@set/utils/dist/gender";
import { Form, FormInput } from "form";
import { PoorCombo } from "./poor-combo";
import { trpc } from "trpc-core";
import { playerRegistrationSchema } from "modules/player-registration/models";
import { useTranslations } from "next-intl";

type PlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];

type PlayerRegistrationFormProps = {
    onReject: () => void;
    onResolve: (player: PlayerRegistration) => void;
    initialPlayerRegistration: PlayerRegistration;
};

export const PlayerRegistrationFormNew = ({ onReject, onResolve, initialPlayerRegistration }: PlayerRegistrationFormProps) => {
    const raceId = useCurrentRaceId();
    const { data: teams } = trpc.playerRegistration.teams.useQuery({ raceId: Number(raceId) }, { enabled: !!raceId, initialData: [] });
    const t = useTranslations();

    return (
        <Form<PlayerRegistration>
            initialValues={initialPlayerRegistration}
            validationSchema={playerRegistrationSchema}
            onSubmit={onResolve}
        >
            <div className="flex">
                <FormInput<PlayerRegistration, "name">
                    label={t("pages.playerRegistrations.form.name.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.playerRegistrations.form.name.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="name"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "lastName">
                    label={t("pages.playerRegistrations.form.lastName.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.playerRegistrations.form.lastName.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="lastName"
                />
            </div>
            <div className="flex">
                <FormInput<PlayerRegistration, "gender">
                    label={t("pages.playerRegistrations.form.gender.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={genders}
                            placeholder={t("pages.playerRegistrations.form.gender.placeholder")}
                            nameKey="name"
                            valueKey="value"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="gender"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "birthDate">
                    label={t("pages.playerRegistrations.form.birthDate.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorDatepicker
                            placeholder={t("pages.playerRegistrations.form.birthDate.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="birthDate"
                />
            </div>
            <div>
                <FormInput<PlayerRegistration, "team">
                    label={t("pages.playerRegistrations.form.team.label")}
                    render={({ value, onChange }) => (
                        <PoorCombo
                            placeholder={t("pages.playerRegistrations.form.team.placeholder")}
                            initialValue={value}
                            items={teams}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="team"
                />
            </div>
            <div className="flex">
                <FormInput<PlayerRegistration, "country">
                    label={t("pages.playerRegistrations.form.country.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={countryCodes}
                            nameKey="name_en"
                            placeholder={t("pages.playerRegistrations.form.country.placeholder")}
                            valueKey="code"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="country"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "city">
                    label={t("pages.playerRegistrations.form.city.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.playerRegistrations.form.city.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="city"
                />
            </div>
            <div className="flex">
                <FormInput<PlayerRegistration, "email">
                    label={t("pages.playerRegistrations.form.email.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.playerRegistrations.form.email.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="email"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "phoneNumber">
                    label={t("pages.playerRegistrations.form.phoneNumber.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.playerRegistrations.form.phoneNumber.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="phoneNumber"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "icePhoneNumber">
                    label={t("pages.playerRegistrations.form.icePhoneNumber.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.playerRegistrations.form.icePhoneNumber.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="icePhoneNumber"
                />
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button type="submit">{t("shared.save")}</Button>
            </div>
        </Form>
    );
};
