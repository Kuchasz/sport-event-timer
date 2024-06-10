import type { AppRouterInputs } from "src/trpc";
import { ApiKeyForm } from "./api-key-form";
import { trpc } from "src/trpc-core";
import { useCurrentRaceId } from "src/hooks";

type CreateApiKey = AppRouterInputs["apiKey"]["addApiKey"]["key"];

type ApiKeyCreateProps = {
    onReject: () => void;
    onResolve: (apiKey: CreateApiKey) => void;
};

export const ApiKeyCreate = ({ onReject, onResolve }: ApiKeyCreateProps) => {
    const addKeyMutation = trpc.apiKey.addApiKey.useMutation();
    const raceId = useCurrentRaceId();

    const apiKey: CreateApiKey = {
        name: "",
    };

    const createApiKey = async (apiKey: CreateApiKey) => {
        await addKeyMutation.mutateAsync({ raceId: raceId, key: apiKey });
        onResolve(apiKey);
    };

    return <ApiKeyForm isLoading={addKeyMutation.isPending} onReject={onReject} onResolve={createApiKey} initialApiKey={apiKey} />;
};
