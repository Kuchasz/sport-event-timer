import Icon from "@mdi/react";
import { Button } from "./button";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";

type ApiKey = AppRouterInputs["apiKey"]["addApiKey"]["key"];

type ApiKeyFormProps = {
    onReject: () => void;
    onResolve: (apiKey: ApiKey) => void;
    initialApiKey: ApiKey;
};

export const ApiKeyForm = ({ onReject, onResolve, initialApiKey }: ApiKeyFormProps) => {
    const [apiKey, changeHandler] = useFormState(initialApiKey, [initialApiKey]);
    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow">
                    <Label>Name</Label>
                    <PoorInput value={apiKey.name} onChange={changeHandler("name")} />
                </div>
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} className="ml-2">
                    <Icon size={1} path={mdiClose} />
                    <span className="ml-2">Cancel</span>
                </Button>
                <Button onClick={() => onResolve({ ...apiKey })}>
                    <Icon size={1} path={mdiContentSaveCheck} />
                    <span className="ml-2">Save</span>
                </Button>
            </div>
        </div>
    );
};
