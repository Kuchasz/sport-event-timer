import { AppRouterInputs } from "trpc";
import { ApiKeyForm } from "./api-key-form";

type EditApiKey = AppRouterInputs["apiKey"]["addApiKey"]["key"];

type ApiKeyEditProps = {
    editedApiKey: EditApiKey;
    onReject: () => void;
    onResolve: (apiKey: EditApiKey) => void;
};

export const ApiKeyEdit = ({ editedApiKey, onReject, onResolve }: ApiKeyEditProps) => {
    return <ApiKeyForm onReject={onReject} onResolve={onResolve} initialApiKey={editedApiKey} />;
};
