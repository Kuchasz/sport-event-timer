import Icon from "@mdi/react";
import { Button, Input, Modal } from "react-daisyui";
import { InferMutationInput } from "../trpc";
import { mdiContentSaveCheck } from "@mdi/js";
import { useFormState } from "hooks";

type Classification = InferMutationInput<"classification.update">;

type ClassificationEditProps = {
    isOpen: boolean;
    editedClassification?: Classification;
    onCancel: () => void;
    onEdit: (player: Classification) => void;
};

export const ClassificationEdit = ({ isOpen, editedClassification, onCancel, onEdit }: ClassificationEditProps) => {
    const [classification, changeHandler] = useFormState(editedClassification!);

    return (
        <Modal open={isOpen && classification !== undefined} className="max-w-[52rem]">
            <Modal.Header className="font-bold">Edit classification</Modal.Header>
            <Modal.Body>
                {classification && (
                    <div className="flex flex-col">
                        <div className="flex">
                            <div className="form-control grow">
                                <label className="label">
                                    <span className="label-text">Id</span>
                                    <span className="label-text-alt">Required</span>
                                </label>
                                <Input value={classification.id} disabled />
                            </div>
                            <div className="p-2"></div>
                            <div className="form-control grow">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                    <span className="label-text-alt">Required</span>
                                </label>
                                <Input value={classification.name} onChange={changeHandler("name")} />
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Actions>
                {classification && (
                    <Button
                        onClick={() => onEdit(classification)}
                        startIcon={<Icon size={1} path={mdiContentSaveCheck} />}
                    >
                        save
                    </Button>
                )}
                <Button onClick={onCancel}>cancel</Button>
            </Modal.Actions>
        </Modal>
    );
};
