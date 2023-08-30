"use client";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { ClassificationCreate } from "components/classification-create";
import { ClassificationEdit } from "components/classification-edit";
import { Demodal } from "demodal";
import { trpc } from "../../../../../../trpc-core";
import { mdiAccountMultiple, mdiAccountMultiplePlusOutline, mdiPlus } from "@mdi/js";
import { NiceModal } from "components/modal";
import { useCurrentRaceId } from "../../../../../../hooks";
import { useCallback, useRef } from "react";
import { AppRouterInputs, AppRouterOutputs } from "../../../../../../trpc";
import Link from "next/link";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { Route } from "next";
import { PageHeader } from "components/page-header";

type Classification = AppRouterOutputs["classification"]["classifications"][0];
type EditedClassification = AppRouterInputs["classification"]["update"];
type CreatedClassification = AppRouterInputs["classification"]["add"];

const defaultColumns: ColDef<Classification>[] = [
    { field: "index", headerName: "", sortable: true },
    { field: "name", headerName: "Name", sortable: true, filter: true },
    {
        field: "actions",
        headerName: "Actions",
        cellRenderer: (props: { data: Classification }) => <OpenCategoriesButton classification={props.data} />,
    },
];

const OpenCategoriesButton = ({ classification }: { classification: Classification }) => {
    return (
        <span className="flex items-center hover:text-red-600 cursor-pointer">
            <Icon size={1} path={mdiAccountMultiple} />
            <Link href={`/panel/${classification.raceId}/classifications/${classification.id}` as Route}>
                <span>categories</span>
            </Link>
        </span>
    );
};

export const Classifications = () => {
    const raceId = useCurrentRaceId();
    const { data: classifications, refetch } = trpc.classification.classifications.useQuery({ raceId: raceId! }, { initialData: [] });
    const updateClassificationMutation = trpc.classification.update.useMutation();
    const addClassifiationMutation = trpc.classification.add.useMutation();
    const gridRef = useRef<AgGridReact<Classification>>(null);

    const openCreateDialog = async () => {
        const classification = await Demodal.open<CreatedClassification>(NiceModal, {
            title: "Create new classification",
            component: ClassificationCreate,
            props: { raceId: raceId! },
        });

        if (classification) {
            await addClassifiationMutation.mutateAsync(classification);
            refetch();
        }
    };

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

    const openEditDialog = async (editedClassification?: Classification) => {
        const classification = await Demodal.open<EditedClassification>(NiceModal, {
            title: "Edit classification",
            component: ClassificationEdit,
            props: {
                editedClassification,
            },
        });

        if (classification) {
            await updateClassificationMutation.mutateAsync(classification);
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Classifications</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <PageHeader title="Classifications" description="Configure race classifications" />
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">Add Classification</span>
                    </Button>
                    <div className="px-1"></div>
                    <Button autoCapitalize="false">
                        <Icon size={1} path={mdiAccountMultiplePlusOutline} />
                        <span className="ml-2">Load</span>
                    </Button>
                </div>
                <div className="ag-theme-material h-full">
                    <AgGridReact<Classification>
                        ref={gridRef}
                        context={{ refetch }}
                        onRowDoubleClicked={e => openEditDialog(e.data)}
                        suppressCellFocus={true}
                        suppressAnimationFrame={true}
                        columnDefs={defaultColumns}
                        rowData={classifications}
                        onFirstDataRendered={onFirstDataRendered}
                        onGridSizeChanged={onFirstDataRendered}
                    ></AgGridReact>
                </div>
            </div>
        </>
    );
};