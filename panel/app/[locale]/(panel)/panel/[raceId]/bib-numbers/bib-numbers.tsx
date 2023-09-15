"use client";

import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { BibNumberCreate } from "components/bib-number-create";
import { BibNumberEdit } from "components/bib-number-edit";
import { Demodal } from "demodal";
import { trpc } from "../../../../../../trpc-core";
import { mdiPlus, mdiRestore, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { useCurrentRaceId } from "../../../../../../hooks";
import { useCallback, useRef } from "react";
import { AppRouterInputs, AppRouterOutputs } from "../../../../../../trpc";
import { Confirmation } from "components/confirmation";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { BibNumberCreateManyForm } from "components/bib-number-create-many";
import { PageHeader } from "components/page-header";
import { useTranslations } from "next-intl";

type BibNumber = AppRouterOutputs["bibNumber"]["numbers"][0];
type EditedBibNumber = AppRouterInputs["bibNumber"]["update"];
type CreatedBibNumber = AppRouterInputs["bibNumber"]["add"];
type CreateManyBibNumbers = AppRouterInputs["bibNumber"]["addRange"];

const BibNumberDeleteButton = ({ refetch, bibNumber }: { refetch: () => void; bibNumber: BibNumber }) => {
    const deletebibNumberMutation = trpc.bibNumber.delete.useMutation();
    const t = useTranslations();
    const deletebibNumber = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
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
        <span className="flex items-center hover:text-red-600 cursor-pointer" onClick={deletebibNumber}>
            <Icon size={1} path={mdiTrashCan} />
            {t('pages.bibNumbers.delete.button')}
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

    const t = useTranslations();

    const defaultColumns: ColDef<BibNumber>[] = [
        { headerName: t('pages.bibNumbers.grid.columns.index'), sortable: true, maxWidth: 80, valueGetter: r => r.node?.rowIndex },
        {
            field: "number",
            sortable: true,
            sort: "asc",
            filter: true,
            headerName: t("pages.bibNumbers.grid.columns.bibNumber"),
            comparator: (valueA, valueB) => valueA - valueB,
        },
        {
            width: 15,
            headerName: t("pages.bibNumbers.grid.columns.actions"),
            cellRenderer: (props: { context: any; data: BibNumber }) => (
                <BibNumberDeleteButton refetch={props.context.refetch} bibNumber={props.data} />
            ),
        },
    ];

    const openCreateDialog = async () => {
        const bibNumber = await Demodal.open<CreatedBibNumber>(NiceModal, {
            title: t("pages.bibNumbers.create.title"),
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
            title: t("pages.bibNumbers.deleteAll.confirmation.title"),
            component: Confirmation,
            props: {
                message: t("pages.bibNumbers.deleteAll.confirmation.text"),
            },
        });

        if (confirmed) {
            await deleteAllMutation.mutateAsync({ raceId: raceId! });
            refetch();
        }
    };

    const openCreateManyDialog = async () => {
        const createManyBibNumbers = await Demodal.open<CreateManyBibNumbers>(NiceModal, {
            title: t("pages.bibNumbers.createMany.title"),
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
            title: t("pages.bibNumbers.edit.title"),
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
                <title>{t("pages.bibNumbers.header.title")}</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <PageHeader title={t("pages.bibNumbers.header.title")} description={t("pages.bibNumbers.header.description")} />
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">{t('pages.bibNumbers.create.button')}</span>
                    </Button>
                    <Button className="ml-2" onClick={openCreateManyDialog}>
                        {/* <Icon size={1} path={mdiPlusM} /> */}
                        {t('pages.bibNumbers.createMany.button')}
                    </Button>{" "}
                    <Button className="ml-2" onClick={openDeleteAllDialog}>
                        <Icon size={1} path={mdiRestore} className="mr-2" />
                        {t('pages.bibNumbers.deleteAll.button')}
                    </Button>
                </div>
                <div className="ag-theme-material h-full">
                    <AgGridReact<BibNumber>
                        ref={gridRef}
                        context={{ refetch }}
                        onRowDoubleClicked={e => openEditDialog(e.data)}
                        suppressCellFocus={true}
                        suppressAnimationFrame={true}
                        columnDefs={defaultColumns}
                        getRowId={item => item.data.id.toString()}
                        rowData={bibNubers}
                        onFirstDataRendered={onFirstDataRendered}
                        onGridSizeChanged={onFirstDataRendered}
                    ></AgGridReact>
                </div>
            </div>
        </>
    );
};
