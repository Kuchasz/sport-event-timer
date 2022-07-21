import Icon from "@mdi/react";
import { Button } from "./button";
import { InferMutationInput, InferQueryOutput } from "../trpc";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorDatepicker } from "./poor-datepicker";
import { PoorInput } from "./poor-input";
import { PoorNumberInput } from "./poor-number-input";
import { PoorSelect } from "./poor-select";
import { useFormState } from "hooks";

type Player = InferMutationInput<"player.add">["player"];

type PlayerFormProps = {
    onReject: () => void;
    onResolve: (player: Player) => void;
    initialPlayer: Player;
    classifications: InferQueryOutput<"classification.classifications">;
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
                <div className="form-control grow basis-full">
                    <label className="label">
                        <span className="label-text">Classification</span>
                        <span className="label-text-alt">Required</span>
                    </label>
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
                <div className="form-control grow basis-full">
                    <label className="label">
                        <span className="label-text">Bib Number</span>
                    </label>
                    <PoorNumberInput value={player.bibNumber} onChange={changeHandler("bibNumber")} />
                </div>
            </div>
            <div className="flex">
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">Name</span>
                        <span className="label-text-alt">Required</span>
                    </label>
                    <PoorInput value={player.name} onChange={changeHandler("name")} />
                </div>
                <div className="p-2"></div>
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">Last Name</span>
                        <span className="label-text-alt">Required</span>
                    </label>
                    <PoorInput value={player.lastName} onChange={changeHandler("lastName")} />
                </div>
            </div>
            <div className="flex">
                <div className="form-control grow basis-full">
                    <label className="label">
                        <span className="label-text">Gender</span>
                        <span className="label-text-alt">Required</span>
                    </label>
                    <PoorSelect
                        initialValue={player.gender}
                        items={genders}
                        nameKey="name"
                        valueKey="value"
                        onChange={changeHandler("gender")}
                    />
                </div>
                <div className="p-2"></div>
                <div className="form-control grow basis-full">
                    <label className="label">
                        <span className="label-text">Birth Date</span>
                        <span className="label-text-alt">Required</span>
                    </label>
                    <PoorDatepicker value={player.birthDate} onChange={changeHandler("birthDate")} />
                </div>
            </div>
            <div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Team</span>
                    </label>
                    <PoorInput value={player.team} onChange={changeHandler("team")} />
                </div>
            </div>
            <div className="flex">
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">Country</span>
                    </label>
                    <PoorInput value={player.country} onChange={changeHandler("country")} />
                </div>
                <div className="p-2"></div>
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">City</span>
                    </label>
                    <PoorInput value={player.city} onChange={changeHandler("city")} />
                </div>
            </div>

            <div className="flex">
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <PoorInput value={player.email} onChange={changeHandler("email")} />
                </div>
                <div className="p-2"></div>
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">Phone Number</span>
                    </label>
                    <PoorInput value={player.phoneNumber} onChange={changeHandler("phoneNumber")} />
                </div>
                <div className="p-2"></div>
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">Ice Phone Number</span>
                    </label>
                    <PoorInput value={player.icePhoneNumber} onChange={changeHandler("icePhoneNumber")} />
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
