import { Button } from "./button";
import { Label } from "./label";
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
                    Cancel
                </Button>
                <Button onClick={() => onResolve({ ...apiKey })}>Save</Button>
            </div>
        </div>
    );
};
