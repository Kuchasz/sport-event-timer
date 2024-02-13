import type { AppRouterInputs } from "src/trpc";
import { DisqualificationForm } from "./disqualification-form";
import { trpc } from "src/trpc-core";
import { useCurrentRaceId } from "src/hooks";

type CreateDisqualification = AppRouterInputs["disqualification"]["disqualify"];

type DisqualificationCreateProps = {
    onReject: () => void;
    onResolve: (disqualification: CreateDisqualification) => void;
};

export const DisqualificationCreate = ({ onReject, onResolve }: DisqualificationCreateProps) => {
    const addDisqualificationMutation = trpc.disqualification.disqualify.useMutation();

    const raceId = useCurrentRaceId();
    const { data: bibNumbers } = trpc.bibNumber.nonDisqualifiedPlayerNumbers.useQuery({ raceId }, { initialData: [] });

    const Disqualification: CreateDisqualification = {
        raceId,
        bibNumber: "",
        reason: "",
    };

    const processDisqualificationCreate = async (disqualification: CreateDisqualification) => {
        await addDisqualificationMutation.mutateAsync({ ...disqualification });
        onResolve(disqualification);
    };

    return (
        <DisqualificationForm
            isLoading={addDisqualificationMutation.isLoading}
            onReject={onReject}
            onResolve={processDisqualificationCreate}
            initialDisqualification={Disqualification}
            bibNumbers={bibNumbers}
        />
    );
};
