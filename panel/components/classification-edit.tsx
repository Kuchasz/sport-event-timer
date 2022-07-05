import Icon from "@mdi/react";
import { Button, Input, Modal } from "react-daisyui";
import { Classification } from "@set/timer/model";
import { mdiContentSaveCheck } from "@mdi/js";

type ClassificationEditProps = {
    isOpen: boolean;
    editedClassification?: Classification;
    onCancel: () => void;
    onEdit: (player: Classification | undefined) => void;
};

export const ClassificationEdit = ({ isOpen, editedClassification, onCancel, onEdit }: ClassificationEditProps) => (
    <Modal open={isOpen} className="max-w-[52rem]">
        <Modal.Header className="font-bold">Edit classification</Modal.Header>
        <Modal.Body>
            <div className="flex flex-col">
                <div className="flex">
                    <div className="form-control grow">
                        <label className="label">
                            <span className="label-text">Id</span>
                            <span className="label-text-alt">Required</span>
                        </label>
                        <Input value={editedClassification?.id} />
                    </div>
                    <div className="p-2"></div>
                    <div className="form-control grow">
                        <label className="label">
                            <span className="label-text">Name</span>
                            <span className="label-text-alt">Required</span>
                        </label>
                        <Input value={editedClassification?.name} />
                    </div>
                </div>
            </div>
        </Modal.Body>

        <Modal.Actions>
            <Button
                onClick={() => onEdit(editedClassification)}
                startIcon={<Icon size={1} path={mdiContentSaveCheck} />}
            >
                save
            </Button>
            <Button onClick={onCancel}>cancel</Button>
        </Modal.Actions>
    </Modal>
);
