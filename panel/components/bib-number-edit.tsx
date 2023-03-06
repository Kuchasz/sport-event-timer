import { BibNumberForm } from "./bib-number-form";
import { AppRouterInputs, AppRouterOutputs } from "../trpc";

type BibNumber = AppRouterOutputs["bibNumber"]["numbers"][0];
type EditBibNumber = AppRouterInputs["bibNumber"]["update"];

type BibNumberEditProps = {
    editedBibNumber: BibNumber;
    onReject: () => void;
    onResolve: (BibNumber: EditBibNumber) => void;
};

export const BibNumberEdit = ({ editedBibNumber, onReject, onResolve }: BibNumberEditProps) => (
    <BibNumberForm onReject={onReject} onResolve={onResolve} initialBibNumber={editedBibNumber} />
);
