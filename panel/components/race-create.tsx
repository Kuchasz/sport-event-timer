import Icon from "@mdi/react";
import { Button, Input, Modal } from "react-daisyui";
import { InferMutationInput } from "../trpc";
import { mdiContentSaveCheck } from "@mdi/js";

type Race = InferMutationInput<"race.add">;

type RaceCreateProps = {
    isOpen: boolean;
    onCancel: () => void;
    onCreate: (Race: Race) => void;
};

export const RaceCreate = ({ isOpen, onCancel, onCreate }: RaceCreateProps) => {
    const newRace: Race = {
        name: ""
    };

    return (
        <Modal open={isOpen} className="max-w-[52rem]">
            <Modal.Header className="font-bold">Create new Race</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col">
                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Id</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Name</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Actions>
                <Button onClick={() => onCreate(newRace)} startIcon={<Icon size={1} path={mdiContentSaveCheck} />}>
                    save
                </Button>
                <Button onClick={onCancel}>cancel</Button>
            </Modal.Actions>
        </Modal>
    );
};
