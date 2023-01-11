import DataGrid, { Column } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Confirmation } from "../../../components/confirmation";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../connection";
import { mdiPlus, mdiTimerOutline, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { TimingPointCreate } from "components/timing-point-create";
import { TimingPointEdit } from "components/timing-point-edit";
import { useCurrentRaceId } from "../../../hooks";
import Link from "next/link";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type CreatedTimingPoint = AppRouterInputs["timingPoint"]["add"];
type EditedTimingPoint = AppRouterInputs["timingPoint"]["update"];

const columns: Column<TimingPoint, unknown>[] = [
    { key: "id", name: "Id", width: 10 },
    { key: "order", name: "Order", width: 10 },
    { key: "name", name: "Name" },
    {
        key: "actions",
        width: 15,
        name: "Actions",
        formatter: (props) => <TimingPointDeleteButton timingPoint={props.row} />,
    },
];

const TimingPointDeleteButton = ({ timingPoint }: { timingPoint: TimingPoint }) => {
    const raceId = useCurrentRaceId();
    const { refetch } = trpc.timingPoint.timingPoints.useQuery({ raceId: raceId! });
    const deleteTimingPointMutation = trpc.timingPoint.delete.useMutation();
    const deleteTimingPoint = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete timing point`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Timing Point ${timingPoint.name}. Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await deleteTimingPointMutation.mutateAsync(timingPoint);
            refetch();
        }
    };
    return (
        <span className="flex items-center hover:text-red-600 cursor-pointer" onClick={deleteTimingPoint}>
            <Icon size={1} path={mdiTrashCan} />
            delete
        </span>
    );
};

const TimingPoint = () => {
    const raceId = useCurrentRaceId();
    const { data: races, refetch } = trpc.timingPoint.timingPoints.useQuery({ raceId: raceId! });
    const updateTimingPointMutation = trpc.timingPoint.update.useMutation();
    const addTimingPointMuttaion = trpc.timingPoint.add.useMutation();

    const openCreateDialog = async () => {
        const TimingPoint = await Demodal.open<CreatedTimingPoint>(NiceModal, {
            title: "Create new timing point",
            component: TimingPointCreate,
            props: { raceId: raceId! },
        });

        if (TimingPoint) {
            await addTimingPointMuttaion.mutateAsync(TimingPoint);
            refetch();
        }
    };

    const openEditDialog = async (editedTimingPoint?: TimingPoint) => {
        const TimingPoint = await Demodal.open<EditedTimingPoint>(NiceModal, {
            title: "Edit timing point",
            component: TimingPointEdit,
            props: {
                editedTimingPoint,
            },
        });

        if (TimingPoint) {
            await updateTimingPointMutation.mutateAsync(TimingPoint);
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Timing Points list</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                    <div className="px-1"></div>
                    <Link href={`/stopwatch/${raceId}`}>
                        <Button autoCapitalize="false">
                            <Icon size={1} path={mdiTimerOutline} />
                            <span className="ml-2">Open Stopwatch</span>
                        </Button>
                    </Link>
                </div>
                {races && (
                    <DataGrid
                        className="rdg-light h-full"
                        defaultColumnOptions={{
                            sortable: false,
                            resizable: true,
                        }}
                        onRowDoubleClick={(e) => openEditDialog(e)}
                        columns={columns}
                        rows={races}
                    />
                )}
            </div>
        </>
    );
};

export default TimingPoint;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";