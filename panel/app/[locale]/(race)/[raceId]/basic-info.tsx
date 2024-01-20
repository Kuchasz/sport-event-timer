"use client";

import { sportKinds } from "@set/utils/dist/sport-kind";
import { Button } from "components/button";
import { PageHeader } from "components/page-header";
import { PoorCheckbox } from "components/poor-checkbox";
import { PoorUTCDatepicker } from "components/poor-datepicker";
import { PoorInput } from "components/poor-input";
import { PoorNumberInput } from "components/poor-number-input";
import { PoorSelect } from "components/poor-select";
import { PoorTextArea } from "components/poor-text-area";
import { Form, FormCard, FormInput, FormInputInline } from "form";
import { useCurrentRaceId } from "hooks";
import {
    raceConfirmationEmailTemplateSchema,
    raceInformationSchema,
    raceRegistrationSchema,
    raceRegulationsSchema,
} from "modules/race/models";
import { useTranslations } from "next-intl";
import { type AppRouterInputs } from "trpc";
import { trpc } from "trpc-core";

type Race = AppRouterInputs["race"]["add"]["race"];
type RaceInformation = AppRouterInputs["race"]["updateRaceInformation"];
type RaceRegistration = AppRouterInputs["race"]["updateRaceRegistration"];
type RaceRegulations = AppRouterInputs["race"]["updateRaceRegulations"];
type RaceConfirmationEmailTemplate = AppRouterInputs["race"]["updateRaceConfirmationEmailTemplate"];

