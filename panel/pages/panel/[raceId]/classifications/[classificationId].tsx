import Icon from "@mdi/react";
import { mdiCheck, mdiClose, mdiPlus, mdiTrashCan } from "@mdi/js";
import { useCurrentRaceId } from "hooks";
import { AppRouterOutputs } from "trpc";
import { useCallback, useRef } from "react";
import { Gender } from "@set/utils/dist/gender";
import classNames from "classnames";
import { Button } from "components/button";
import { trpc } from "connection";
import { useRouter } from "next/router";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { GenderIcon } from "components/gender-icon";
import { Demodal } from "demodal";
import { NiceModal } from "components/modal";
import { Confirmation } from "components/confirmation";
import { CategoryCreate } from "components/category-create";
import { CategoryEdit } from "components/category-edit";

export const useCurrentClassificationId = () => {
    const { classificationId } = useRouter().query;

    return classificationId ? parseInt(classificationId as string) : undefined;
};

type Category = AppRouterOutputs["classification"]["categories"][0];

const CategoryIsSpecialRenderer = (props: { data: Category }) => <CategoryIsSpecial category={props.data} />;
const ActionsRenderer = (props: { context: { refetch: () => void }; data: Category }) => (
    <CategoryActions refetch={props.context.refetch} category={props.data} />
);

const defaultColumns: ColDef<Category>[] = [
    {
        field: "index",
        width: 25,
        headerName: "Index",
        headerClass: "hidden",
        valueGetter: "node.rowIndex + 1",
        sortable: false,
        filter: false,
    },
    { field: "name", headerName: "Name", sortable: true, resizable: true, filter: true },
    { field: "minAge", headerName: "Min Age", sortable: true, resizable: true, filter: true },
    { field: "maxAge", headerName: "Max Age", sortable: true, resizable: true, filter: true },
    {
        field: "gender",
        headerName: "Gender",
        sortable: true,
        resizable: true,
        filter: true,
        cellStyle: { justifyContent: "center", display: "flex" },
        width: 150,
        cellRenderer: (props: { data: Category }) => <GenderIcon gender={props.data.gender as Gender} />,
    },
    {
        field: "isSpecial",
        headerName: "Is Special",
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: CategoryIsSpecialRenderer,
    },
    {
        field: "actions",
        // width: 50,
        headerName: "Actions",
        cellRenderer: ActionsRenderer,
    },
];

const CategoryIsSpecial = ({ category }: { category: Category }) => {
    return (
        <span
            className={classNames("flex h-full items-center hover:text-black cursor-pointer", {
                ["text-green-600 font-semibold"]: category.isSpecial,
                ["text-red-600"]: !category.isSpecial,
            })}
        >
            {category.isSpecial ? <Icon size={1} path={mdiCheck} /> : <Icon size={1} path={mdiClose} />}
        </span>
    );
};

const CategoryActions = ({ category, refetch }: { category: Category; refetch: () => void }) => {
    const removeCategoryMutation = trpc.classification.removeCategory.useMutation();

    const openDeleteDialog = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete category`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Category ${category.name}. Do you want to proceed?`,
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
                <Icon size={1} path={mdiTrashCan} />
            </span>
        </div>
    );
};

export const ClassificationCategories = () => {
    const raceId = useCurrentRaceId();
    const classificationId = useCurrentClassificationId();
    const gridRef = useRef<AgGridReact<Category>>(null);
    const { data: categories, refetch } = trpc.classification.categories.useQuery(
        { classificationId: classificationId! },
        { initialData: [], enabled: !!classificationId }
    );
    const addCategoryMutation = trpc.classification.addCategory.useMutation();
    const editCategoryMutation = trpc.classification.updateCategory.useMutation();

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

    const openCreateDialog = async () => {
        const category = await Demodal.open<Category>(NiceModal, {
            title: "Create new category",
            component: CategoryCreate,
            props: { raceId: raceId! },
        });

        if (category) {
            await addCategoryMutation.mutateAsync(category);
            refetch();
        }
    };

    const openEditDialog = async (editedCategory: Category) => {
        const category = await Demodal.open<Category>(NiceModal, {
            title: "Edit category",
            component: CategoryEdit,
            props: {
                editedCategory,
            },
        });
        if (category) {
            await editCategoryMutation.mutateAsync({ ...category });
            refetch();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex">
                <Button onClick={openCreateDialog} className="w-full">
                    <Icon size={1} path={mdiPlus} />
                    <span className="ml-2">Add category</span>
                </Button>
            </div>
            <div className="p-2"></div>
            <div className="ag-theme-material border-1 flex flex-col h-full border-gray-600 border-solid">
                <AgGridReact<Category>
                    ref={gridRef}
                    context={{ refetch }}
                    onRowDoubleClicked={e => openEditDialog(e.data!)}
                    suppressCellFocus={true}
                    suppressAnimationFrame={true}
                    columnDefs={defaultColumns}
                    rowData={categories}
                    onFirstDataRendered={onFirstDataRendered}
                    onGridSizeChanged={onFirstDataRendered}
                ></AgGridReact>
            </div>
        </div>
    );
};

export default ClassificationCategories;
