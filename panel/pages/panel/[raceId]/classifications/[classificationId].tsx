import Icon from "@mdi/react";

import { mdiCheck, mdiClose, mdiPlus, mdiTrashCan } from "@mdi/js";

import { useCurrentRaceId } from "hooks";
import { AppRouterOutputs } from "trpc";
import { useCallback, useRef, useState } from "react";

import { RadioGroup } from "@headlessui/react";
import { Gender } from "@set/utils/dist/gender";
import classNames from "classnames";
import { Label } from "components/label";
import { PoorInput } from "components/poor-input";
import { PoorNumberInput } from "components/poor-number-input";
import { Button } from "components/button";
import { trpc } from "connection";
import { useRouter } from "next/router";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { GenderIcon } from "components/gender-icon";
import { Demodal } from "demodal";
import { NiceModal } from "components/modal";
import { Confirmation } from "components/confirmation";

export const useCurrentClassificationId = () => {
    const { classificationId } = useRouter().query;

    return classificationId ? parseInt(classificationId as string) : undefined;
};

// type Classification = AppRouterInputs["classification"]["add"];
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

const getColorFromIndex = (index: number) =>
    ({
        0: "bg-red-300",
        1: "bg-orange-300",
        2: "bg-yellow-300",
        3: "bg-green-300",
        4: "bg-indigo-300",
        5: "bg-pink-300",
        6: "bg-lime-300",
    }[index]);

// const getPercentage = (category: { minAge?: number; maxAge?: number }) => {
//     const range = (category.maxAge ?? Number.MAX_VALUE) - (category.minAge ?? 0);

//     return (100 / (99 - 18 - 4)) * range + "%";
// };

type GenderOptions = Gender | "any";

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
    // const removeCategoryMutation = trpc.classification.removeCategory.useMutation();

    const [categoryName, setCategoryName] = useState("");
    const [minAge, setMinAge] = useState<number | undefined | null>(1);
    const [maxAge, setMaxAge] = useState<number | undefined | null>(99);
    const [gender, setGender] = useState<GenderOptions>("any");

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

    // const [categories, setCategories] = useState(initialClassification.categories);

    // const qc = useQueryClient();

    const addCategory = async () => {
        // const category = {
        //     name: "New Category",
        //     gender: "male",
        // };

        // qc.setQueryData(["classification.categories", { classificationId: initialClassification.id }], () => [...categories!, category]);

        // setCategories([...categories!, { isSpecial: false, name: categoryName, gender: gender, minAge, maxAge }]);

        // setCategoryName("");
        // setMinAge(1);
        // setMaxAge(99);
        // setGender(undefined);
        await addCategoryMutation.mutateAsync({
            minAge,
            maxAge,
            gender: gender === "any" ? undefined : (gender as Gender),
            isSpecial: false,
            name: categoryName,
            raceId: raceId!,
            classificationId: classificationId!,
        });
        refetch();
    };

    const openEditDialog = async (_editedCategory?: Category) => {
        // const playerRegistration = await Demodal.open<EditedPlayerRegistration>(NiceModal, {
        //     title: "Edit player registration",
        //     component: PlayerRegistrationEdit,
        //     props: {
        //         raceId: raceId!,
        //         editedPlayerRegistration,
        //     },
        // });
        // if (playerRegistration) {
        //     await editPlayerRegistrationMutation.mutateAsync({ raceId: raceId!, player: playerRegistration });
        //     refetch();
        // }
    };

    // const removeCategory = async (category: Category) => {
    //     await removeCategoryMutation.mutateAsync({ categoryId: category.id });
    //     refetchCategories();
    // };

    // const autoCategories = categories.filter(c => c.isSpecial === true);
    // const openCategories = categories.filter(c => c.isSpecial === false && c.minAge == null && c.maxAge == null);

    // const ageCategories = Object.entries(
    //     groupBy(
    //         categories.filter(c => c.minAge != null || c.maxAge != null),
    //         c => c.gender ?? ""
    //     )
    // );

    return (
        <div className="flex flex-col h-full">
            <div className="flex">
                <div className="grow basis-full">
                    <Label>Name</Label>
                    <PoorInput
                        value={categoryName}
                        onChange={e => {
                            setCategoryName(e.target.value);
                        }}
                    ></PoorInput>
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Min Age</Label>
                    <PoorNumberInput
                        value={minAge}
                        onChange={e => {
                            setMinAge(e.target.value);
                        }}
                    ></PoorNumberInput>
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Max Age</Label>
                    <PoorNumberInput
                        value={maxAge}
                        onChange={e => {
                            setMaxAge(e.target.value);
                        }}
                    ></PoorNumberInput>
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Gender</Label>
                    <RadioGroup
                        value={gender}
                        onChange={e => {
                            setGender(e);
                        }}
                    >
                        <RadioGroup.Option value={"any"}>
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer text-xs p-1 rounded-md", { ["bg-blue-200"]: checked })}>
                                    Any
                                </span>
                            )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="male">
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer text-xs p-1 rounded-md", { ["bg-blue-200"]: checked })}>
                                    Male
                                </span>
                            )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="female">
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer text-xs p-1 rounded-md", { ["bg-blue-200"]: checked })}>
                                    Female
                                </span>
                            )}
                        </RadioGroup.Option>
                    </RadioGroup>
                </div>
            </div>
            <div className="flex">
                <div className="grow">
                    <Button onClick={addCategory} className="w-full">
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">Add category</span>
                    </Button>
                </div>
            </div>
            <div className="p-2"></div>
            <div className="ag-theme-material border-1 flex flex-col h-full border-gray-600 border-solid">
                <AgGridReact<Category>
                    ref={gridRef}
                    context={{ refetch }}
                    onRowDoubleClicked={e => openEditDialog(e.data)}
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
