import PoorCombo from "components/poor-combo";
import { countryCodes } from "contry-codes";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const RegistrationFormComponent = ({
    registrationStatus,
    handleFormSubmit,
    teams,
}: {
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
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                    Imię
                </label>
                <input
                    type="name"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    placeholder="imię zawodnika"
                    required
                    disabled={registrationStatus !== "pending"}
                />
            </div>
            <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900">
                    Nazwisko
                </label>
                <input
                    type="lastName"
                    name="lastName"
                    id="lastName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    placeholder="nazwisko zawodnika"
                    required
                    disabled={registrationStatus !== "pending"}
                />
            </div>
            <div>
                <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900">
                    Data urodzenia
                </label>
                <input
                    type="date"
                    name="birthDate"
                    id="birthDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    placeholder="data urodzenia"
                    required
                    disabled={registrationStatus !== "pending"}
                />
            </div>
            <div>
                <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">
                    Płeć
                </label>
                <select
                    name="gender"
                    id="gender"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    placeholder="płeć"
                    required
                    disabled={registrationStatus !== "pending"}
                >
                    <option value="male">Mężczyzna</option>
                    <option value="female">Kobieta</option>
                </select>
            </div>
            <div>
                <label htmlFor="team" className="block mb-2 text-sm font-medium text-gray-900">
                    Drużyna
                </label>
                <PoorCombo name="team" id="team" placeholder="nazwa drużyny" items={teams} />
            </div>
            <div>
                <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900">
                    Miasto
                </label>
                <input
                    name="city"
                    id="city"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    placeholder="miasto"
                    required
                    disabled={registrationStatus !== "pending"}
                />
            </div>
            <div>
                <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900">
                    Kraj
                </label>
                <select
                    name="country"
                    id="country"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    placeholder="kraj"
                    defaultValue="PL"
                    required
                    disabled={registrationStatus !== "pending"}
                >
                    {countryCodes.map(cc => (
                        <option key={cc.code} value={cc.code}>
                            {cc.name_pl}
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
                    placeholder="adres email"
                    required
                    disabled={registrationStatus !== "pending"}
                />
            </div>
            <div>
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                    Numer telefonu
                </label>
                <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    placeholder="numer telefonu"
                    required
                    disabled={registrationStatus !== "pending"}
                />
            </div>
            <div>
                <label htmlFor="icePhoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
                    Numer telefonu ICE
                </label>
                <input
                    type="tel"
                    name="icePhoneNumber"
                    id="icePhoneNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                    placeholder="ratunkowy numer telefonu"
                    disabled={registrationStatus !== "pending"}
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
                        Potwierdzam, że akceptuję{" "}
                        <a className="font-medium text-orange-600 hover:underline" href="/files/regulamin_rnk23.pdf">
                            Regulamin
                        </a>
                    </label>
                </div>
            </div>
            <button
                type="submit"
                className="flex justify-center w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={registrationStatus !== "pending"}
            >
                {registrationStatus === "progress" ? (
                    <>
                        <span className="mr-2">Trwa rejestracja</span>
                        {/* <Loader /> */}
                    </>
                ) : (
                    <span className="mr-2">Zarejestruj się</span>
                )}
            </button>
        </form>
    );
};

type RegistrationStatuses = "pending" | "progress" | "successful" | "error";
type RegistrationSystemStates = "unknown" | "valid" | "invalid";

const Rejestracja = () => {
    const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatuses>("pending");
    const [teams, setTeams] = useState<string[]>([]);
    const [registrationSystemStatus, setRegistrationSystemStatus] = useState<RegistrationSystemStates>("unknown");

    useEffect(() => {
        fetch("/api/registration-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(r => r.json())
            .then(() => setRegistrationSystemStatus("valid"))
            .catch(() => setRegistrationSystemStatus("invalid"));

        fetch("/api/teams", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(r => r.json())
            .then(r => setTeams(r));
    }, []);

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
            birthDate: formElements.birthDate.value,
            gender: formElements.gender.value,
            team: formElements.team.value,
            city: formElements.city.value,
            country: formElements.country.value,
            email: formElements.email.value,
            phoneNumber: formElements.phoneNumber.value,
            icePhoneNumber: formElements.icePhoneNumber.value,
        };

        const result = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        setRegistrationStatus(result.status === 200 ? "successful" : "error");
    };

    return (
        <>
            <Head>
                <title>Rejestracja</title>
            </Head>
            <div className="flex h-full py-16 flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Rejestracja na zawody
                            </h1>
                            {registrationSystemStatus === "valid" ? (
                                <>
                                    {registrationStatus === "pending" || registrationStatus === "progress" ? (
                                        <RegistrationFormComponent
                                            teams={teams}
                                            registrationStatus={registrationStatus}
                                            handleFormSubmit={handleFormSubmit}
                                        />
                                    ) : registrationStatus === "error" ? (
                                        <div>
                                            <h2 className="mb-8">Nastąpił błąd podczas rejestracji</h2>
                                            <span>
                                                Spróbuj ponownie za jakiś czas. Prosimy o informację jeśli problem będzie się powtarzał.
                                            </span>
                                        </div>
                                    ) : (
                                        <div>
                                            <h2 className="mb-8">Rejestracja przebiegła pomyślnie!</h2>
                                            <span>Sprawdź swoją pocztę email. Znajdziesz tam instrukcję dokonywania wpłaty wpisowego.</span>
                                        </div>
                                    )}
                                </>
                            ) : registrationSystemStatus === "unknown" ? (
                                <div>
                                    <h2 className="mb-8">Uruchamianie systemu rejestracji...</h2>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="mb-8">System rejestracji zawodników aktualnie jest niedostępny</h2>
                                    <span>Spróbuj ponownie za jakiś czas. Prosimy o informację jeśli problem będzie się powtarzał.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Rejestracja;
