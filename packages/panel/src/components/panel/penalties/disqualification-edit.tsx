import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { DisqualificationForm } from "./disqualification-form";
import { trpc } from "src/trpc-core";
import { useCurrentRaceId } from "src/hooks";

type Disqualification = AppRouterOutputs["disqualification"]["allDisqualifications"][0];
type UpdateDisqualification = AppRouterInputs["disqualification"]["update"];

type DisqualificationEditProps = {
    editedDisqualification: Disqualification;
    onReject: () => void;
    onResolve: (disqualification: UpdateDisqualification) => void;
};

export const DisqualificationEdit = ({ editedDisqualification, onReject, onResolve }: DisqualificationEditProps) => {
    const updateDisqualificationMutation = trpc.disqualification.update.useMutation();
    const raceId = useCurrentRaceId();
    const { data: bibNumbers } = trpc.bibNumber.nonDisqualifiedPlayerNumbers.useQuery(
        { raceId, bibNumber: editedDisqualification.bibNumber },
        { initialData: [] },
    );

    const disqualification: UpdateDisqualification = {
        id: editedDisqualification.id,
        bibNumber: editedDisqualification.bibNumber,
        raceId: editedDisqualification.raceId,
        reason: editedDisqualification.reason,
    };

    const processDisqualificationEdit = async (editedDisqualification: UpdateDisqualification) => {
        await updateDisqualificationMutation.mutateAsync({ ...editedDisqualification });
        onResolve(editedDisqualification);
    };

    return (
        <DisqualificationForm
            isLoading={updateDisqualificationMutation.isLoading}
            onReject={onReject}
            onResolve={processDisqualificationEdit}
            initialDisqualification={disqualification}
            bibNumbers={bibNumbers}
        />
    );
};
