import Icon from "@mdi/react";
import { Button, Input, Modal } from "react-daisyui";
import { InferMutationInput } from "../trpc";
import { mdiContentSaveCheck } from "@mdi/js";
import { useFormState } from "hooks";

type Race = InferMutationInput<"race.add">;

type RaceCreateProps = {
    isOpen: boolean;
    onCancel: () => void;
    onCreate: (Race: Race) => void;
};

const initialRace = {
    name: ""
};

export const RaceCreate = ({ isOpen, onCancel, onCreate }: RaceCreateProps) => {
    const [race, changeHandler] = useFormState(initialRace);

    return (
        <Modal open={isOpen} className="max-w-[52rem]">
            <Modal.Header className="font-bold">Create new Race</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col">
                    <div className="flex">
                        <div className="form-control grow">
                            <label className="label">
                                <span className="label-text">Name</span>
                                <span className="label-text-alt">Required</span>
                            </label>
                            <Input value={race.name} onChange={changeHandler("name")} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Actions>
                <Button onClick={() => onCreate(race)} startIcon={<Icon size={1} path={mdiContentSaveCheck} />}>
                    save
                </Button>
                <Button onClick={onCancel}>cancel</Button>
            </Modal.Actions>
        </Modal>
    );
};
