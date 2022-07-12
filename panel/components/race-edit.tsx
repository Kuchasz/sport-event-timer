import Icon from "@mdi/react";
import { Button, Input, Modal } from "react-daisyui";
import { InferMutationInput } from "../trpc";
import { mdiContentSaveCheck } from "@mdi/js";
import { useFormState } from "hooks";

type Race = InferMutationInput<"race.update">;

type RaceEditProps = {
    isOpen: boolean;
    editedRace?: Race;
    onCancel: () => void;
    onEdit: (player: Race) => void;
};

export const RaceEdit = ({ isOpen, editedRace, onCancel, onEdit }: RaceEditProps) => {
    const [race, changeHandler] = useFormState(editedRace!);
    return (
        <Modal open={isOpen} className="max-w-[52rem]">
            <Modal.Header className="font-bold">Edit Race</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col">
                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Name</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input value={race?.name} onChange={changeHandler("name")} />
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Actions>
                <Button onClick={() => onEdit(race)} startIcon={<Icon size={1} path={mdiContentSaveCheck} />}>
                    save
                </Button>
                <Button onClick={onCancel}>cancel</Button>
            </Modal.Actions>
        </Modal>
    );
};
