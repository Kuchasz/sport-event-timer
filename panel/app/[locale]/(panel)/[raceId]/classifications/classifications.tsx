"use client";
import { mdiAccountEditOutline, mdiAccountMultiple, mdiAccountMultiplePlusOutline, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { ModalModal } from "components/modal";
import { PageHeader } from "components/page-header";
import { ClassificationCreate } from "components/panel/classification/classification-create";
import { ClassificationEdit } from "components/panel/classification/classification-edit";
import { NewPoorActions, NewPoorActionsItem } from "components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useCurrentRaceId } from "../../../../../hooks";
import type { AppRouterOutputs } from "../../../../../trpc";
import { trpc } from "../../../../../trpc-core";
import { type Route } from "next";

type Classification = AppRouterOutputs["classification"]["classifications"][0];

const ClassificationActions = ({ classification, refetch }: { classification: Classification; refetch: () => void }) => {
    const t = useTranslations();
    return (
        <NewPoorActions>
            <ModalModal
                title={t("pages.classifications.edit.confirmation.title")}
                component={ClassificationEdit}
                onResolve={refetch}
                componentProps={{
                    editedClassification: classification,
                    onReject: () => {},
                }}>
                <NewPoorActionsItem
                    name={t("pages.classifications.edit.title")}
                    description={t("pages.classifications.edit.description")}
                    iconPath={mdiAccountEditOutline}></NewPoorActionsItem>
            </ModalModal>
            <NewPoorActionsItem
                name={t("pages.classifications.manageCategories.name")}
                description={t("pages.classifications.manageCategories.description")}
                iconPath={mdiAccountMultiple}
                href={`/${classification.raceId}/classifications/${classification.id}` as Route}></NewPoorActionsItem>
        </NewPoorActions>
    );
};

export const Classifications = () => {
    const raceId = useCurrentRaceId();
    const { data: classifications, refetch } = trpc.classification.classifications.useQuery({ raceId: raceId }, { initialData: [] });
    const t = useTranslations();

    const defaultColumns: PoorDataTableColumn<Classification>[] = [
        { headerName: t("pages.classifications.grid.columns.index"), sortable: true, field: "id" },
        { field: "name", headerName: t("pages.classifications.grid.columns.name"), sortable: true },
        {
            headerName: t("pages.classifications.grid.columns.actions"),
            field: "id",
            cellRenderer: data => <ClassificationActions refetch={refetch} classification={data} />,
        },
    ];

    return (
        <>
            <Head>
                <title>{t("pages.classifications.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.classifications.header.title")} description={t("pages.classifications.header.description")} />
                <div className="mb-4 inline-flex">
                    <ModalModal
                        title={t("pages.classifications.create.title")}
                        component={ClassificationCreate}
                        onResolve={() => refetch()}
                        componentProps={{ raceId: raceId, onReject: () => {} }}>
                        <Button outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.classifications.create.button")}</span>
                        </Button>
                    </ModalModal>
                    <div className="px-1"></div>
                    <Button autoCapitalize="false" outline>
                        <Icon size={0.8} path={mdiAccountMultiplePlusOutline} />
                        <span className="ml-2">{t("pages.classifications.load.button")}</span>
                    </Button>
                </div>
                <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                    <PoorDataTable
                        data={classifications}
                        columns={defaultColumns}
                        searchPlaceholder={t("pages.classifications.grid.search.placeholder")}
                        getRowId={data => data.id.toString()}
                        gridName="classifications"
                        searchFields={["name"]}
                    />
                </div>
            </div>
        </>
    );
};
