"use client";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { ClassificationCreate } from "components/panel/classification/classification-create";
import { ClassificationEdit } from "components/panel/classification/classification-edit";
import { Demodal } from "demodal";
import { trpc } from "../../../../../trpc-core";
import { mdiAccountMultiple, mdiAccountMultiplePlusOutline, mdiPlus } from "@mdi/js";
import { NiceModal } from "components/modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { useCallback, useRef } from "react";
import type { AppRouterInputs, AppRouterOutputs } from "../../../../../trpc";
import Link from "next/link";
import { AgGridReact } from "@ag-grid-community/react";
import type { ColDef } from "@ag-grid-community/core";
import type { Route } from "next";
import { PageHeader } from "components/page-header";
import { useTranslations } from "next-intl";
import { refreshRow } from "ag-grid";

type Classification = AppRouterOutputs["classification"]["classifications"][0];
type EditedClassification = AppRouterInputs["classification"]["update"];
type CreatedClassification = AppRouterInputs["classification"]["add"];

const OpenCategoriesButton = ({ classification }: { classification: Classification }) => {
    const t = useTranslations();
    return (
        <span className="flex cursor-pointer items-center hover:text-red-600">
            <Icon size={0.8} path={mdiAccountMultiple} />
            <Link href={`/${classification.raceId}/classifications/${classification.id}` as Route}>
                <span>{t("pages.classifications.categories.button")}</span>
            </Link>
        </span>
    );
};

export const Classifications = () => {
    const raceId = useCurrentRaceId();
    const { data: classifications, refetch } = trpc.classification.classifications.useQuery({ raceId: raceId }, { initialData: [] });
    const gridRef = useRef<AgGridReact<Classification>>(null);
    const t = useTranslations();

    const openCreateDialog = async () => {
        const classification = await Demodal.open<CreatedClassification>(NiceModal, {
            title: t("pages.classifications.create.title"),
            component: ClassificationCreate,
            props: { raceId: raceId },
        });

        if (classification) {
            void refetch();
        }
    };

    const defaultColumns: ColDef<Classification>[] = [
        { headerName: t("pages.classifications.grid.columns.index"), sortable: true, valueGetter: r => r.node?.rowIndex },
        { field: "name", headerName: t("pages.classifications.grid.columns.name"), sortable: true, filter: true },
        {
            headerName: t("pages.classifications.grid.columns.actions"),
            cellRenderer: (props: { data: Classification }) => <OpenCategoriesButton classification={props.data} />,
        },
    ];

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

    const openEditDialog = async (editedClassification?: Classification) => {
        const classification = await Demodal.open<EditedClassification>(NiceModal, {
            title: t("pages.classifications.edit.title"),
            component: ClassificationEdit,
            props: {
                editedClassification,
            },
        });

        if (classification) {
            await refetch();
            refreshRow(gridRef, editedClassification!.id.toString());
        }
    };

    return (
        <>
            <Head>
                <title>{t("pages.classifications.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.classifications.header.title")} description={t("pages.classifications.header.description")} />
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-2">{t("pages.classifications.create.button")}</span>
                    </Button>
                    <div className="px-1"></div>
                    <Button autoCapitalize="false">
                        <Icon size={0.8} path={mdiAccountMultiplePlusOutline} />
                        <span className="ml-2">{t("pages.classifications.load.button")}</span>
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
                        getRowId={item => item.data.id.toString()}
                        rowData={classifications}
                        onFirstDataRendered={onFirstDataRendered}
                        onGridSizeChanged={onFirstDataRendered}
                    ></AgGridReact>
                </div>
            </div>
        </>
    );
};
