import Icon from "@mdi/react";
import { Button, Input, Modal } from "react-daisyui";
import { InferMutationInput } from "../trpc";
import { mdiContentSaveCheck } from "@mdi/js";
import { useFormState } from "hooks";

type Classification = InferMutationInput<"classification.add">;

type ClassificationCreateProps = {
    isOpen: boolean;
    onCancel: () => void;
    onCreate: (classification: Classification) => void;
};

const initialClassification = {
    raceId: 0,
    name: ""
};

export const ClassificationCreate = ({ isOpen, onCancel, onCreate }: ClassificationCreateProps) => {
    const [classification, changeHandler] = useFormState(initialClassification);

    return (
        <Modal open={isOpen} className="max-w-[52rem]">
            <Modal.Header className="font-bold">Create new classification</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col">
                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Id</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input value={classification.raceId} />
                        </div>
                        <div className="p-2"></div>
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Name</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input value={classification.name} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Actions>
                <Button
                    onClick={() => onCreate(classification)}
                    startIcon={<Icon size={1} path={mdiContentSaveCheck} />}
                >
                    save
                </Button>
                <Button onClick={onCancel}>cancel</Button>
            </Modal.Actions>
        </Modal>
    );
};
