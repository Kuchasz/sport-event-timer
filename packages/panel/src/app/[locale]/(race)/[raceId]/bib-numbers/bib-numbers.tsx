"use client";

import { mdiNumeric, mdiPlus, mdiRestore, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { BibNumberCreateManyForm } from "src/components/bib-number-create-many";
import { PoorButton } from "src/components/poor-button";
import { PageHeader } from "src/components/page-headers";
import { BibNumberCreate } from "src/components/panel/bib-number/bib-number-create";
import { BibNumberEdit } from "src/components/panel/bib-number/bib-number-edit";
import { NewPoorActionsItem, PoorActions } from "src/components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useCurrentRaceId } from "../../../../../hooks";
import type { AppRouterOutputs } from "../../../../../trpc";
import { trpc } from "../../../../../trpc-core";

type BibNumber = AppRouterOutputs["bibNumber"]["numbers"][0];

const BibNumberActions = ({ refetch, bibNumber }: { refetch: () => void; bibNumber: BibNumber }) => {
    const deletebibNumberMutation = trpc.bibNumber.delete.useMutation();
    const t = useTranslations();

    const deletebibNumber = async () => {
        await deletebibNumberMutation.mutateAsync({ bibNumberId: bibNumber.id });
        refetch();
    };

    return (
        <PoorActions>
            <PoorModal
                onResolve={refetch}
                title={t("pages.bibNumbers.edit.title")}
                component={BibNumberEdit}
                componentProps={{
                    editedBibNumber: bibNumber,
                    onReject: () => {},
                }}>
                <NewPoorActionsItem
                    name={t("pages.bibNumbers.edit.name")}
                    description={t("pages.bibNumbers.edit.description")}
                    iconPath={mdiNumeric}></NewPoorActionsItem>
            </PoorModal>
            <PoorConfirmation
                destructive
                title={t("pages.bibNumbers.delete.confirmation.title")}
                message={t("pages.bibNumbers.delete.confirmation.text", { bibNumber: bibNumber.number })}
                onAccept={deletebibNumber}
                isLoading={deletebibNumberMutation.isPending}>
                <NewPoorActionsItem
                    name={t("pages.bibNumbers.delete.name")}
                    description={t("pages.bibNumbers.delete.description")}
                    iconPath={mdiTrashCanOutline}></NewPoorActionsItem>
            </PoorConfirmation>
        </PoorActions>
    );
};

export const BibNumbers = () => {
    const raceId = useCurrentRaceId();
    const { data: bibNubers, refetch } = trpc.bibNumber.numbers.useQuery({ raceId: raceId }, { initialData: [] });

    const deleteAllMutation = trpc.bibNumber.deleteAll.useMutation();

    const t = useTranslations();

    const defaultColumns: PoorDataTableColumn<BibNumber>[] = [
        { headerName: t("pages.bibNumbers.grid.columns.index"), sortable: true, field: "id" },
        {
            field: "number",
            sortable: true,
            headerName: t("pages.bibNumbers.grid.columns.bibNumber"),
        },
        {
            field: "actions",
            allowShrink: true,
            headerName: t("pages.bibNumbers.grid.columns.actions"),
            cellRenderer: data => <BibNumberActions refetch={refetch} bibNumber={data} />,
        },
    ];

    const deleteAll = async () => {
        await deleteAllMutation.mutateAsync({ raceId: raceId });
        void refetch();
    };

    return (
        <>
            <Head>
                <title>{t("pages.bibNumbers.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.bibNumbers.header.title")} description={t("pages.bibNumbers.header.description")} />
                <div className="mb-4 inline-flex">
                    <PoorModal
                        onResolve={() => refetch()}
                        title={t("pages.bibNumbers.create.title")}
                        component={BibNumberCreate}
                        componentProps={{ raceId: raceId, onReject: () => {} }}>
                        <PoorButton outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.bibNumbers.create.button")}</span>
                        </PoorButton>
                    </PoorModal>
                    <PoorModal
                        onResolve={() => refetch()}
                        title={t("pages.bibNumbers.createMany.title")}
                        component={BibNumberCreateManyForm}
                        componentProps={{
                            initialConfig: { raceId: raceId, startNumber: 1, endNumber: 100, omitDuplicates: true },
                            onReject: () => {},
                        }}>
                        <PoorButton outline className="ml-2">
                            <Icon size={0.8} path={mdiPlus} />
                            {t("pages.bibNumbers.createMany.button")}
                        </PoorButton>
                    </PoorModal>
                    <PoorConfirmation
                        destructive
                        title={t("pages.bibNumbers.deleteAll.confirmation.title")}
                        message={t("pages.bibNumbers.deleteAll.confirmation.text")}
                        onAccept={deleteAll}
                        isLoading={deleteAllMutation.isPending}>
                        <PoorButton outline className="ml-2">
                            <Icon size={0.8} path={mdiRestore} className="mr-2" />
                            {t("pages.bibNumbers.deleteAll.button")}
                        </PoorButton>
                    </PoorConfirmation>
                </div>
                <div className="flex-grow">
                    <PoorDataTable
                        data={bibNubers}
                        columns={defaultColumns}
                        searchPlaceholder={t("pages.bibNumbers.grid.search.placeholder")}
                        getRowId={data => data.id.toString()}
                        gridName="bib-numbers"
                        searchFields={["number"]}
                    />
                </div>
            </div>
        </>
    );
};
