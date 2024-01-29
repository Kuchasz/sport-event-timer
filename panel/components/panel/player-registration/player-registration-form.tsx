import { Form, SmallFormInput } from "form";
import { useCurrentRaceId } from "hooks";
import { countryCodeEnum, playerRegistrationSchema } from "modules/player-registration/models";
import { useTranslations } from "next-intl";
import type { AppRouterInputs } from "trpc";
import { trpc } from "trpc-core";
import { Button } from "../../button";
import { PoorCombo } from "../../poor-combo";
import { PoorDatepicker } from "../../poor-datepicker";
import { PoorInput } from "../../poor-input";
import { PoorSelect } from "../../poor-select";
import { genderEnum } from "modules/shared/models";

type PlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];

type PlayerRegistrationFormProps = {
    onReject: () => void;
    onResolve: (player: PlayerRegistration) => void;
    initialPlayerRegistration: PlayerRegistration;
    isLoading: boolean;
};

export const PlayerRegistrationForm = ({ onReject, onResolve, initialPlayerRegistration, isLoading }: PlayerRegistrationFormProps) => {
    const raceId = useCurrentRaceId();
    const { data: teams } = trpc.playerRegistration.teams.useQuery({ raceId: Number(raceId) }, { enabled: !!raceId, initialData: [] });
    const t = useTranslations();
    const countries = countryCodeEnum.options.map(code => ({ code, name: t(`shared.countryCodes.${code}`) }));
    const genderOptions = genderEnum.options.map(gender => ({ gender, name: t(`shared.genders.${gender}`) }));

    return (
        <Form<PlayerRegistration>
            initialValues={initialPlayerRegistration}
            validationSchema={playerRegistrationSchema}
            onSubmit={onResolve}>
            <div className="flex">
                <SmallFormInput<PlayerRegistration, "name">
                    label={t("pages.playerRegistrations.form.name.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.playerRegistrations.form.name.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="name"
                />
                <div className="p-2"></div>
                <SmallFormInput<PlayerRegistration, "lastName">
                    label={t("pages.playerRegistrations.form.lastName.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.playerRegistrations.form.lastName.placeholder")}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                    name="lastName"
                />
            </div>
            <div className="flex">
                <SmallFormInput<PlayerRegistration, "gender">
                    label={t("pages.playerRegistrations.form.gender.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={genderOptions}
                            placeholder={t("pages.playerRegistrations.form.gender.placeholder")}
                            nameKey="name"
                            valueKey="gender"
                            onChange={onChange}
                        />
                    )}
                    name="gender"
                />
                <div className="p-2"></div>
                <SmallFormInput<PlayerRegistration, "birthDate">
                    label={t("pages.playerRegistrations.form.birthDate.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorDatepicker
                            placeholder={t("pages.playerRegistrations.form.birthDate.placeholder")}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                    name="birthDate"
                />
            </div>
            <div>
                <SmallFormInput<PlayerRegistration, "team">
                    label={t("pages.playerRegistrations.form.team.label")}
                    render={({ value, onChange }) => (
                        <PoorCombo
                            placeholder={t("pages.playerRegistrations.form.team.placeholder")}
                            initialValue={value}
                            items={teams}
                            onChange={onChange}
                        />
                    )}
                    name="team"
                />
            </div>
            <div className="flex">
                <SmallFormInput<PlayerRegistration, "country">
                    label={t("pages.playerRegistrations.form.country.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={countries}
                            nameKey="name"
                            placeholder={t("pages.playerRegistrations.form.country.placeholder")}
                            valueKey="code"
                            onChange={onChange}
                        />
                    )}
                    name="country"
                />
                <div className="p-2"></div>
                <SmallFormInput<PlayerRegistration, "city">
                    label={t("pages.playerRegistrations.form.city.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.playerRegistrations.form.city.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="city"
                />
            </div>
            <div className="flex">
                <SmallFormInput<PlayerRegistration, "email">
                    label={t("pages.playerRegistrations.form.email.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.playerRegistrations.form.email.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="email"
                />
                <div className="p-2"></div>
                <SmallFormInput<PlayerRegistration, "phoneNumber">
                    label={t("pages.playerRegistrations.form.phoneNumber.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.playerRegistrations.form.phoneNumber.placeholder")}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                    name="phoneNumber"
                />
                <div className="p-2"></div>
                <SmallFormInput<PlayerRegistration, "icePhoneNumber">
                    label={t("pages.playerRegistrations.form.icePhoneNumber.label")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("pages.playerRegistrations.form.icePhoneNumber.placeholder")}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                    name="icePhoneNumber"
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
        </Form>
    );
};
