"use client";
import Icon from "@mdi/react";
import { mdiCheck, mdiClose, mdiPlus, mdiTrashCan } from "@mdi/js";
import { AppRouterOutputs } from "trpc";
import { useCallback, useRef } from "react";
import { Gender } from "@set/utils/dist/gender";
import classNames from "classnames";
import { Button } from "components/button";
import { trpc } from "trpc-core";
import { useParams } from "next/navigation";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { GenderIcon } from "components/gender-icon";
import { Demodal } from "demodal";
import { NiceModal } from "components/modal";
import { Confirmation } from "components/confirmation";
import { CategoryCreate } from "components/panel/classification/category-create";
import { CategoryEdit } from "components/panel/classification/category-edit";
import { PageHeader } from "components/page-header";
import Head from "next/head";
import { useTranslations } from "next-intl";
import { refreshRow } from "ag-grid";

export const useCurrentClassificationId = () => {
    const { classificationId } = useParams() as { classificationId: string };

    return classificationId ? parseInt(classificationId as string) : undefined;
};

type Category = AppRouterOutputs["classification"]["categories"][0];

const CategoryIsSpecialRenderer = (props: { data: Category }) => <CategoryIsSpecial category={props.data} />;
const ActionsRenderer = (props: { context: { refetch: () => void }; data: Category }) => (
    <CategoryActions refetch={props.context.refetch} category={props.data} />
);

const CategoryIsSpecial = ({ category }: { category: Category }) => {
    return (
        <span
            className={classNames("flex h-full items-center hover:text-black", {
                ["text-green-600 font-semibold"]: category.isSpecial,
                ["text-red-600"]: !category.isSpecial,
            })}
        >
            {category.isSpecial ? <Icon size={0.8} path={mdiCheck} /> : <Icon size={0.8} path={mdiClose} />}
        </span>
    );
};

const CategoryActions = ({ category, refetch }: { category: Category; refetch: () => void }) => {
    const removeCategoryMutation = trpc.classification.removeCategory.useMutation();
    const t = useTranslations();

    const openDeleteDialog = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: t("pages.classifications.categories.detele.confirmation.title"),
            component: Confirmation,
            props: {
                message: t("pages.classifications.categories.detele.confirmation.text", { name: category.name }),
            },
        });

        if (confirmed) {
            await removeCategoryMutation.mutateAsync({ categoryId: category.id });
            refetch();
        }
    };

    return (
        <div className="flex h-full">
            <span className="flex px-2 items-center hover:text-red-600 cursor-pointer" onClick={openDeleteDialog}>
                <Icon size={0.8} path={mdiTrashCan} />
            </span>
        </div>
    );
};

export const ClassificationCategories = () => {
    const classificationId = useCurrentClassificationId();
    const gridRef = useRef<AgGridReact<Category>>(null);
    const { data: categories, refetch } = trpc.classification.categories.useQuery(
        { classificationId: classificationId! },
        { initialData: [], enabled: !!classificationId }
    );
    const t = useTranslations();

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

    const openCreateDialog = async () => {
        const category = await Demodal.open<Category>(NiceModal, {
            title: t("pages.classifications.categories.create.title"),
            component: CategoryCreate,
            props: { classificationId },
        });

        if (category) {
            refetch();
        }
    };

    const openEditDialog = async (editedCategory?: Category) => {
        const category = await Demodal.open<Category>(NiceModal, {
            title: t("pages.classifications.categories.edit.title"),
            component: CategoryEdit,
            props: {
                editedCategory,
            },
        });
        if (category) {
            await refetch();
            refreshRow(gridRef, editedCategory!.id.toString());
        }
    };

    const defaultColumns: ColDef<Category>[] = [
        {
            width: 25,
            headerName: t("pages.classifications.categories.grid.columns.index"),
            headerClass: "hidden",
            sortable: false,
            filter: false,
            valueGetter: r => r.node?.rowIndex
        },
        {
            field: "name",
            headerName: t("pages.classifications.categories.grid.columns.name"),
            sortable: true,
            resizable: true,
            filter: true,
        },
        {
            field: "minAge",
            headerName: t("pages.classifications.categories.grid.columns.minAge"),
            sortable: true,
            resizable: true,
            filter: true,
        },
        {
            field: "maxAge",
            headerName: t("pages.classifications.categories.grid.columns.maxAge"),
            sortable: true,
            resizable: true,
            filter: true,
        },
        {
            field: "gender",
            headerName: t("pages.classifications.categories.grid.columns.gender"),
            sortable: true,
            resizable: true,
            filter: true,
            cellStyle: { justifyContent: "center", display: "flex" },
            width: 150,
            cellRenderer: (props: { data: Category }) => <GenderIcon gender={props.data.gender as Gender} />,
        },
        {
            field: "isSpecial",
            headerName: t("pages.classifications.categories.grid.columns.isSpecial"),
            sortable: true,
            filter: true,
            resizable: true,
            cellRenderer: CategoryIsSpecialRenderer,
        },
        {
            headerName: t("pages.classifications.categories.grid.columns.actions"),
            cellRenderer: ActionsRenderer,
        },
    ];

    return (
        <>
            <Head>
                <title>{t("pages.classifications.categories.header.title")}</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <PageHeader
                    title={t("pages.classifications.categories.header.title")}
                    description={t("pages.classifications.categories.header.description")}
                />
                <div className="flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-2">{t("pages.classifications.categories.create.button")}</span>
                    </Button>
                </div>
                <div className="p-2"></div>
                <div className="ag-theme-material h-full">
                    <AgGridReact<Category>
                        ref={gridRef}
                        context={{ refetch }}
                        onRowDoubleClicked={e => openEditDialog(e.data)}
                        suppressCellFocus={true}
                        suppressAnimationFrame={true}
                        columnDefs={defaultColumns}
                        getRowId={item => item.data.id.toString()}
                        rowData={categories}
                        onFirstDataRendered={onFirstDataRendered}
                        onGridSizeChanged={onFirstDataRendered}
                    ></AgGridReact>
                </div>
            </div>
        </>
    );
};

export default ClassificationCategories;
