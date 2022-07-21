import Icon from "@mdi/react";
import { Button } from "./button";
import { InferMutationInput } from "../trpc";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";

type Race = InferMutationInput<"race.add">;

type RaceFormProps = {
    onReject: () => void;
    onResolve: (player: Race) => void;
    initialRace: Race;
};

export const RaceForm = ({ onReject, onResolve, initialRace }: RaceFormProps) => {
    const [race, changeHandler] = useFormState(initialRace, [initialRace]);
    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <PoorInput value={race.name} onChange={changeHandler("name")} />
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...race })}>
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
