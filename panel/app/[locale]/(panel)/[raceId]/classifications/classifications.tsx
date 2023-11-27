"use client";
import { mdiAccountMultiple, mdiAccountMultiplePlusOutline, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { NiceModal } from "components/modal";
import { PageHeader } from "components/page-header";
import { ClassificationCreate } from "components/panel/classification/classification-create";
import { ClassificationEdit } from "components/panel/classification/classification-edit";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import type { Route } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import Link from "next/link";
import { useCurrentRaceId } from "../../../../../hooks";
import type { AppRouterInputs, AppRouterOutputs } from "../../../../../trpc";
import { trpc } from "../../../../../trpc-core";

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

    const defaultColumns: PoorDataTableColumn<Classification>[] = [
        { headerName: t("pages.classifications.grid.columns.index"), sortable: true, field: "id" },
        { field: "name", headerName: t("pages.classifications.grid.columns.name"), sortable: true },
        {
            headerName: t("pages.classifications.grid.columns.actions"),
            field: "id",
            cellRenderer: data => <OpenCategoriesButton classification={data} />,
        },
    ];

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
                <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                    <PoorDataTable
                        data={classifications}
                        columns={defaultColumns}
                        searchPlaceholder={t("pages.results.grid.search.placeholder")}
                        getRowId={data => data.id.toString()}
                        gridName="classifications"
                        onRowDoubleClicked={e => openEditDialog(e)}
                        searchFields={["name"]}
                    />
                </div>
            </div>
        </>
    );
};
