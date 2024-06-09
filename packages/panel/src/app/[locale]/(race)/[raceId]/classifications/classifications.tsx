"use client";
import { mdiAccountEditOutline, mdiAccountMultiple, mdiAccountMultiplePlusOutline, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { PoorButton } from "src/components/poor-button";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import { PageHeader } from "src/components/page-headers";
import { ClassificationCreate } from "src/components/panel/classification/classification-create";
import { ClassificationEdit } from "src/components/panel/classification/classification-edit";
import { PoorActions, NewPoorActionsItem } from "src/components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useCurrentRaceId } from "../../../../../hooks";
import type { AppRouterOutputs } from "../../../../../trpc";
import { trpc } from "../../../../../trpc-core";
import { type Route } from "next";

type Classification = AppRouterOutputs["classification"]["classifications"][0];

const ClassificationActions = ({ classification, refetch }: { classification: Classification; refetch: () => void }) => {
    const deleteClassificationMutation = trpc.classification.delete.useMutation();
    const t = useTranslations();

    const deleteClassification = async () => {
        await deleteClassificationMutation.mutateAsync({ classificationId: classification.id });
        refetch();
    };

    return (
        <PoorActions>
            <PoorModal
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
            </PoorModal>
            <NewPoorActionsItem
                name={t("pages.classifications.manageCategories.name")}
                description={t("pages.classifications.manageCategories.description")}
                iconPath={mdiAccountMultiple}
                href={`/${classification.raceId}/classifications/${classification.id}` as Route}></NewPoorActionsItem>
            <PoorConfirmation
                destructive
                onAccept={deleteClassification}
                message={t("pages.classifications.delete.confirmation.text", { name: classification.name })}
                title={t("pages.classifications.delete.confirmation.title")}
                isLoading={deleteClassificationMutation.isLoading}>
                <NewPoorActionsItem
                    name={t("pages.classifications.delete.name")}
                    description={t("pages.classifications.delete.description")}
                    iconPath={mdiTrashCanOutline}></NewPoorActionsItem>
            </PoorConfirmation>
        </PoorActions>
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
            field: "actions",
            allowShrink: true,
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
                    <PoorModal
                        title={t("pages.classifications.create.title")}
                        component={ClassificationCreate}
                        onResolve={() => refetch()}
                        componentProps={{ raceId: raceId, onReject: () => {} }}>
                        <PoorButton outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.classifications.create.button")}</span>
                        </PoorButton>
                    </PoorModal>
                    <div className="px-1"></div>
                    <PoorButton autoCapitalize="false" outline>
                        <Icon size={0.8} path={mdiAccountMultiplePlusOutline} />
                        <span className="ml-2">{t("pages.classifications.load.button")}</span>
                    </PoorButton>
                </div>
                <div className="flex-grow">
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
