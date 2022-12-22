import { AppRouterInputs } from "trpc";
import { ApiKeyForm } from "./api-key-form";

type CreateApiKey = AppRouterInputs["apiKey"]["addApiKey"]["key"];

type ApiKeyCreateProps = {
    onReject: () => void;
    onResolve: (apiKey: CreateApiKey) => void;
};

export const ApiKeyCreate = ({ onReject, onResolve }: ApiKeyCreateProps) => {
    const apiKey: CreateApiKey = {
        name: "",
    };

    return <ApiKeyForm onReject={onReject} onResolve={onResolve} initialApiKey={apiKey} />;
};
