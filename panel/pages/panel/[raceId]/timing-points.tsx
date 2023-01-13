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
import { getTimingPointIcon } from "utils";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type CreatedTimingPoint = AppRouterInputs["timingPoint"]["add"];
type EditedTimingPoint = AppRouterInputs["timingPoint"]["update"];

const columns: Column<TimingPoint, unknown>[] = [
    { key: "id", name: "Id", width: 10 },
    { key: "order", name: "Order", width: 10 },
    { key: "name", name: "Name" },
    {
        key: "actions",
        width: 250,
        name: "Actions",
        formatter: (props) => <TimingPointActions timingPoint={props.row} />,
    },
];

const TimingPointActions = ({ timingPoint }: { timingPoint: TimingPoint }) => {
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
        <div className="flex">
            <Link target="_blank" href={`/stopwatch/${raceId}?timingPointId=${timingPoint.id}`}>
                <span className="flex items-center hover:text-red-600 cursor-pointer">
                    <Icon size={1} path={mdiTimerOutline} />
                    Open Stopwatch
                </span>
            </Link>
            <span className="ml-4 flex items-center hover:text-red-600 cursor-pointer" onClick={deleteTimingPoint}>
                <Icon size={1} path={mdiTrashCan} />
                delete
            </span>
        </div>
    );
};

const TimingPointCard = ({ timingPoint, isFirst, isLast }: { isFirst: boolean; isLast: boolean; timingPoint: TimingPoint }) => {
    return (
        <div className="flex flex-col">
            {!isFirst && (
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600 self-center p-2 cursor-pointer rounded-full mr-4">
                    <Icon path={mdiPlus} size={1} />
                </button>
            )}

            <div className="p-1 mx-auto my-4 max-w-md rounded-xl bg-gradient-to-r from-[#c2e59c] to-[#64b3f4]">
                <div className="bg-white py-4 px-6 rounded-lg flex">
                    <div className="bg-gray-100 text-gray-500 self-center p-2 rounded-full mr-4">
                        <Icon path={getTimingPointIcon(isFirst, isLast)} size={1} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">{timingPoint.name}</h4>
                        <span className="text-gray-500">{timingPoint.description ?? "Timing point where time should be registered"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimingPoint = () => {
    const raceId = useCurrentRaceId();
    const { data: timingPoints, refetch } = trpc.timingPoint.timingPoints.useQuery({ raceId: raceId! });
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
                <title>Timing Points</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div>
                <div className="self-start">
                    {timingPoints &&
                        timingPoints.map((e, id) => (
                            <TimingPointCard key={e.id} timingPoint={e} isFirst={id === 0} isLast={id === timingPoints.length - 1} />
                        ))}
                </div>
            </div>
        </>
    );
};

export default TimingPoint;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
