import DataGrid, { Column } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Confirmation } from "../../../components/confirmation";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../connection";
import { mdiEmailEditOutline, mdiPencil, mdiPencilOutline, mdiPlus, mdiTimerOutline, mdiTrashCan, mdiTrashCanOutline } from "@mdi/js";
import { NiceModal } from "components/modal";
import { TimingPointCreate } from "components/timing-point-create";
import { TimingPointEdit } from "components/timing-point-edit";
import { useCurrentRaceId } from "../../../hooks";
import Link from "next/link";
import { getTimingPointIcon } from "utils";
import classNames from "classnames";
import { useState } from "react";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type CreatedTimingPoint = AppRouterInputs["timingPoint"]["add"]["timingPoint"];
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

const SortTick = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512">
        <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
    </svg>
);

const PoorTable = ({ raceId, timingPointId }: { raceId: number; timingPointId: number }) => {
    const { data: accessKeys } = trpc.timingPoint.timingPointAccessKeys.useQuery({ raceId, timingPointId });

    return (
        <>
            {accessKeys && (
                <div className="mt-4 relative overflow-x-auto sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-400 uppercase">
                            <tr>
                                <th scope="col" className="py-3">
                                    Key name
                                </th>
                                <th scope="col" className="py-3">
                                    <div className="flex items-center">
                                        Code
                                        <a href="#">
                                            <SortTick />
                                        </a>
                                    </div>
                                </th>
                                <th scope="col" className="py-3">
                                    <div className="flex items-center">
                                        Can access others
                                        <a href="#">
                                            <SortTick />
                                        </a>
                                    </div>
                                </th>
                                <th scope="col" className="py-3">
                                    <div className="flex items-center">
                                        Token
                                        <a href="#">
                                            <SortTick />
                                        </a>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessKeys.map((a) => (
                                <tr key={a.id} className="bg-white border-b">
                                    <th scope="row" className="py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {a.name}
                                    </th>
                                    <td className="py-4">{a.code}</td>
                                    <td className="py-4">{a.canAccessOthers ? 'true' : 'false'}</td>
                                    <td className="py-4">{a.token}</td>
                                    <td className="px-6 py-4 text-right">
                                        <a href="#" className="font-medium text-blue-600 hover:underline">
                                            Edit
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

const TimingPointActions = ({ timingPoint }: { timingPoint: TimingPoint }) => {
    const raceId = useCurrentRaceId();

    return (
        <div className="flex">
            <Link target="_blank" href={`/stopwatch/${raceId}?timingPointId=${timingPoint.id}`}>
                <span className="flex items-center hover:text-red-600 cursor-pointer">
                    <Icon size={1} path={mdiTimerOutline} />
                    Open Stopwatch
                </span>
            </Link>
            {/* <span className="ml-4 flex items-center hover:text-red-600 cursor-pointer" onClick={deleteTimingPoint}>
                <Icon size={1} path={mdiTrashCan} />
                delete
            </span> */}
        </div>
    );
};

const TimingPointCard = ({
    onCreate,
    onSelect,
    index,
    raceId,
    isActive,
    timingPoint,
    isFirst,
    isLast,
}: {
    onCreate: () => void;
    onSelect: (timingPointId: number) => void;
    index: number;
    raceId: number;
    isActive: boolean;
    isFirst: boolean;
    isLast: boolean;
    timingPoint: TimingPoint;
}) => {
    const addTimingPointMuttaion = trpc.timingPoint.add.useMutation();
    const openCreateDialog = async () => {
        const TimingPoint = await Demodal.open<CreatedTimingPoint>(NiceModal, {
            title: "Create new timing point",
            component: TimingPointCreate,
            props: { raceId: raceId! },
        });

        if (TimingPoint) {
            await addTimingPointMuttaion.mutateAsync({ desiredIndex: index, timingPoint: TimingPoint });
            onCreate();
        }
    };

    return (
        <div className="flex flex-col">
            {!isFirst && (
                <div className="flex flex-col items-center">
                    <div className="w-0.5 bg-gray-100 h-5"></div>
                    <button
                        onClick={openCreateDialog}
                        className="bg-gray-100 font-medium flex my-1 px-5 py-2 items-center text-sm hover:bg-gray-200 text-gray-500 hover:text-gray-600 self-center cursor-pointer rounded-full"
                    >
                        <Icon path={mdiPlus} size={0.7} />
                        <span className="ml-1.5">Add timing point</span>
                    </button>
                    <div className="w-0.5 bg-gray-100 h-5"></div>
                </div>
            )}

            <div
                onClick={() => onSelect(timingPoint.id)}
                className="p-1 cursor-pointer my-1 w-full rounded-xl bg-gradient-to-r from-[#c2e59c] to-[#64b3f4]"
            >
                <div className={classNames("py-4 px-6 rounded-lg flex", { ["bg-white"]: !isActive })}>
                    <div className={classNames(`bg-gray-100 text-gray-500 self-center p-2 rounded-full mr-4`, { ["rotate-90"]: !isLast })}>
                        <Icon path={getTimingPointIcon(isFirst, isLast)} size={1} />
                    </div>
                    <div className="flex flex-col">
                        <h4 className={classNames("text-md font-bold", { ["text-white"]: isActive })}>{timingPoint.name}</h4>
                        <span className={classNames("text-sm", { ["text-white"]: isActive, ["text-gray-500"]: !isActive })}>
                            {timingPoint.description ?? "Timing point where time should be registered"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimingPoint = () => {
    const raceId = useCurrentRaceId();
    const [activeTimingPointId, setActiveTimingPointId] = useState<number>(38);
    const { data: timingPoints, refetch: refetchTimingPoints } = trpc.timingPoint.timingPoints.useQuery({ raceId: raceId! });
    const updateTimingPointMutation = trpc.timingPoint.update.useMutation();
    const deleteTimingPointMutation = trpc.timingPoint.delete.useMutation();

    const { data: timingPointsOrder, refetch: refetchOrder } = trpc.timingPoint.timingPointsOrder.useQuery(
        { raceId: raceId! },
        {
            initialData: [],
        }
    );

    const sortedTimingPoints = timingPointsOrder.map((point) => timingPoints?.find((tp) => point === tp.id)!);
    const activeTimingPoint = sortedTimingPoints.find((tp) => tp.id === activeTimingPointId);

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
            refetchTimingPoints();
        }
    };

    const openDeleteDialog = async (timingPoint: TimingPoint) => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete timing point`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Timing Point ${timingPoint.name}. Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await deleteTimingPointMutation.mutateAsync(timingPoint);

            refetchOrder();
            refetchTimingPoints();
        }
    };

    return (
        <>
            <Head>
                <title>Timing Points</title>
            </Head>
            <div className="border-1 flex h-full border-gray-600 border-solid">
                {/* <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div> */}
                <div className="w-full max-w-md ">
                    {sortedTimingPoints &&
                        sortedTimingPoints.map((e, index) => (
                            <TimingPointCard
                                key={e.id}
                                index={index}
                                raceId={raceId!}
                                onCreate={() => {
                                    refetchTimingPoints();
                                    refetchOrder();
                                }}
                                onSelect={setActiveTimingPointId}
                                isActive={e.id === activeTimingPointId}
                                timingPoint={e}
                                isFirst={index === 0}
                                isLast={index === sortedTimingPoints.length - 1}
                            />
                        ))}
                </div>
                {activeTimingPoint && (
                    <div className="flex-grow ml-8 mt-1 w-full">
                        <div className="flex">
                            <div className="bg-gray-50 p-6 rounded-lg flex flex-col">
                                <h3 className="text-xl font-semibold">{activeTimingPoint.name}</h3>
                                <div>{activeTimingPoint.description}</div>
                            </div>
                            <div className="mx-6  p-6 rounded-lg flex-grow"></div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => openEditDialog(activeTimingPoint)}
                                    className="text-gray-600 hover:bg-gray-200 bg-gray-100 p-3 rounded-lg"
                                >
                                    <Icon path={mdiPencilOutline} size={0.8}></Icon>
                                </button>
                                <button
                                    onClick={() => openDeleteDialog(activeTimingPoint)}
                                    className="ml-2 text-gray-600 hover:bg-gray-200 bg-gray-100 p-3 rounded-lg"
                                >
                                    <Icon path={mdiTrashCanOutline} size={0.8}></Icon>
                                </button>
                            </div>
                        </div>
                        {/* <div className="mt-4 bg-gray-50 p-6 rounded-lg"> */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold">Access URLs</h3>
                            <div>Copy access URLs and send them to your timekeepers</div>
                            <PoorTable raceId={raceId!} timingPointId={activeTimingPoint.id} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TimingPoint;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
