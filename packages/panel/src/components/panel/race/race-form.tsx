import { PoorButton } from "../../poor-button";
import { PoorUTCDatepicker } from "../../poor-datepicker";
import { PoorInput } from "../../poor-input";
import type { AppRouterInputs } from "src/trpc";
import { PoorNumberInput } from "../../poor-number-input";
import { PoorCheckbox } from "../../poor-checkbox";
import { PoorTextArea } from "../../poor-text-area";
import { sportKinds } from "@set/utils/dist/sport-kind";
import { PoorSelect } from "src/components/poor-select";
import { useLocale, useTranslations } from "next-intl";
import { Form, FormInput } from "src/components/form";
import { raceSchema } from "src/modules/race/models";
import { timeZones } from "@set/utils/dist/time-zone";
import { PoorCombo } from "src/components/poor-combo";

type Race = AppRouterInputs["race"]["add"]["race"];

type RaceFormProps = {
    onReject: () => void;
    onResolve: (race: Race) => void;
    initialRace: Race;
    isLoading: boolean;
};

export const RaceForm = ({ onReject, onResolve, initialRace, isLoading }: RaceFormProps) => {
    const sportKindTranslations = useTranslations("shared.sportKinds");
    const t = useTranslations();
    const locale = useLocale();
    const sportKindsOptions = sportKinds.map(sk => ({ name: sportKindTranslations(sk), value: sk }));

    return (
        <Form<Race> initialValues={initialRace} validationSchema={raceSchema} onSubmit={onResolve}>
            <div className="flex-grow overflow-y-scroll">
                <FormInput<Race, "name">
                    label={t("pages.races.form.name.label")}
                    description={t("pages.races.form.name.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.races.form.name.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="name"
                />
                <div className="p-2"></div>
                <FormInput<Race, "date">
                    label={t("pages.races.form.date.label")}
                    description={t("pages.races.form.date.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorUTCDatepicker
                            required
                            placeholder={t("pages.races.form.date.placeholder")}
                            value={value}
                            locale={locale}
                            onChange={onChange}
                        />
                    )}
                    name="date"
                />
                <div className="p-2"></div>
                <FormInput<Race, "sportKind">
                    label={t("pages.races.form.sportKind.label")}
                    description={t("pages.races.form.sportKind.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={sportKindsOptions}
                            placeholder={t("pages.races.form.sportKind.placeholder")}
                            nameKey="name"
                            valueKey="value"
                            onChange={onChange}
                        />
                    )}
                    name="sportKind"
                />
                <div className="p-2"></div>
                <FormInput<Race, "location">
                    label={t("pages.races.form.location.label")}
                    description={t("pages.races.form.location.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.races.form.location.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="location"
                />
                <div className="p-2"></div>
                <FormInput<Race, "timeZone">
                    label={t("pages.races.form.timeZone.label")}
                    description={t("pages.races.form.timeZone.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorCombo
                            placeholder={t("pages.races.form.timeZone.placeholder")}
                            onChange={onChange}
                            initialValue={value}
                            items={timeZones}
                            notFoundMessage={t("pages.races.form.timeZone.notFoundMessage")}
                        />
                    )}
                    name="timeZone"
                />
                <div className="p-2"></div>
                <FormInput<Race, "playersLimit">
                    label={t("pages.races.form.playersLimit.label")}
                    description={t("pages.races.form.playersLimit.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorNumberInput placeholder={t("pages.races.form.playersLimit.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="playersLimit"
                />
                <div className="p-2"></div>
                <FormInput<Race, "registrationCutoff">
                    label={t("pages.races.form.registrationCutoff.label")}
                    description={t("pages.races.form.registrationCutoff.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorUTCDatepicker
                            placeholder={t("pages.races.form.registrationCutoff.placeholder")}
                            value={value}
                            onChange={onChange}
                            locale={locale}
                        />
                    )}
                    name="registrationCutoff"
                />
                <div className="p-2"></div>
                <FormInput<Race, "registrationEnabled">
                    label={t("pages.races.form.registrationEnabled.label")}
                    description={t("pages.races.form.registrationEnabled.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorCheckbox label={t("pages.races.form.registrationEnabled.label")} value={value} onChange={onChange} />
                    )}
                    name="registrationEnabled"
                />
                {!initialRace.id && (
                    <>
                        <div className="p-2"></div>
                        <FormInput<Race, "useSampleData">
                            label={t("pages.races.form.useSampleData.label")}
                            description={t("pages.races.form.useSampleData.description")}
                            className="flex-1"
                            render={({ value, onChange }) => (
                                <PoorCheckbox label={t("pages.races.form.useSampleData.label")} value={value} onChange={onChange} />
                            )}
                            name="useSampleData"
                        />
                    </>
                )}
                <div className="p-2"></div>
                <FormInput<Race, "description">
                    label={t("pages.races.form.description.label")}
                    description={t("pages.races.form.description.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.races.form.description.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="description"
                />
                <div className="p-2"></div>
                <FormInput<Race, "termsUrl">
                    label={t("pages.races.form.terms.label")}
                    description={t("pages.races.form.terms.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.races.form.terms.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="termsUrl"
                />
                <div className="p-2"></div>
                <FormInput<Race, "websiteUrl">
                    label={t("pages.races.form.websiteUrl.label")}
                    description={t("pages.races.form.websiteUrl.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("pages.races.form.websiteUrl.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="websiteUrl"
                />
                <div className="p-2"></div>
                <FormInput<Race, "emailTemplate">
                    label={t("pages.races.form.emailTemplate.label")}
                    description={t("pages.races.form.emailTemplate.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorTextArea placeholder={t("pages.races.form.emailTemplate.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="emailTemplate"
                />
            </div>
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
