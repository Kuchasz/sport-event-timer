"use client";
import { mdiCheck, mdiClose, mdiPlus, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import type { Gender } from "@set/utils/dist/gender";
import classNames from "classnames";
import { Button } from "components/button";
import { Confirmation } from "components/confirmation";
import { GenderIcon } from "components/gender-icon";
import { NiceConfirmation, NiceModal } from "components/modal";
import { PageHeader } from "components/page-header";
import { CategoryCreate } from "components/panel/classification/category-create";
import { CategoryEdit } from "components/panel/classification/category-edit";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useParams } from "next/navigation";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";

export const useCurrentClassificationId = () => {
    const { classificationId } = useParams<{ classificationId: string }>()!;

    return classificationId ? parseInt(classificationId) : undefined;
};

type Category = AppRouterOutputs["classification"]["categories"][0];

const CategoryIsSpecialRenderer = (props: Category) => <CategoryIsSpecial category={props} />;
const ActionsRenderer = (props: { refetch: () => void; data: Category }) => (
    <CategoryActions refetch={props.refetch} category={props.data} />
);

const CategoryIsSpecial = ({ category }: { category: Category }) => {
    return (
        <span
            className={classNames("flex h-full items-center hover:text-black", {
                ["font-semibold text-green-600"]: category.isSpecial,
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
        const confirmed = await Demodal.open<boolean>(NiceConfirmation, {
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
            <span className="flex cursor-pointer items-center px-2 hover:text-red-600" onClick={openDeleteDialog}>
                <Icon size={0.8} path={mdiTrashCan} />
            </span>
        </div>
    );
};

export const ClassificationCategories = () => {
    const classificationId = useCurrentClassificationId();
    const { data: categories, refetch } = trpc.classification.categories.useQuery(
        { classificationId: classificationId! },
        { initialData: [], enabled: !!classificationId },
    );
    const t = useTranslations();

    const openCreateDialog = async () => {
        const category = await Demodal.open<Category>(NiceModal, {
            title: t("pages.classifications.categories.create.title"),
            component: CategoryCreate,
            props: { classificationId },
        });

        if (category) {
            void refetch();
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
        }
    };

    const defaultColumns: PoorDataTableColumn<Category>[] = [
        {
            field: "id",
            headerName: t("pages.classifications.categories.grid.columns.index"),
            sortable: false,
        },
        {
            field: "name",
            headerName: t("pages.classifications.categories.grid.columns.name"),
            sortable: true,
        },
        {
            field: "minAge",
            headerName: t("pages.classifications.categories.grid.columns.minAge"),
            sortable: true,
        },
        {
            field: "maxAge",
            headerName: t("pages.classifications.categories.grid.columns.maxAge"),
            sortable: true,
        },
        {
            field: "gender",
            headerName: t("pages.classifications.categories.grid.columns.gender"),
            sortable: true,
            cellRenderer: data => <GenderIcon gender={data.gender as Gender} />,
        },
        {
            field: "isSpecial",
            headerName: t("pages.classifications.categories.grid.columns.isSpecial"),
            sortable: true,
            cellRenderer: CategoryIsSpecialRenderer,
        },
        {
            field: "id",
            headerName: t("pages.classifications.categories.grid.columns.actions"),
            cellRenderer: data => <ActionsRenderer data={data} refetch={async () => await refetch()} />,
        },
    ];

    return (
        <>
            <Head>
                <title>{t("pages.classifications.categories.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
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
                <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                    <PoorDataTable
                        data={categories}
                        columns={defaultColumns}
                        searchPlaceholder={t("pages.results.grid.search.placeholder")}
                        getRowId={data => data.id.toString()}
                        gridName="classification-categories"
                        onRowDoubleClicked={e => openEditDialog(e)}
                        searchFields={["name", "minAge", "maxAge", "gender"]}
                    />
                </div>
            </div>
        </>
    );
};
