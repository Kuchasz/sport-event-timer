import { BibNumberForm } from "./bib-number-form";
import { AppRouterInputs } from "trpc";

type CreateBibNumber = AppRouterInputs["bibNumber"]["add"];

type BibNumberCreateProps = {
    raceId: number;
    onReject: () => void;
    onResolve: (BibNumber: CreateBibNumber) => void;
};

export const BibNumberCreate = ({ raceId, onReject, onResolve }: BibNumberCreateProps) => {
    const BibNumber: CreateBibNumber = {
        id: 0,
        raceId,
        number: ""
    };

    return <BibNumberForm onReject={onReject} onResolve={onResolve} initialBibNumber={BibNumber} />;
};
