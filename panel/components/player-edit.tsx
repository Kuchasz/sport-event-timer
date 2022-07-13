import Icon from "@mdi/react";
import {
    Button,
    Input,
    Modal,
    Select
    } from "react-daisyui";
import { InferQueryOutput } from "../trpc";
import { mdiContentSaveCheck } from "@mdi/js";

type Player = InferQueryOutput<"player.players">[0];

type PlayerEditProps = {
    isOpen: boolean;
    editedPlayer?: Player;
    onCancel: () => void;
    onEdit: (player: Player | undefined) => void;
};

export const PlayerEdit = ({ isOpen, editedPlayer, onCancel, onEdit }: PlayerEditProps) => (
    <Modal open={isOpen} className="max-w-[52rem]">
        <Modal.Header className="font-bold">Edit player</Modal.Header>
        <Modal.Body>
            <div className="flex flex-col">
                <div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Classification</span>
                            <span className="label-text-alt">Required</span>
                        </label>
                        {isOpen && editedPlayer && (
                            <Select initialValue={editedPlayer.classificationId}>
                                <Select.Option value={"rnk_pro"}>RnK PRO</Select.Option>
                                <Select.Option value={"rnk_fun"}>RnK FUN</Select.Option>
                                <Select.Option value={"rnk_tt"}>RnK TT</Select.Option>
                                <Select.Option value={"gc"}>GC</Select.Option>
                            </Select>
                        )}
                    </div>
                </div>
                <div className="flex">
                    <div className="form-control grow">
                        <label className="label">
                            <span className="label-text">Name</span>
                            <span className="label-text-alt">Required</span>
                        </label>
                        <Input value={editedPlayer?.name} />
                    </div>
                    <div className="p-2"></div>
                    <div className="form-control grow">
                        <label className="label">
                            <span className="label-text">Last Name</span>
                            <span className="label-text-alt">Required</span>
                        </label>
                        <Input value={editedPlayer?.lastName} />
                    </div>
                </div>
                <div className="flex">
                    <div className="form-control grow basis-full">
                        <label className="label">
                            <span className="label-text">Gender</span>
                            <span className="label-text-alt">Required</span>
                        </label>
                        {isOpen && (
                            <Select initialValue={editedPlayer?.gender}>
                                <Select.Option value="female">Female</Select.Option>
                                <Select.Option value="male">Male</Select.Option>
                            </Select>
                        )}
                    </div>
                    <div className="p-2"></div>
                    <div className="form-control grow basis-full">
                        <label className="label">
                            <span className="label-text">Birth Date</span>
                            <span className="label-text-alt">Required</span>
                        </label>
                        <Input value={editedPlayer?.birthDate.toString()} />
                    </div>
                </div>
                <div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Team</span>
                        </label>
                        <Input value={editedPlayer?.team ?? ""} />
                    </div>
                </div>
                <div className="flex">
                    <div className="form-control grow">
                        <label className="label">
                            <span className="label-text">Country</span>
                        </label>
                        <Input value={editedPlayer?.country ?? ""} />
                    </div>
                    <div className="p-2"></div>
                    <div className="form-control grow">
                        <label className="label">
                            <span className="label-text">City</span>
                        </label>
                        <Input value={editedPlayer?.city ?? ""} />
                    </div>
                </div>

                <div className="flex">
                    <div className="form-control grow">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <Input value={editedPlayer?.email ?? ""} />
                    </div>
                    <div className="p-2"></div>
                    <div className="form-control grow">
                        <label className="label">
                            <span className="label-text">Phone Number</span>
                        </label>
                        <Input value={editedPlayer?.phoneNumber ?? ""} />
                    </div>
                    <div className="p-2"></div>
                    <div className="form-control grow">
                        <label className="label">
                            <span className="label-text">Ice Phone Number</span>
                        </label>
                        <Input value={editedPlayer?.icePhoneNumber ?? ""} />
                    </div>
                </div>
            </div>
        </Modal.Body>

        <Modal.Actions>
            <Button onClick={() => onEdit(editedPlayer)} startIcon={<Icon size={1} path={mdiContentSaveCheck} />}>
                save
            </Button>
            <Button onClick={onCancel}>cancel</Button>
        </Modal.Actions>
    </Modal>
);
