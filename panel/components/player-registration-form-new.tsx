import { Button } from "./button";
import { AppRouterInputs } from "trpc";
import { PoorDatepicker } from "./poor-datepicker";
import { PoorInput } from "./poor-input";
import { countryCodes } from "contry-codes";
import { PoorSelect } from "./poor-select";
import { useCurrentRaceId } from "hooks";
import { genders } from "@set/utils/dist/gender";
import { Form, FormInput } from "form";
import { playerRegistrationSchema } from "models";
import { PoorCombo } from "./poor-combo";
import { trpc } from "trpc-core";

type PlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];

type PlayerRegistrationFormProps = {
    onReject: () => void;
    onResolve: (player: PlayerRegistration) => void;
    initialPlayerRegistration: PlayerRegistration;
};

export const PlayerRegistrationFormNew = ({ onReject, onResolve, initialPlayerRegistration }: PlayerRegistrationFormProps) => {
    const raceId = useCurrentRaceId();
    const { data: teams } = trpc.playerRegistration.teams.useQuery({ raceId: Number(raceId) }, { enabled: !!raceId, initialData: [] });

    return (
        <Form<PlayerRegistration>
            initialValues={initialPlayerRegistration}
            validationSchema={playerRegistrationSchema}
            onSubmit={onResolve}
        >
            <div className="flex">
                <FormInput<PlayerRegistration, "name">
                    label="Name"
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder="First name" value={value} onChange={e => onChange({ target: { value: e.target.value } })} />
                    )}
                    name="name"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "lastName">
                    label="Last Name"
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder="Last name" value={value} onChange={e => onChange({ target: { value: e.target.value } })} />
                    )}
                    name="lastName"
                />
            </div>
            <div className="flex">
                <FormInput<PlayerRegistration, "gender">
                    label="Gender"
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={genders}
                            placeholder="Gender"
                            nameKey="name"
                            valueKey="value"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="gender"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "birthDate">
                    label="Birth Date"
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorDatepicker
                            placeholder="Birth Date"
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="birthDate"
                />
            </div>
            <div>
                <FormInput<PlayerRegistration, "team">
                    label="Team"
                    render={({ value, onChange }) => (
                        <PoorCombo
                            placeholder="Team"
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
                    label="Country"
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={countryCodes}
                            nameKey="name_en"
                            placeholder="Country"
                            valueKey="code"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="country"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "city">
                    label="City"
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder="City" value={value} onChange={e => onChange({ target: { value: e.target.value } })} />
                    )}
                    name="city"
                />
            </div>
            <div className="flex">
                <FormInput<PlayerRegistration, "email">
                    label="Email"
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder="Email" value={value} onChange={e => onChange({ target: { value: e.target.value } })} />
                    )}
                    name="email"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "phoneNumber">
                    label="Phone Number"
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder="Phone Number"
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="phoneNumber"
                />
                <div className="p-2"></div>
                <FormInput<PlayerRegistration, "icePhoneNumber">
                    label="ICE Phone Number"
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder="ICE Phone Number"
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="icePhoneNumber"
                />
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    Cancel
                </Button>
                <Button type="submit">Save</Button>
            </div>
        </Form>
    );
};
