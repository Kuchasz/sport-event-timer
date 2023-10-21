import type { AppRouterInputs } from "trpc";
import { ApiKeyForm } from "./api-key-form";
import { useCurrentRaceId } from "hooks";
import { trpc } from "trpc-core";

type EditApiKey = AppRouterInputs["apiKey"]["addApiKey"]["key"];

type ApiKeyEditProps = {
    editedApiKey: EditApiKey;
    onReject: () => void;
    onResolve: (apiKey: EditApiKey) => void;
};

export const ApiKeyEdit = ({ editedApiKey, onReject, onResolve }: ApiKeyEditProps) => {
    const editApiKeyMutation = trpc.apiKey.editApiKey.useMutation();
    const raceId = useCurrentRaceId();

    const editApiKey = async (editedApiKey: EditApiKey) => {
        await editApiKeyMutation.mutateAsync({ raceId: raceId, key: editedApiKey });
        onResolve(editedApiKey);
    };

    return <ApiKeyForm isLoading={editApiKeyMutation.isLoading} onReject={onReject} onResolve={editApiKey} initialApiKey={editedApiKey} />;
};
