import DataGrid, { Column } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { ClassificationCreate } from "components/classification-create";
import { ClassificationEdit } from "components/classification-edit";
import { Demodal } from "demodal";
import { trpc } from "../../../../connection";
import { mdiAccountMultiplePlusOutline, mdiPlus, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { useCurrentRaceId } from "../../../../hooks";
import { useMemo } from "react";
import { AppRouterInputs, AppRouterOutputs } from "../../../../trpc";
import { useRouter } from "next/router";
import Link from "next/link";

type Classification = AppRouterOutputs["classification"]["classifications"][0];
type Category = AppRouterOutputs["classification"]["categories"][0];
type EditedClassification = AppRouterInputs["classification"]["update"];
type CreatedClassification = AppRouterInputs["classification"]["add"];

const columns: Column<Classification, unknown>[] = [
    { key: "index", name: ""},
    { key: "name", name: "Name" },
    {
        key: "actions",
        name: "Actions",
        formatter: props => <OpenCategoriesButton classification={props.row} />
    }
];

const OpenCategoriesButton = ({ classification }: { classification: Classification }) => {
    const router = useRouter();
    // const openCategories = async () => {
    //     router.push(`./${classification.id!}`)
    // };

    return (
        <span className="flex items-center hover:text-red-600 cursor-pointer" >
            <Icon size={1} path={mdiTrashCan} />
            <Link href={`${router.asPath}/${classification.id}`}><span>categories</span></Link>
        </span>
    );
};

const Classifications = () => {
    const raceId = useCurrentRaceId();
    const { data: classifications, refetch } = trpc.classification.classifications.useQuery({ raceId: raceId! });
    const updateClassificationMutation = trpc.classification.update.useMutation();
    const addClassifiationMutation = trpc.classification.add.useMutation();

    const sortedPlayers = useMemo((): readonly Classification[] => {
        if (!classifications) return [];

        return [...classifications];
    }, [classifications]);

    const openCreateDialog = async () => {
        const classification = await Demodal.open<CreatedClassification>(NiceModal, {
            title: "Create new classification",
            component: ClassificationCreate,
            props: { raceId: raceId! }
        });

        if (classification) {
            await addClassifiationMutation.mutateAsync(classification);
            refetch();
        }
    };

    const openEditDialog = async (editedClassification?: Classification) => {
        const classification = await Demodal.open<EditedClassification>(NiceModal, {
            title: "Edit classification",
            component: ClassificationEdit,
            props: {
                editedClassification
            }
        });

        if (classification) {
            await updateClassificationMutation.mutateAsync(classification);
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Lista zawodników</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                    <div className="px-1"></div>
                    <Button autoCapitalize="false">
                        <Icon size={1} path={mdiAccountMultiplePlusOutline} />
                        <span className="ml-2">Load</span>
                    </Button>
                </div>
                <DataGrid className='rdg-light h-full'
                    defaultColumnOptions={{
                        sortable: false,
                        resizable: true
                    }}
                    onRowDoubleClick={e => openEditDialog(e)}
                    columns={columns}
                    rows={sortedPlayers}
                />
            </div>
        </>
    );
};

export default Classifications;

export { getSecuredServerSideProps as getServerSideProps } from "../../../../auth";