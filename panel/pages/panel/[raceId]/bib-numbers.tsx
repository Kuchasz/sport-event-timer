import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { BibNumberCreate } from "components/bib-number-create";
import { BibNumberEdit } from "components/bib-number-edit";
import { Demodal } from "demodal";
import { trpc } from "../../../connection";
import { mdiPlus, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { useCurrentRaceId } from "../../../hooks";
import { useCallback, useRef } from "react";
import { AppRouterInputs, AppRouterOutputs } from "../../../trpc";
import { Confirmation } from "components/confirmation";
import { AgGridReact } from "@ag-grid-community/react";
import { getGridColumnStateAtom } from "states/grid-states";
import { useAtom } from "jotai";
import { ColDef } from "@ag-grid-community/core";

type BibNumber = AppRouterOutputs["bibNumber"]["numbers"][0];
type EditedBibNumber = AppRouterInputs["bibNumber"]["update"];
type CreatedBibNumber = AppRouterInputs["bibNumber"]["add"];

const defaultColumns: ColDef<BibNumber>[] = [
    { field: "index", headerName: "", width: 10 },
    { field: "number", sortable: true, filter: true, headerName: "Bib Number" },
    {
        field: "actions",
        width: 15,
        headerName: "Actions",
        cellRenderer: (props: { data: BibNumber }) => <BibNumberDeleteButton bibNumber={props.data} />,
    },
];

const BibNumberDeleteButton = ({ bibNumber }: { bibNumber: BibNumber }) => {
    const raceId = useCurrentRaceId();
    const { refetch } = trpc.bibNumber.numbers.useQuery({ raceId: raceId! });
    const deletebibNumberMutation = trpc.bibNumber.delete.useMutation();
    const deletebibNumber = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete bibNumber`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Bib Number ${bibNumber.number}. Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await deletebibNumberMutation.mutateAsync({ bibNumberId: bibNumber.id });
            refetch();
        }
    };
    return (
        <span className="flex items-center hover:text-red-600 cursor-pointer" onClick={deletebibNumber}>
            <Icon size={1} path={mdiTrashCan} />
            delete
        </span>
    );
};

const BibNumbers = () => {
    const raceId = useCurrentRaceId();
    const { data: bibNubers, refetch } = trpc.bibNumber.numbers.useQuery({ raceId: raceId! });
    const gridRef = useRef<AgGridReact<BibNumber>>(null);
    const updatebibNumberMutation = trpc.bibNumber.update.useMutation();
    const addClassifiationMutation = trpc.bibNumber.add.useMutation();
    const [gridColumnState, _setGridColumnState] = useAtom(
        getGridColumnStateAtom(
            "bib-numbers",
            defaultColumns.map(c => ({ hide: c.hide, colId: c.field! }))
        )
    );

    const openCreateDialog = async () => {
        const bibNumber = await Demodal.open<CreatedBibNumber>(NiceModal, {
            title: "Create new BibNumber",
            component: BibNumberCreate,
            props: { raceId: raceId! },
        });

        if (bibNumber) {
            await addClassifiationMutation.mutateAsync(bibNumber);
            refetch();
        }
    };

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.columnApi.applyColumnState({ state: gridColumnState });
        gridRef.current?.api.sizeColumnsToFit();
    }, [gridColumnState]);

    const openEditDialog = async (editedBibNumber?: BibNumber) => {
        const bibNumber = await Demodal.open<EditedBibNumber>(NiceModal, {
            title: "Edit BibNumber",
            component: BibNumberEdit,
            props: {
                editedBibNumber,
            },
        });

        if (bibNumber) {
            await updatebibNumberMutation.mutateAsync(bibNumber);
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Bib Numbers</title>
            </Head>
            <div className="ag-theme-material border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div>
                <AgGridReact<BibNumber>
                    ref={gridRef}
                    context={{ refetch }}
                    onRowDoubleClicked={e => openEditDialog(e.data)}
                    suppressCellFocus={true}
                    suppressAnimationFrame={true}
                    columnDefs={defaultColumns}
                    rowData={bibNubers}
                    onFirstDataRendered={onFirstDataRendered}
                    onGridSizeChanged={onFirstDataRendered}
                ></AgGridReact>
            </div>
        </>
    );
};

export default BibNumbers;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
