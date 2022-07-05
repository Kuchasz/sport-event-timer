import Icon from "@mdi/react";
import {
    Button,
    Input,
    Modal,
    Select
    } from "react-daisyui";
import { mdiContentSaveCheck } from "@mdi/js";
import { RegistrationPlayer } from "@set/timer/model";

type PlayerCreateProps = {
    isOpen: boolean;
    onCancel: () => void;
    onCreate: (player: RegistrationPlayer) => void;
};

export const PlayerCreate = ({ isOpen, onCancel, onCreate }: PlayerCreateProps) => {
    const newPlayer: RegistrationPlayer = {
        id: 0,
        classificationId: "",
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
                            <Select>
                                <Select.Option value="rnk_pro">RnK PRO</Select.Option>
                                <Select.Option value="rnk_fun">RnK FUN</Select.Option>
                                <Select.Option value="rnk_tt">RnK TT</Select.Option>
                                <Select.Option value="gc">GC</Select.Option>
                                <Select.Option value={undefined} disabled selected></Select.Option>
                            </Select>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Name</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Last Name</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="form-control grow basis-full">
                            <label className="label">
                                <span className="label-text">Gender</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Select>
                                <Select.Option value="female">Female</Select.Option>
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value={undefined} disabled selected></Select.Option>
                            </Select>
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow basis-full">
                            <label className="label">
                                <span className="label-text">Birth Date</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input />
                        </div>
                    </div>
                    <div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Team</span>
                            </label>
                            <Input />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Country</span>
                            </label>
                            <Input />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">City</span>
                            </label>
                            <Input />
                        </div>
                    </div>

                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <Input />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Phone Number</span>
                            </label>
                            <Input />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Ice Phone Number</span>
                            </label>
                            <Input />
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Actions>
                <Button onClick={() => onCreate(newPlayer)} startIcon={<Icon size={1} path={mdiContentSaveCheck} />}>
                    save
                </Button>
                <Button onClick={onCancel}>cancel</Button>
            </Modal.Actions>
        </Modal>
    );
};
