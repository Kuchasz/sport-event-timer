"use client";

import { Gender, getGenders } from "@set/utils/dist/gender";
import classNames from "classnames";
import { Button } from "components/button";
import { PoorCombo } from "components/poor-combo";
import { PoorDatepicker } from "components/poor-datepicker";
import { PoorInput } from "components/poor-input";
import { PoorSelect } from "components/poor-select";
import { trpc } from "trpc-core";
import { countryCodes } from "contry-codes";
import { Form, FormInput } from "form";
import { PlayerRegistration, playerRegistrationSchema } from "../../../../../models";
import Head from "next/head";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { dateFromYearsAgo } from "@set/utils/dist/datetime";
import { useTranslations } from "next-intl";

const initialRegistration = () =>
    ({
        name: "",
        lastName: "",
        birthDate: dateFromYearsAgo(18),
        gender: "male" as Gender,
        team: "",
        country: "PL",
        city: "",
        email: "",
        phoneNumber: "",
    } as PlayerRegistration);

const RegistrationFormComponent = ({
    disabled,
    registrationStatus,
    onResolve,
    teams,
    termsUrl,
}: {
    disabled: boolean;
    registrationStatus: RegistrationStatuses;
    onResolve: (registration: ReturnType<typeof initialRegistration>) => void;
    teams: string[];
    termsUrl: string | null;
}) => {
    const t = useTranslations();
    return (
        <div className="space-y-4 md:space-y-6">
            <Form<PlayerRegistration>
                onSubmit={r => onResolve(r)}
                initialValues={initialRegistration()}
                validationSchema={playerRegistrationSchema}
            >
                <FormInput<PlayerRegistration, "name">
                    label={t("registration.fields.name.label")}
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("registration.fields.name.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="name"
                />
                <FormInput<PlayerRegistration, "lastName">
                    label={t("registration.fields.lastName.label")}
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("registration.fields.lastName.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="lastName"
                />
                <FormInput<PlayerRegistration, "birthDate">
                    label={t("registration.fields.birthDate.label")}
                    render={({ value, onChange }) => (
                        <PoorDatepicker
                            placeholder={t("registration.fields.birthDate.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="birthDate"
                />
                <FormInput<PlayerRegistration, "gender">
                    label={t("registration.fields.gender.label")}
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={getGenders({ male: t("registration.gender.male"), female: t("registration.gender.female") })}
                            placeholder={t("registration.fields.gender.placeholder")}
                            nameKey="name"
                            valueKey="value"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="gender"
                />
                <FormInput<PlayerRegistration, "team">
                    label={t("registration.fields.team.label")}
                    render={({ value, onChange }) => (
                        <PoorCombo
                            placeholder={t("registration.fields.team.placeholder")}
                            initialValue={value}
                            items={teams}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="team"
                />
                <FormInput<PlayerRegistration, "city">
                    label={t("registration.fields.city.label")}
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("registration.fields.city.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="city"
                />
                <FormInput<PlayerRegistration, "country">
                    label={t("registration.fields.country.label")}
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={countryCodes}
                            nameKey="name_en"
                            placeholder={t("registration.fields.country.placeholder")}
                            valueKey="code"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="country"
                />
                <FormInput<PlayerRegistration, "email">
                    label={t("registration.fields.email.label")}
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("registration.fields.email.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="email"
                />
                <FormInput<PlayerRegistration, "phoneNumber">
                    label={t("registration.fields.phoneNumber.label")}
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("registration.fields.phoneNumber.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="phoneNumber"
                />
                <FormInput<PlayerRegistration, "icePhoneNumber">
                    label={t("registration.fields.icePhoneNumber.label")}
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t("registration.fields.icePhoneNumber.placeholder")}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="icePhoneNumber"
                />
                <div className={classNames("my-4 md:my-6", { ["opacity-50"]: disabled })}>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                aria-describedby="terms"
                                type="checkbox"
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300"
                                required
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-light text-gray-500">
                                {t("registration.fields.terms.agree")}{" "}
                                {termsUrl ? (
                                    <a className="font-medium text-orange-600 hover:underline" target="_blank" href={termsUrl}>
                                        {t("registration.fields.terms.termsAndConditions")}
                                    </a>
                                ) : (
                                    <span className="font-medium">{t("registration.fields.terms.termsAndConditions")}</span>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
                <Button type="submit">
                    {registrationStatus === "progress" ? t("registration.buttons.pending") : t("registration.buttons.register")}
                </Button>
            </Form>
        </div>
    );
};

type RegistrationStatuses = "pending" | "progress" | "successful" | "error";

const RegistrationFailed = () => {
    const t = useTranslations();
    return (
        <div>
            <h2 className="mb-8">{t("registration.result.failed.header")}</h2>
            <span>{t("registration.result.failed.text")}</span>
        </div>
    );
};

const RegistrationSuccessful = () => {
    const t = useTranslations();
    return (
        <div>
            <h2 className="mb-8">{t("registration.result.success.header")}</h2>
            <span>{t("registration.result.success.text")}</span>
        </div>
    );
};

const AvailableSpots = ({ limit, registeredPlayers }: { limit: number; registeredPlayers: number }) => {
    const t = useTranslations();
    return (
        <div className="mb-4">
            <div className="text-sm">{t("registration.status.availableSpots")}</div>
            <div className="text-xl">
                {limit - registeredPlayers} / {limit}
            </div>
        </div>
    );
};

export const Registration = () => {
    const { raceId } = useParams() as { raceId: string };
    const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatuses>("pending");
    const t = useTranslations();

    const { data: registrationSystemStatus, refetch: refetchSystemStatus } = trpc.playerRegistration.registrationStatus.useQuery(
        { raceId: Number(raceId) },
        { enabled: !!raceId }
    );

    const { data: teams } = trpc.playerRegistration.teams.useQuery({ raceId: Number(raceId) }, { enabled: !!raceId, initialData: [] });

    const registerMutation = trpc.playerRegistration.register.useMutation();

    const handleFormSubmit = async (registration: ReturnType<typeof initialRegistration>) => {
        setRegistrationStatus("progress");

        const formData = {
            ...registration,
            hasPaid: false,
        };

        await registerMutation.mutateAsync({ raceId: Number(raceId), player: formData });

        refetchSystemStatus();

        setRegistrationStatus(!registerMutation.error ? "successful" : "error");
    };

    return (
        <>
            <Head>
                <title>{t("registration.header.title")}</title>
            </Head>
            {registrationSystemStatus && (
                <div className="flex f-full w-full overflow-y-scroll flex-col items-center px-6 py-8 mx-auto lg:py-2">
                    <div className="w-full rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                {registrationSystemStatus.raceName}
                            </h1>
                            <div className="text-base mb-4 leading-tight tracking-tight text-gray-900 md:text-md">
                                {t("registration.header.description")}
                            </div>

                            {registrationSystemStatus.limit && (
                                <AvailableSpots
                                    registeredPlayers={registrationSystemStatus.registered}
                                    limit={registrationSystemStatus.limit}
                                />
                            )}

                            {registrationSystemStatus.status === "enabled" || registrationStatus !== "pending" ? (
                                ["pending", "progress"].includes(registrationStatus) ? (
                                    <RegistrationFormComponent
                                        disabled={registrationStatus !== "pending"}
                                        teams={teams}
                                        registrationStatus={registrationStatus}
                                        onResolve={handleFormSubmit}
                                        termsUrl={registrationSystemStatus.termsUrl}
                                    />
                                ) : registrationStatus === "error" ? (
                                    <RegistrationFailed />
                                ) : (
                                    <RegistrationSuccessful />
                                )
                            ) : registrationSystemStatus.status === "disabled" ? (
                                <span>{t("registration.status.closed")}</span>
                            ) : (
                                <span>{t("registration.status.noSpotsLeft")}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