export const BasicInfo = () => {
    const raceId = useCurrentRaceId();
    const { data: raceRaceport } = trpc.race.raceRaport.useQuery({ raceId: raceId }, { enabled: !!raceId });
    const { data: initialRace } = trpc.race.race.useQuery({ raceId: raceId }, { enabled: !!raceId });
    const updateRaceInformationMutation = trpc.race.updateRaceInformation.useMutation();
    const updateRaceRegistrationMutation = trpc.race.updateRaceRegistration.useMutation();
    const updateRaceRegulationsMutation = trpc.race.updateRaceRegulations.useMutation();
    const updateRaceConfirmationEmailTemplateMutation = trpc.race.updateRaceConfirmationEmailTemplate.useMutation();

    const sportKindTranslations = useTranslations("shared.sportKinds");
    const t = useTranslations();
    const sportKindsOptions = sportKinds.map(sk => ({ name: sportKindTranslations(sk), value: sk }));

    const updateRaceInformation = async (raceInformation: RaceInformation) => {
        await updateRaceInformationMutation.mutateAsync({ ...raceInformation });
    };
    const updateRaceRegistration = async (raceRegistration: RaceRegistration) => {
        await updateRaceRegistrationMutation.mutateAsync({ ...raceRegistration });
    };

    const updateRaceRegulations = async (raceRegulations: RaceRegulations) => {
        await updateRaceRegulationsMutation.mutateAsync({ ...raceRegulations });
    };
    const updateRaceConfirmationEmailTemplate = async (raceConfirmationEmailTemplate: RaceConfirmationEmailTemplate) => {
        await updateRaceConfirmationEmailTemplateMutation.mutateAsync({ ...raceConfirmationEmailTemplate });
    };

    return (
        <>
            {raceRaceport && initialRace && (
                <div>
                    <div>
                        <PageHeader title={t("pages.basicInfo.header.title")} description={t("pages.basicInfo.header.description")} />
                        <div className="mb-4 mt-6">
                            {/* <div className="mx-3 text-xl font-semibold">{t("pages.basicInfo.statistics.header.title")}</div>
                            <div className="flex">
                                <DashboardCard.Range
                                    min={raceRaceport.registeredPlayers}
                                    max={raceRaceport.playersLimit}
                                    title={t("pages.basicInfo.statistics.widgets.registeredPlayers")}
                                />
                                <DashboardCard.Discrete
                                    enabled={raceRaceport.registrationEnabled}
                                    title={t("pages.basicInfo.statistics.widgets.registrationStatus")}
                                />
                            </div> */}
                            {/* <label>
                                Potwierdzam 100% nieznajomość regulaminu. Kto ma czas na czytanie regulaminów
                                <input type="checkbox"></input>
                            </label> */}

                            {/* <Form<Race> initialValues={initialRace} validationSchema={raceSchema} onSubmit={console.log}> */}
                            <div className="flex flex-col">
                                <Form<Race>
                                    initialValues={initialRace}
                                    validationSchema={raceInformationSchema}
                                    onSubmit={updateRaceInformation}>
                                    <FormCard title={t("pages.basicInfo.sections.base.title")}>
                                        <div className="flex">
                                            <FormInput<Race, "name">
                                                label={t("pages.races.form.name.label")}
                                                className="flex-1"
                                                render={({ value, onChange }) => (
                                                    <PoorInput
                                                        placeholder={t("pages.races.form.name.placeholder")}
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                                name="name"
                                            />
                                            <div className="p-2"></div>
                                            <FormInput<Race, "date">
                                                label={t("pages.races.form.date.label")}
                                                className="flex-1"
                                                render={({ value, onChange }) => (
                                                    <PoorUTCDatepicker
                                                        required
                                                        placeholder={t("pages.races.form.date.placeholder")}
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                                name="date"
                                            />
                                        </div>
                                        <div className="p-2"></div>
                                        <div className="flex">
                                            <FormInput<Race, "location">
                                                label={t("pages.races.form.location.label")}
                                                className="flex-1"
                                                render={({ value, onChange }) => (
                                                    <PoorInput
                                                        placeholder={t("pages.races.form.location.placeholder")}
                                                        value={value}
                                                        onChange={onChange}
                                                    />
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
                                        </div>
                                        <div className="p-2"></div>
                                        <div className="flex">
                                            <FormInput<Race, "description">
                                                label={t("pages.races.form.description.label")}
                                                className="flex-1"
                                                render={({ value, onChange }) => (
                                                    <PoorTextArea
                                                        placeholder={t("pages.races.form.description.placeholder")}
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                                name="description"
                                            />
                                        </div>
                                        <div className="p-2"></div>
                                        <div className="flex">
                                            <FormInput<Race, "websiteUrl">
                                                label={t("pages.races.form.websiteUrl.label")}
                                                className="flex-1"
                                                render={({ value, onChange }) => (
                                                    <PoorInput
                                                        placeholder={t("pages.races.form.websiteUrl.placeholder")}
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                                name="websiteUrl"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <Button loading={updateRaceInformationMutation.isLoading} type="submit">
                                                {t("shared.save")}
                                            </Button>
                                        </div>
                                    </FormCard>
                                </Form>
                                <div className="p-4"></div>
                                <Form
                                    validationSchema={raceRegistrationSchema}
                                    initialValues={initialRace}
                                    onSubmit={updateRaceRegistration}>
                                    <FormCard title={t("pages.basicInfo.sections.registration.title")}>
                                        <div className="flex">
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
                                            <div className="p-2"></div>
                                            <FormInput<Race, "registrationCutoff">
                                                label={t("pages.races.form.registrationCutoff.label")}
                                                className="flex-1"
                                                render={({ value, onChange }) => (
                                                    <PoorUTCDatepicker
                                                        placeholder={t("pages.races.form.registrationCutoff.placeholder")}
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                                name="registrationCutoff"
                                            />
                                            <div className="p-2"></div>
                                            <FormInputInline<Race, "registrationEnabled">
                                                label={t("pages.races.form.registrationEnabled.label")}
                                                className="flex flex-1 items-start"
                                                render={({ value, onChange }) => (
                                                    <PoorCheckbox
                                                        label={t("pages.races.form.registrationEnabled.label")}
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                                name="registrationEnabled"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <Button loading={updateRaceRegistrationMutation.isLoading} type="submit">
                                                {t("shared.save")}
                                            </Button>
                                        </div>
                                    </FormCard>
                                </Form>

                                <div className="p-4"></div>
                                <Form initialValues={initialRace} validationSchema={raceRegulationsSchema} onSubmit={updateRaceRegulations}>
                                    <FormCard title={t("pages.basicInfo.sections.terms.title")}>
                                        <div className="flex">
                                            <FormInput<Race, "termsUrl">
                                                label={t("pages.races.form.terms.label")}
                                                className="flex-1"
                                                render={({ value, onChange }) => (
                                                    <PoorInput
                                                        placeholder={t("pages.races.form.terms.placeholder")}
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                                name="termsUrl"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <Button loading={updateRaceRegulationsMutation.isLoading} type="submit">
                                                {t("shared.save")}
                                            </Button>
                                        </div>
                                    </FormCard>
                                </Form>
                                <div className="p-4"></div>
                                <Form
                                    initialValues={initialRace}
                                    validationSchema={raceConfirmationEmailTemplateSchema}
                                    onSubmit={updateRaceConfirmationEmailTemplate}>
                                    <FormCard title={t("pages.basicInfo.sections.terms.emailTemplate")}>
                                        <div className="flex">
                                            <FormInput<Race, "emailTemplate">
                                                label={t("pages.races.form.emailTemplate.label")}
                                                className="flex-1"
                                                render={({ value, onChange }) => (
                                                    <PoorTextArea
                                                        placeholder={t("pages.races.form.emailTemplate.placeholder")}
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                )}
                                                name="emailTemplate"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <Button loading={updateRaceConfirmationEmailTemplateMutation.isLoading} type="submit">
                                                {t("shared.save")}
                                            </Button>
                                        </div>
                                    </FormCard>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
