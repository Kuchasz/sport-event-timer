"use client";
import { mdiAccountEditOutline, mdiCheck, mdiClose, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { PoorButton } from "src/components/poor-button";
import { GenderIcon } from "src/components/gender-icon";
import { PageHeader } from "src/components/page-headers";
import { CategoryCreate } from "src/components/panel/classification/category-create";
import { CategoryEdit } from "src/components/panel/classification/category-edit";
import { NewPoorActionsItem, PoorActions } from "src/components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import { type Gender } from "src/modules/shared/models";
import { useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterOutputs } from "src/trpc";
import { trpc } from "src/trpc-core";
import { useCurrentClassificationId } from "src/hooks";

type Category = AppRouterOutputs["classification"]["categories"][0];

const CategoryIsSpecialRenderer = (props: Category) => <CategoryIsSpecial category={props} />;

const CategoryIsSpecial = ({ category }: { category: Category }) => {
    return (
        <span
            className={classNames("flex h-full items-center hover:text-black", {
                ["font-semibold text-green-600"]: category.isSpecial,
                ["text-red-600"]: !category.isSpecial,
            })}>
            {category.isSpecial ? <Icon size={0.8} path={mdiCheck} /> : <Icon size={0.8} path={mdiClose} />}
        </span>
    );
};

const CategoryActions = ({ category, refetch }: { category: Category; refetch: () => void }) => {
    const removeCategoryMutation = trpc.classification.removeCategory.useMutation();
    const t = useTranslations();

    const deleteCategory = async () => {
        await removeCategoryMutation.mutateAsync({ categoryId: category.id });
        refetch();
    };

    return (
        <PoorActions>
            <PoorModal
                onResolve={refetch}
                title={t("pages.classifications.categories.edit.title")}
                component={CategoryEdit}
                componentProps={{
                    editedCategory: category,
                    onReject: () => {},
                }}>
                <NewPoorActionsItem
                    name={t("pages.classifications.categories.edit.name")}
                    description={t("pages.classifications.categories.edit.description")}
                    iconPath={mdiAccountEditOutline}></NewPoorActionsItem>
            </PoorModal>
            <PoorConfirmation
                destructive
                onAccept={deleteCategory}
                message={t("pages.classifications.categories.delete.confirmation.text", { name: category.name })}
                title={t("pages.classifications.categories.delete.confirmation.title")}
                isLoading={removeCategoryMutation.isPending}>
                <NewPoorActionsItem
                    name={t("pages.classifications.categories.delete.name")}
                    description={t("pages.classifications.categories.delete.description")}
                    iconPath={mdiTrashCanOutline}></NewPoorActionsItem>
            </PoorConfirmation>
        </PoorActions>
    );
};

export const ClassificationCategories = () => {
    const classificationId = useCurrentClassificationId();
    const { data: categories, refetch } = trpc.classification.categories.useQuery(
        { classificationId },
        { initialData: [], enabled: !!classificationId },
    );
    const t = useTranslations();

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
            field: "actions",
            allowShrink: true,
            headerName: t("pages.classifications.categories.grid.columns.actions"),
            cellRenderer: data => <CategoryActions category={data} refetch={async () => await refetch()} />,
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
                    <PoorModal
                        title={t("pages.classifications.categories.create.title")}
                        component={CategoryCreate}
                        componentProps={{ classificationId, onReject: () => {} }}
                        onResolve={() => refetch()}>
                        <PoorButton outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.classifications.categories.create.button")}</span>
                        </PoorButton>
                    </PoorModal>
                </div>
                <div className="p-2"></div>
                <div className="flex-grow">
                    <PoorDataTable
                        data={categories}
                        columns={defaultColumns}
                        searchPlaceholder={t("pages.classifications.categories.grid.search.placeholder")}
                        getRowId={data => data.id.toString()}
                        gridName="classification-categories"
                        searchFields={["name", "minAge", "maxAge", "gender"]}
                    />
                </div>
            </div>
        </>
    );
};
