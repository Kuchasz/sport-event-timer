"use client";

import classNames from "classnames";
import { Button } from "components/button";
import { PoorCombo } from "components/poor-combo";
import { PoorDatepicker } from "components/poor-datepicker";
import { PoorInput } from "components/poor-input";
import { PoorSelect } from "components/poor-select";
import { trpc } from "trpc-core";
import { Form, SmallFormInput } from "form";
import Head from "next/head";
import React, { useState } from "react";
import { dateFromYearsAgo } from "@set/utils/dist/datetime";
import { useTranslations } from "next-intl";
import type { PlayerRegistration } from "modules/player-registration/models";
import { countryCodeEnum, playerRegistrationSchema } from "modules/player-registration/models";
import { type AppRouterOutputs } from "trpc";
import { type Gender, genderEnum } from "modules/shared/models";

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
    }) as PlayerRegistration;

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
    const countries = countryCodeEnum.options.map(code => ({ code, name: t(`shared.countryCodes.${code}`) }));
    const genderOptions = genderEnum.options.map(gender => ({ gender, name: t(`shared.genders.${gender}`) }));

    return (
        <div className="space-y-4 md:space-y-6">
            <Form<PlayerRegistration>
                onSubmit={r => onResolve(r)}
                initialValues={initialRegistration()}
                validationSchema={playerRegistrationSchema}>
                <SmallFormInput<PlayerRegistration, "name">
                    label={t("registration.fields.name.label")}
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("registration.fields.name.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="name"
                />
                <SmallFormInput<PlayerRegistration, "lastName">
                    label={t("registration.fields.lastName.label")}
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("registration.fields.lastName.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="lastName"
                />
                <SmallFormInput<PlayerRegistration, "birthDate">
                    label={t("registration.fields.birthDate.label")}
                    render={({ value, onChange }) => (
                        <PoorDatepicker placeholder={t("registration.fields.birthDate.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="birthDate"
                />
                <SmallFormInput<PlayerRegistration, "gender">
                    label={t("registration.fields.gender.label")}
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={genderOptions}
                            placeholder={t("registration.fields.gender.placeholder")}
                            nameKey="name"
                            valueKey="gender"
                            onChange={onChange}
                        />
                    )}
                    name="gender"
                />
                <SmallFormInput<PlayerRegistration, "team">
                    label={t("registration.fields.team.label")}
                    render={({ value, onChange }) => (
                        <PoorCombo
                            placeholder={t("registration.fields.team.placeholder")}
                            initialValue={value}
                            items={teams}
                            onChange={onChange}
                        />
                    )}
                    name="team"
                />
                <SmallFormInput<PlayerRegistration, "city">
                    label={t("registration.fields.city.label")}
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("registration.fields.city.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="city"
                />
                <SmallFormInput<PlayerRegistration, "country">
                    label={t("registration.fields.country.label")}
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={countries}
                            nameKey="name"
                            placeholder={t("registration.fields.country.placeholder")}
                            valueKey="code"
                            onChange={onChange}
                        />
                    )}
                    name="country"
                />
                <SmallFormInput<PlayerRegistration, "email">
                    label={t("registration.fields.email.label")}
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("registration.fields.email.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="email"
                />
                <SmallFormInput<PlayerRegistration, "phoneNumber">
                    label={t("registration.fields.phoneNumber.label")}
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("registration.fields.phoneNumber.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="phoneNumber"
                />
                <SmallFormInput<PlayerRegistration, "icePhoneNumber">
                    label={t("registration.fields.icePhoneNumber.label")}
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t("registration.fields.icePhoneNumber.placeholder")} value={value} onChange={onChange} />
                    )}
                    name="icePhoneNumber"
                />
                <div className={classNames("my-4 md:my-6", { ["opacity-50"]: disabled })}>
                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="terms"
                                aria-describedby="terms"
                                type="checkbox"
                                className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-orange-300"
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

type RegistrationSystemStatus = AppRouterOutputs["playerRegistration"]["registrationStatus"];
type Teams = AppRouterOutputs["playerRegistration"]["teams"];

export const Registration = ({
    raceId,
    initialRegistrationSystemStatus,
    initialTeams,
}: {
    raceId: number;
    initialRegistrationSystemStatus: RegistrationSystemStatus;
    initialTeams: Teams;
}) => {
    const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatuses>("pending");
    const t = useTranslations();

    const { data: registrationSystemStatus, refetch: refetchSystemStatus } = trpc.playerRegistration.registrationStatus.useQuery(
        { raceId },
        { initialData: initialRegistrationSystemStatus },
    );

    const { data: teams } = trpc.playerRegistration.teams.useQuery({ raceId }, { initialData: initialTeams });

    const registerMutation = trpc.playerRegistration.register.useMutation();

    const handleFormSubmit = async (registration: ReturnType<typeof initialRegistration>) => {
        setRegistrationStatus("progress");

        const formData = {
            ...registration,
            hasPaid: false,
        };

        await registerMutation.mutateAsync({ raceId: Number(raceId), player: formData });

        await refetchSystemStatus();

        setRegistrationStatus(!registerMutation.error ? "successful" : "error");
    };

    return (
        <>
            <Head>
                <title>{t("registration.header.title")}</title>
            </Head>
            {registrationSystemStatus && (
                <div className="f-full mx-auto flex w-full flex-col items-center overflow-y-scroll px-6 py-8 lg:py-2">
                    <div className="w-full rounded-lg shadow-md sm:max-w-md md:mt-0 xl:p-0">
                        <div className="p-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                {registrationSystemStatus.raceName}
                            </h1>
                            <div className="md:text-md mb-4 text-base leading-tight tracking-tight text-gray-900">
                                {t("registration.header.description")}
                            </div>

                            {registrationSystemStatus.limit && (
                                <AvailableSpots
                                    registeredPlayers={registrationSystemStatus.registered}
                                    limit={registrationSystemStatus.limit}
                                />
                            )}

                            {registrationSystemStatus.state === "enabled" || registrationStatus !== "pending" ? (
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
                            ) : registrationSystemStatus.state === "disabled" ? (
                                <span>{t("registration.status.closed")}</span>
                            ) : registrationSystemStatus.state === "cutoff" ? (
                                <span>{t("registration.status.cutoffPassed")}</span>
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
