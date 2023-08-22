"use client";

import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { BibNumberCreate } from "components/bib-number-create";
import { BibNumberEdit } from "components/bib-number-edit";
import { Demodal } from "demodal";
import { trpc } from "../../../../../trpc-core";
import { mdiPlus, mdiRestore, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { useCallback, useRef } from "react";
import { AppRouterInputs, AppRouterOutputs } from "../../../../../trpc";
import { Confirmation } from "components/confirmation";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { BibNumberCreateManyForm } from "components/bib-number-create-many";

type BibNumber = AppRouterOutputs["bibNumber"]["numbers"][0];
type EditedBibNumber = AppRouterInputs["bibNumber"]["update"];
type CreatedBibNumber = AppRouterInputs["bibNumber"]["add"];
type CreateManyBibNumbers = AppRouterInputs["bibNumber"]["addRange"];

const defaultColumns: ColDef<BibNumber>[] = [
    {
        field: "number",
        sortable: true,
        sort: "asc",
        filter: true,
        headerName: "Bib Number",
        comparator: (valueA, valueB) => valueA - valueB,
    },
    {
        field: "actions",
        width: 15,
        headerName: "Actions",
        cellRenderer: (props: { context: any; data: BibNumber }) => (
            <BibNumberDeleteButton refetch={props.context.refetch} bibNumber={props.data} />
        ),
    },
];

const BibNumberDeleteButton = ({ refetch, bibNumber }: { refetch: () => void; bibNumber: BibNumber }) => {
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

export const BibNumbers = () => {
    const raceId = useCurrentRaceId();
    const { data: bibNubers, refetch } = trpc.bibNumber.numbers.useQuery({ raceId: raceId! });
    const gridRef = useRef<AgGridReact<BibNumber>>(null);
    const updatebibNumberMutation = trpc.bibNumber.update.useMutation();
    const addBibNumberMutation = trpc.bibNumber.add.useMutation();
    const addRangeBibNumberMutation = trpc.bibNumber.addRange.useMutation();
    const deleteAllMutation = trpc.bibNumber.deleteAll.useMutation();

    const openCreateDialog = async () => {
        const bibNumber = await Demodal.open<CreatedBibNumber>(NiceModal, {
            title: "Create new BibNumber",
            component: BibNumberCreate,
            props: { raceId: raceId! },
        });

        if (bibNumber) {
            await addBibNumberMutation.mutateAsync(bibNumber);
            refetch();
        }
    };

    const openDeleteAllDialog = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete bibNumber`,
            component: Confirmation,
            props: {
                message: `You are trying to delete all Bib Numbers. Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await deleteAllMutation.mutateAsync({ raceId: raceId! });
            refetch();
        }
    };

    const openCreateManyDialog = async () => {
        const createManyBibNumbers = await Demodal.open<CreateManyBibNumbers>(NiceModal, {
            title: "Create many bib numbers",
            component: BibNumberCreateManyForm,
            props: { initialConfig: { raceId: raceId!, omitDuplicates: true } },
        });

        if (createManyBibNumbers) {
            await addRangeBibNumberMutation.mutateAsync(createManyBibNumbers);
            refetch();
        }
    };

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

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
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Bib Numbers</h2>
                    <h3 className="">Configure the bib numbers to easily assign them to players</h3>
                </div>

                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                    <Button className="ml-2" onClick={openCreateManyDialog}>
                        {/* <Icon size={1} path={mdiPlusM} /> */}
                        add many
                    </Button>{" "}
                    <Button className="ml-2" onClick={openDeleteAllDialog}>
                        <Icon size={1} path={mdiRestore} className="mr-2" />
                        remove all
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
