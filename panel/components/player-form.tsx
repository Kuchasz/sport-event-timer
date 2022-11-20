import Icon from "@mdi/react";
import { Button } from "./button";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorDatepicker } from "./poor-datepicker";
import { PoorInput } from "./poor-input";
import { PoorNumberInput } from "./poor-number-input";
import { PoorSelect } from "./poor-select";
import { PoorTimepicker } from "./poor-timepicker";
import { useFormState } from "hooks";

type Player = AppRouterInputs["player"]["add"]["player"];

type PlayerFormProps = {
    onReject: () => void;
    onResolve: (player: Player) => void;
    initialPlayer: Player;
    classifications: AppRouterOutputs["classification"]["classifications"];
};

export type Gender = "male" | "female";

export const genders = [
    { name: "Male", value: "male" as Gender },
    { name: "Female", value: "female" as Gender }
];

export const PlayerForm = ({ onReject, onResolve, initialPlayer, classifications }: PlayerFormProps) => {
    const [player, changeHandler] = useFormState(initialPlayer, [classifications]);

    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow basis-full">
                    <Label>Classification</Label>
                    {classifications && classifications.length ? (
                        <PoorSelect
                            initialValue={player.classificationId}
                            items={classifications}
                            nameKey="name"
                            valueKey="id"
                            onChange={changeHandler("classificationId")}
                        ></PoorSelect>
                    ) : null}
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Bib Number</Label>
                    <PoorNumberInput value={player.bibNumber} onChange={changeHandler("bibNumber")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Name</Label>
                    <PoorInput value={player.name} onChange={changeHandler("name")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Last Name</Label>
                    <PoorInput value={player.lastName} onChange={changeHandler("lastName")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow basis-full">
                    <Label>Gender</Label>
                    <PoorSelect
                        initialValue={player.gender}
                        items={genders}
                        nameKey="name"
                        valueKey="value"
                        onChange={changeHandler("gender")}
                    />
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Birth Date</Label>
                    <PoorDatepicker value={player.birthDate} onChange={changeHandler("birthDate")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div>
                <div>
                    <Label>Team</Label>
                    <PoorInput value={player.team} onChange={changeHandler("team")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Country</Label>
                    <PoorInput value={player.country} onChange={changeHandler("country")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>City</Label>
                    <PoorInput value={player.city} onChange={changeHandler("city")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Email</Label>
                    <PoorInput value={player.email} onChange={changeHandler("email")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Phone Number</Label>
                    <PoorInput value={player.phoneNumber} onChange={changeHandler("phoneNumber")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Ice Phone Number</Label>
                    <PoorInput value={player.icePhoneNumber} onChange={changeHandler("icePhoneNumber")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Start Time</Label>
                    <PoorTimepicker value={player.startTime} onChange={changeHandler("startTime")} />
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...player })}>
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
