import Icon from "@mdi/react";
import { Button } from "./button";
import { AppRouterInputs } from "trpc";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorDatepicker } from "./poor-datepicker";
import { PoorInput } from "./poor-input";
import { PoorSelect } from "./poor-select";
import { useFormState } from "hooks";

type PlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];

type PlayerRegistrationFormProps = {
    onReject: () => void;
    onResolve: (player: PlayerRegistration) => void;
    initialPlayerRegistration: PlayerRegistration;
};

export type Gender = "male" | "female";

export const genders = [
    { name: "Male", value: "male" as Gender },
    { name: "Female", value: "female" as Gender }
];

export const PlayerRegistrationForm = ({ onReject, onResolve, initialPlayerRegistration }: PlayerRegistrationFormProps) => {
    const [playerRegistration, changeHandler] = useFormState(initialPlayerRegistration, []);

    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow">
                    <Label>Name</Label>
                    <PoorInput value={playerRegistration.name} onChange={changeHandler("name")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Last Name</Label>
                    <PoorInput value={playerRegistration.lastName} onChange={changeHandler("lastName")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow basis-full">
                    <Label>Gender</Label>
                    <PoorSelect
                        initialValue={playerRegistration.gender}
                        items={genders}
                        nameKey="name"
                        valueKey="value"
                        onChange={changeHandler("gender")}
                    />
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Birth Date</Label>
                    <PoorDatepicker value={playerRegistration.birthDate} onChange={changeHandler("birthDate")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div>
                <div>
                    <Label>Team</Label>
                    <PoorInput value={playerRegistration.team} onChange={changeHandler("team")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Country</Label>
                    <PoorInput value={playerRegistration.country} onChange={changeHandler("country")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>City</Label>
                    <PoorInput value={playerRegistration.city} onChange={changeHandler("city")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Email</Label>
                    <PoorInput value={playerRegistration.email} onChange={changeHandler("email")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Phone Number</Label>
                    <PoorInput value={playerRegistration.phoneNumber} onChange={changeHandler("phoneNumber")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Ice Phone Number</Label>
                    <PoorInput value={playerRegistration.icePhoneNumber} onChange={changeHandler("icePhoneNumber")} />
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...playerRegistration })}>
                    <Icon size={1} path={mdiContentSaveCheck} />
                    <span className="ml-2">Save</span>
                </Button>
                <Button onClick={onReject} className="ml-2">
                    <Icon size={1} path={mdiClose} />
                    <span className="ml-2">Cancel</span>
                </Button>
            </div>
        </div>
    );
};
