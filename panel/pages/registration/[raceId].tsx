import { Gender, genders } from "@set/utils/dist/gender";
import classNames from "classnames";
import { Button } from "components/button";
import { PoorCombo } from "components/poor-combo";
import { PoorDatepicker } from "components/poor-datepicker";
import { PoorInput } from "components/poor-input";
import { PoorSelect } from "components/poor-select";
import { trpc } from "connection";
import { countryCodes } from "contry-codes";
import { Form, FormInput } from "form";
import { useFormState } from "hooks";
import { playerRegistrationSchema } from "../../models";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

const initialRegistration = () => ({
    name: "",
    lastName: "",
    birthDate: new Date(),
    gender: "male" as Gender,
    team: "",
    country: "",
    city: "",
    email: "",
    phoneNumber: ""
});

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const initialValues = {};

const RegistrationFormComponent = ({
    disabled,
    registrationStatus,
    onResolve,
    teams,
}: {
    disabled: boolean;
    registrationStatus: RegistrationStatuses;
    onResolve: (registration: ReturnType<typeof initialRegistration>) => void;
    teams: string[];
}) => {
    // const [registration, changeHandler] = useFormState(initialRegistration(), []);
    const [registration] = useFormState(initialRegistration(), []);

    return (
        <div className="space-y-4 md:space-y-6">
            <Form onSubmit={console.log} initialValues={initialValues} validationSchema={playerRegistrationSchema}>
                <FormInput
                    label="First Name"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder="Your first name"
                            value={value as string}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="name"
                />
                <FormInput
                    label="Last Name"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder="Your last name"
                            value={value as string}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="lastName"
                />
                <FormInput
                    label="Birth Date"
                    render={({ value, onChange }) => (
                        <PoorDatepicker
                            placeholder="Your birth date"
                            value={value as Date}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="birthDate"
                />
                <FormInput
                    label="Gender"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value as any}
                            items={genders}
                            placeholder="Select gender"
                            nameKey="name"
                            valueKey="value"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="gender"
                />
                <FormInput
                    label="Team (optional)"
                    render={({ value, onChange }) => (
                        <PoorCombo
                            placeholder="Your team"
                            initialValue={value as string}
                            items={teams}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="team"
                />
                <FormInput
                    label="City"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder="Your city"
                            value={value as string}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="city"
                />
                <FormInput
                    label="Country"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value as any}
                            items={countryCodes}
                            nameKey="name_en"
                            placeholder="Select country"
                            valueKey="code"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="country"
                />
                <FormInput
                    label="Email"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder="Your email address"
                            value={value as string}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="email"
                />
                <FormInput
                    label="Phone number"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder="Your email phone number"
                            value={value as string}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="phoneNumber"
                />
                <FormInput
                    label="ICE phone number (optional)"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder="Resque phone number"
                            value={value as string}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="icePhoneNumber"
                />
            </Form>

            <div className={classNames("space-y-4 md:space-y-6", { ["opacity-50"]: disabled })}>
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
                            I agree with the <span className="font-medium text-orange-600 hover:underline">Terms and conditions</span>
                            {/* <a className="font-medium text-orange-600 hover:underline" href="/files/regulamin_rnk23.pdf">
                                Terms and conditions
                            </a> */}
                        </label>
                    </div>
                </div>
            </div>
            <Button onClick={() => onResolve(registration)}>
                {registrationStatus === "progress" ? "Registration pending" : "Register"}
            </Button>
            {/* <button
                type="submit"
                className="flex justify-center w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={disabled}
            >
                {registrationStatus === "progress" ? (
                    <>
                        <span>Registration pending</span>
                    </>
                ) : (
                    <span>Register</span>
                )}
            </button> */}
        </div>
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

    const { data: registrationSystemStatus, refetch: refetchSystemStatus } = trpc.playerRegistration.registrationStatus.useQuery(
        { raceId: Number(raceId) },
        { enabled: raceId !== undefined }
    );

    const { data: teams } = trpc.playerRegistration.teams.useQuery(
        { raceId: Number(raceId) },
        { enabled: raceId !== undefined, initialData: [] }
    );

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

                            {registrationSystemStatus.status === "enabled" || registrationStatus !== "pending" ? (
                                ["pending", "progress"].includes(registrationStatus) ? (
                                    <RegistrationFormComponent
                                        disabled={registrationStatus !== "pending"}
                                        teams={teams}
                                        registrationStatus={registrationStatus}
                                        onResolve={handleFormSubmit}
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
