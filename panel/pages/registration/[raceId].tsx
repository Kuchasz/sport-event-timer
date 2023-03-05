import classNames from "classnames";
import PoorCombo from "components/poor-combo";
import { trpc } from "connection";
import { countryCodes } from "contry-codes";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

const RegistrationFormComponent = ({
    disabled,
    registrationStatus,
    handleFormSubmit,
    teams,
}: {
    disabled: boolean;
    registrationStatus: RegistrationStatuses;
    handleFormSubmit: React.FormEventHandler<HTMLFormElement>;
    teams: string[];
}) => {
    return (
        <form
            className="space-y-4 md:space-y-6"
            onSubmit={e => {
                e.preventDefault();
                handleFormSubmit(e);
            }}
        >
            <div className={classNames("space-y-4 md:space-y-6", { ["opacity-50"]: disabled })}>
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                        First Name
                    </label>
                    <input
                        type="name"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                        placeholder="first name"
                        required
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900">
                        Last name
                    </label>
                    <input
                        type="lastName"
                        name="lastName"
                        id="lastName"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                        placeholder="last name"
                        required
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900">
                        Birth date
                    </label>
                    <input
                        type="date"
                        name="birthDate"
                        id="birthDate"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                        placeholder="birth date"
                        required
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">
                        Gender
                    </label>
                    <select
                        name="gender"
                        id="gender"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                        placeholder="gender"
                        required
                        disabled={disabled}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="team" className="block mb-2 text-sm font-medium text-gray-900">
                        Team
                    </label>
                    <PoorCombo name="team" id="team" placeholder="team name" items={teams} />
                </div>
                <div>
                    <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900">
                        City
                    </label>
                    <input
                        name="city"
                        id="city"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                        placeholder="city"
                        required
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900">
                        Country
                    </label>
                    <select
                        name="country"
                        id="country"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                        placeholder="country"
                        defaultValue="PL"
                        required
                        disabled={disabled}
                    >
                        {countryCodes.map(cc => (
                            <option key={cc.code} value={cc.code}>
                                {cc.name_en}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                        placeholder="email address"
                        required
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                        Phone number
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                        placeholder="phone number"
                        required
                        disabled={disabled}
                    />
                </div>
                <div>
                    <label htmlFor="icePhoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                        ICE phone number
                    </label>
                    <input
                        type="tel"
                        name="icePhoneNumber"
                        id="icePhoneNumber"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                        placeholder="emergency phone number"
                        disabled={disabled}
                    />
                </div>
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
                            I agree with the{" "}
                            <a className="font-medium text-orange-600 hover:underline" href="/files/regulamin_rnk23.pdf">
                                Terms and conditions
                            </a>
                        </label>
                    </div>
                </div>
            </div>
            <button
                type="submit"
                className="flex justify-center w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={disabled}
            >
                {registrationStatus === "progress" ? (
                    <>
                        <span className="mr-2">Registration pending</span>
                        {/* <Loader /> */}
                    </>
                ) : (
                    <span className="mr-2">Register</span>
                )}
            </button>
        </form>
    );
};

type RegistrationStatuses = "pending" | "progress" | "successful" | "error";

const RegistrationFailed = () => (
    <div>
        <h2 className="mb-8">Registration went wrong</h2>
        <span>Maybe limit of players has exceeded</span>
    </div>
);

const RegistrationSuccessful = () => (
    <div>
        <h2 className="mb-8">Registration was successful</h2>
        {/* <span>Sprawdź swoją pocztę email. Znajdziesz tam instrukcję dokonywania wpłaty wpisowego.</span> */}
    </div>
);

const AvailableSpots = ({ limit, registeredPlayers }: { limit: number; registeredPlayers: number }) => (
    <div className="mb-4">
        <div className="text-sm">Available spots</div>
        <div className="text-xl">
            {limit - registeredPlayers} / {limit}
        </div>
    </div>
);

const Rejestracja = () => {
    const { raceId } = useRouter().query;
    const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatuses>("pending");

    const { data: registrationSystemStatus } = trpc.playerRegistration.registrationStatus.useQuery(
        { raceId: Number(raceId) },
        { enabled: raceId !== undefined }
    );

    const { data: teams } = trpc.playerRegistration.teams.useQuery(
        { raceId: Number(raceId) },
        { enabled: raceId !== undefined, initialData: [] }
    );

    const registerMutation = trpc.playerRegistration.register.useMutation();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setRegistrationStatus("progress");
        console.log((e.currentTarget.elements as any).team);
        const formElements = e.currentTarget.elements as unknown as {
            name: HTMLInputElement;
            lastName: HTMLInputElement;
            birthDate: HTMLInputElement;
            gender: HTMLInputElement;
            team: HTMLInputElement;
            city: HTMLInputElement;
            country: HTMLInputElement;
            email: HTMLInputElement;
            phoneNumber: HTMLInputElement;
            icePhoneNumber: HTMLInputElement;
        };
        const formData = {
            name: formElements.name.value,
            lastName: formElements.lastName.value,
            birthDate: new Date(formElements.birthDate.value),
            gender: formElements.gender.value as "male" | "female",
            team: formElements.team.value,
            city: formElements.city.value,
            country: formElements.country.value,
            email: formElements.email.value,
            phoneNumber: formElements.phoneNumber.value,
            icePhoneNumber: formElements.icePhoneNumber.value,
            hasPaid: false,
        };

        await registerMutation.mutateAsync({ raceId: Number(raceId), player: formData });

        setRegistrationStatus(!registerMutation.error ? "successful" : "error");
    };

    return (
        <>
            <Head>
                <title>Registration</title>
            </Head>
            {registrationSystemStatus && (
                <div className="flex f-full w-full overflow-y-scroll flex-col items-center px-6 py-8 mx-auto lg:py-0">
                    <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                {registrationSystemStatus.raceName}
                            </h1>
                            <div className="text-base mb-4 leading-tight tracking-tight text-gray-900 md:text-md">
                                Register new participant
                            </div>

                            {registrationSystemStatus.limit && (
                                <AvailableSpots
                                    registeredPlayers={registrationSystemStatus.registered}
                                    limit={registrationSystemStatus.limit}
                                />
                            )}

                            {registrationSystemStatus.status === "enabled" ? (
                                ["pending", "progress"].includes(registrationStatus) ? (
                                    <RegistrationFormComponent
                                        disabled={registrationStatus !== "pending"}
                                        teams={teams}
                                        registrationStatus={registrationStatus}
                                        handleFormSubmit={handleFormSubmit}
                                    />
                                ) : registrationStatus === "error" ? (
                                    <RegistrationFailed />
                                ) : (
                                    <RegistrationSuccessful />
                                )
                            ) : registrationSystemStatus.status === "disabled" ? (
                                <span>Registration is closed.</span>
                            ) : (
                                <span>No available spots. Registration is closed.</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Rejestracja;
