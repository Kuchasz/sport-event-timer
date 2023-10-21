import { trpc } from "trpc-core";
import { BibNumberForm } from "./bib-number-form";
import type { AppRouterInputs } from "trpc";

type CreateBibNumber = AppRouterInputs["bibNumber"]["add"];

type BibNumberCreateProps = {
    raceId: number;
    onReject: () => void;
    onResolve: (BibNumber: CreateBibNumber) => void;
};

export const BibNumberCreate = ({ raceId, onReject, onResolve }: BibNumberCreateProps) => {
    const addBibNumberMutation = trpc.bibNumber.add.useMutation();

    const BibNumber: CreateBibNumber = {
        id: 0,
        raceId,
        number: "",
    };

    const createBibNumber = async (bibNumber: CreateBibNumber) => {
        await addBibNumberMutation.mutateAsync(bibNumber);
        onResolve(bibNumber);
    };

    return (
        <BibNumberForm
            isLoading={addBibNumberMutation.isLoading}
            onReject={onReject}
            onResolve={createBibNumber}
            initialBibNumber={BibNumber}
        />
    );
};
