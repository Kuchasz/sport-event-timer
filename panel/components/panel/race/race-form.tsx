import { Button } from "../../button";
import { PoorUTCDatepicker } from "../../poor-datepicker";
import { PoorInput } from "../../poor-input";
import type { AppRouterInputs } from "trpc";
import { PoorNumberInput } from "../../poor-number-input";
import { PoorCheckbox } from "../../poor-checkbox";
import { PoorTextArea } from "../../poor-text-area";
import { sportKinds } from "@set/utils/dist/sport-kind";
import { PoorSelect } from "components/poor-select";
import { useTranslations } from "next-intl";
import { Form, FormInput } from "form";
import { raceSchema } from "modules/race/models";

type Race = AppRouterInputs["race"]["add"]["race"];

type RaceFormProps = {
    onReject: () => void;
    onResolve: (race: Race) => void;
    initialRace: Race;
    isLoading: boolean;
};

export const registrationEnabledValues = [
    { name: "Enabled", value: true },
    { name: "Disabled", value: false },
];

export const RaceForm = ({ onReject, onResolve, initialRace, isLoading }: RaceFormProps) => {
    const sportKindTranslations = useTranslations("shared.sportKinds");
    const t = useTranslations();
    const sportKindsOptions = sportKinds.map(sk => ({ name: sportKindTranslations(sk), value: sk }));

    return (
        <Form<Race> initialValues={initialRace} validationSchema={raceSchema} onSubmit={onResolve}>
            <div className="flex flex-col">
                <div className="flex">
                    <FormInput<Race, "name">
                        label={t("pages.races.form.name.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("pages.races.form.name.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="name"
                    />
                    <div className="p-2"></div>
                    <FormInput<Race, "date">
                        label={t("pages.races.form.date.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorUTCDatepicker placeholder={t("pages.races.form.date.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="date"
                    />
                    <div className="p-2"></div>
                    <FormInput<Race, "playersLimit">
                        label={t("pages.races.form.playersLimit.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorNumberInput
                                placeholder={t("pages.races.form.playersLimit.placeholder")}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                        name="playersLimit"
                    />
                </div>
                <div className="p-2"></div>
                <div className="flex">
                    <FormInput<Race, "location">
                        label={t("pages.races.form.location.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("pages.races.form.location.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="location"
                    />
                    <div className="p-2"></div>
                    <FormInput<Race, "sportKind">
                        label={t("pages.races.form.sportKind.label")}
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
                    <FormInput<Race, "registrationEnabled">
                        label={t("pages.races.form.registrationEnabled.label")}
                        className="flex-1"
                        render={({ value, onChange }) => <PoorCheckbox value={value} onChange={onChange} />}
                        name="registrationEnabled"
                    />
                    {!initialRace.id && (
                        <>
                            <div className="p-2"></div>
                            <FormInput<Race, "useSampleData">
                                label={t("pages.races.form.useSampleData.label")}
                                className="flex-1"
                                render={({ value, onChange }) => <PoorCheckbox value={value} onChange={onChange} />}
                                name="useSampleData"
                            />
                        </>
                    )}
                </div>
                <div className="p-2"></div>
                <div className="flex">
                    <FormInput<Race, "description">
                        label={t("pages.races.form.description.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("pages.races.form.description.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="description"
                    />
                </div>
                <div className="p-2"></div>
                <div className="flex">
                    <FormInput<Race, "termsUrl">
                        label={t("pages.races.form.terms.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorInput placeholder={t("pages.races.form.terms.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="termsUrl"
                    />
                </div>
                <div className="p-2"></div>
                <div className="flex">
                    <FormInput<Race, "emailTemplate">
                        label={t("pages.races.form.emailTemplate.label")}
                        className="flex-1"
                        render={({ value, onChange }) => (
                            <PoorTextArea placeholder={t("pages.races.form.emailTemplate.placeholder")} value={value} onChange={onChange} />
                        )}
                        name="emailTemplate"
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
