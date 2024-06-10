import { BibNumberForm } from "./bib-number-form";
import type { AppRouterInputs, AppRouterOutputs } from "../../../trpc";
import { trpc } from "src/trpc-core";

type BibNumber = AppRouterOutputs["bibNumber"]["numbers"][0];
type EditBibNumber = AppRouterInputs["bibNumber"]["update"];

type BibNumberEditProps = {
    editedBibNumber: BibNumber;
    onReject: () => void;
    onResolve: (BibNumber: EditBibNumber) => void;
};

export const BibNumberEdit = ({ editedBibNumber, onReject, onResolve }: BibNumberEditProps) => {
    const updateBibNumberMutation = trpc.bibNumber.update.useMutation();

    const editBibNumber = async (bibNumber: EditBibNumber) => {
        await updateBibNumberMutation.mutateAsync(bibNumber);
        onResolve(bibNumber);
    };

    return (
        <BibNumberForm
            isLoading={updateBibNumberMutation.isPending}
            onReject={onReject}
            onResolve={editBibNumber}
            initialBibNumber={editedBibNumber}
        />
    );
};
