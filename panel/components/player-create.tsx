import Icon from "@mdi/react";
import {
    Button,
    Input,
    Modal,
    Select
    } from "react-daisyui";
import { CurrentRaceContext } from "../current-race-context";
import { InferMutationInput, trpc } from "../trpc";
import { mdiContentSaveCheck } from "@mdi/js";
import { useContext } from "react";
import { useFormState } from "hooks";

type Player = InferMutationInput<"player.add">;

type PlayerCreateProps = {
    isOpen: boolean;
    onCancel: () => void;
    onCreate: (player: Player) => void;
};

const initialPlayer: Player = {
    classificationId: 0,
    name: "",
    lastName: "",
    gender: "male",
    birthDate: new Date(),
    country: "",
    city: "",
    team: "",
    email: "",
    phoneNumber: "",
    icePhoneNumber: ""
};

const PoorSelect = <T, TNameKey extends keyof T, TValueKey extends keyof T>({
    items,
    nameKey,
    valueKey,
    onChange
}: {
    items: T[];
    nameKey: TNameKey;
    valueKey: TValueKey;
    onChange: (event: { target: { value: T[TValueKey] } }) => void;
}) => (
    <Select
        onChange={(e: T[TValueKey]) => {
            onChange({ target: { value: e } });
        }}
    >
        {items.map(i => (
            <Select.Option value={i[valueKey] as unknown as string | number | undefined}>
                {i[nameKey] as unknown as string | number | undefined}
            </Select.Option>
        ))}
    </Select>
);

const genders = [
    { name: "Male", value: "male" as "male" | "female" },
    { name: "Female", value: "female" as "male" | "female" }
];

export const PlayerCreate = ({ isOpen, onCancel, onCreate }: PlayerCreateProps) => {
    const [player, changeHandler, reset] = useFormState(initialPlayer);
    const { raceId } = useContext(CurrentRaceContext);
    const { data: classifications } = trpc.useQuery(["classification.classifications", { raceId: raceId! }]);

    return (
        <Modal open={isOpen} className="max-w-[52rem]">
            <Modal.Header className="font-bold">Create new player</Modal.Header>

            <Modal.Body>
                <div className="flex flex-col">
                    <div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Classification</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            {classifications && (
                                <PoorSelect
                                    items={classifications}
                                    nameKey="name"
                                    valueKey="id"
                                    onChange={changeHandler("classificationId")}
                                ></PoorSelect>
                            )}
                            {/* <Select
                                initialValue={initialPlayer.classificationId}
                                onChange={changeHandler("classificationId")}
                            >
                                <Select.Option value="rnk_pro">RnK PRO</Select.Option>
                                <Select.Option value="rnk_fun">RnK FUN</Select.Option>
                                <Select.Option value="rnk_tt">RnK TT</Select.Option>
                                <Select.Option value="gc">GC</Select.Option>
                                <Select.Option value={undefined} disabled></Select.Option>
                            </Select> */}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Name</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input value={player.name} onChange={changeHandler("name")} />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Last Name</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input value={player.lastName} onChange={changeHandler("lastName")} />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="form-control grow basis-full">
                            <label className="label">
                                <span className="label-text">Gender</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <PoorSelect
                                items={genders}
                                nameKey="name"
                                valueKey="value"
                                onChange={changeHandler("gender")}
                            />
                            {/* <Select initialValue={player.gender} onChange={changeHandler("gender")}>
                                <Select.Option value="female">Female</Select.Option>
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value={undefined} disabled></Select.Option>
                            </Select> */}
                        </div>
                        <div className="p-2"></div>
                        {/* <div className="form-control grow basis-full">
                            <label className="label">
                                <span className="label-text">Birth Date</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input value={player.birthDate} onChange={changeHandler("birthDate")} />
                        </div> */}
                    </div>
                    <div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Team</span>
                            </label>
                            <Input value={player.team ?? ""} onChange={changeHandler("team")} />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Country</span>
                            </label>
                            <Input value={player.country ?? ""} onChange={changeHandler("country")} />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">City</span>
                            </label>
                            <Input value={player.city ?? ""} onChange={changeHandler("city")} />
                        </div>
                    </div>

                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <Input value={player.email ?? ""} onChange={changeHandler("email")} />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Phone Number</span>
                            </label>
                            <Input value={player.phoneNumber ?? ""} onChange={changeHandler("phoneNumber")} />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Ice Phone Number</span>
                            </label>
                            <Input value={player.icePhoneNumber ?? ""} onChange={changeHandler("icePhoneNumber")} />
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Actions>
                <Button onClick={() => onCreate(player)} startIcon={<Icon size={1} path={mdiContentSaveCheck} />}>
                    save
                </Button>
                <Button onClick={onCancel}>cancel</Button>
            </Modal.Actions>
        </Modal>
    );
};
