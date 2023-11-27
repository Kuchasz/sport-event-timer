"use client";

import { mdiPlus, mdiRestore, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import { BibNumberCreateManyForm } from "components/bib-number-create-many";
import { Button } from "components/button";
import { Confirmation } from "components/confirmation";
import { NiceConfirmation, NiceModal } from "components/modal";
import { PageHeader } from "components/page-header";
import { BibNumberCreate } from "components/panel/bib-number/bib-number-create";
import { BibNumberEdit } from "components/panel/bib-number/bib-number-edit";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useCurrentRaceId } from "../../../../../hooks";
import type { AppRouterInputs, AppRouterOutputs } from "../../../../../trpc";
import { trpc } from "../../../../../trpc-core";

type BibNumber = AppRouterOutputs["bibNumber"]["numbers"][0];
type EditedBibNumber = AppRouterInputs["bibNumber"]["update"];
type CreatedBibNumber = AppRouterInputs["bibNumber"]["add"];
type CreateManyBibNumbers = AppRouterInputs["bibNumber"]["addRange"];

const BibNumberDeleteButton = ({ refetch, bibNumber }: { refetch: () => void; bibNumber: BibNumber }) => {
    const deletebibNumberMutation = trpc.bibNumber.delete.useMutation();
    const t = useTranslations();
    const deletebibNumber = async () => {
        const confirmed = await Demodal.open<boolean>(NiceConfirmation, {
            title: t("pages.bibNumbers.delete.confirmation.title"),
            component: Confirmation,
            props: {
                message: t("pages.bibNumbers.delete.confirmation.text", { bibNumber: bibNumber.number }),
            },
        });

        if (confirmed) {
            await deletebibNumberMutation.mutateAsync({ bibNumberId: bibNumber.id });
            refetch();
        }
    };
    return (
        <span className="flex cursor-pointer items-center hover:text-red-600" onClick={deletebibNumber}>
            <Icon size={0.8} path={mdiTrashCan} />
            {t("pages.bibNumbers.delete.button")}
        </span>
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
            field: "id",
            headerName: t("pages.bibNumbers.grid.columns.actions"),
            cellRenderer: data => <BibNumberDeleteButton refetch={refetch} bibNumber={data} />,
        },
    ];

    const openCreateDialog = async () => {
        const bibNumber = await Demodal.open<CreatedBibNumber>(NiceModal, {
            title: t("pages.bibNumbers.create.title"),
            component: BibNumberCreate,
            props: { raceId: raceId },
        });

        if (bibNumber) {
            void refetch();
        }
    };

    const openDeleteAllDialog = async () => {
        const confirmed = await Demodal.open<boolean>(NiceConfirmation, {
            title: t("pages.bibNumbers.deleteAll.confirmation.title"),
            component: Confirmation,
            props: {
                message: t("pages.bibNumbers.deleteAll.confirmation.text"),
            },
        });

        if (confirmed) {
            await deleteAllMutation.mutateAsync({ raceId: raceId });
            void refetch();
        }
    };

    const openCreateManyDialog = async () => {
        const createManyBibNumbers = await Demodal.open<CreateManyBibNumbers>(NiceModal, {
            title: t("pages.bibNumbers.createMany.title"),
            component: BibNumberCreateManyForm,
            props: { initialConfig: { raceId: raceId, omitDuplicates: true } },
        });

        if (createManyBibNumbers) {
            void refetch();
        }
    };

    const openEditDialog = async (editedBibNumber?: BibNumber) => {
        const bibNumber = await Demodal.open<EditedBibNumber>(NiceModal, {
            title: t("pages.bibNumbers.edit.title"),
            component: BibNumberEdit,
            props: {
                editedBibNumber,
            },
        });

        if (bibNumber) {
            await refetch();
        }
    };

    return (
        <>
            <Head>
                <title>{t("pages.bibNumbers.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.bibNumbers.header.title")} description={t("pages.bibNumbers.header.description")} />
                <div className="mb-4 inline-flex">
                    <Button outline onClick={openCreateDialog}>
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-2">{t("pages.bibNumbers.create.button")}</span>
                    </Button>
                    <Button outline className="ml-2" onClick={openCreateManyDialog}>
                        {/* <Icon size={0.8} path={mdiPlusM} /> */}
                        {t("pages.bibNumbers.createMany.button")}
                    </Button>{" "}
                    <Button outline className="ml-2" onClick={openDeleteAllDialog}>
                        <Icon size={0.8} path={mdiRestore} className="mr-2" />
                        {t("pages.bibNumbers.deleteAll.button")}
                    </Button>
                </div>
                <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                    <PoorDataTable
                        data={bibNubers}
                        columns={defaultColumns}
                        searchPlaceholder={t("pages.bibNumbers.grid.search.placeholder")}
                        getRowId={data => data.id.toString()}
                        gridName="bib-numbers"
                        onRowDoubleClicked={e => openEditDialog(e)}
                        searchFields={["number"]}
                    />
                </div>
            </div>
        </>
    );
};
