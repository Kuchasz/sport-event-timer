import DataGrid, { Column } from "react-data-grid";
import Icon from "@mdi/react";
import { Confirmation } from "../../../components/confirmation";
import { Demodal } from "demodal";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../connection";
import { mdiClockEditOutline, mdiClockPlusOutline, mdiReload } from "@mdi/js";
import { NiceModal } from "components/modal";
import { SplitTimeEdit } from "../../../components/split-time-edit";
import { useCurrentRaceId } from "../../../hooks";

type SplitTime = AppRouterOutputs["splitTime"]["splitTimes"][0];
type RevertedSplitTime = AppRouterInputs["splitTime"]["revert"];
type EditedSplitTime = AppRouterInputs["splitTime"]["update"];

type SplitTimeResultTypes = {
    openEditDialog: (params: SplitTime) => Promise<void>;
    openResetDialog: (params: RevertedSplitTime) => Promise<void>;
    splitTimeResult: {
        times: { [timingPointId: number]: { time: number; manual: boolean } };
        bibNumber: number;
    };
    timingPointId: number;
};
const SplitTimeResult = ({ openEditDialog, openResetDialog, splitTimeResult, timingPointId }: SplitTimeResultTypes) => {
    const result = splitTimeResult.times[timingPointId];
    return (
        <div className="font-mono flex">
            <span className={result?.manual ? "text-yellow-600" : ""}>
                {formatTimeWithMilliSec(splitTimeResult.times[timingPointId]?.time)}
            </span>
            <div className="flex-grow"></div>
            {result?.time > 0 && (
                <span
                    onClick={() =>
                        openEditDialog({
                            bibNumber: splitTimeResult.bibNumber,
                            time: result?.time,
                            timingPointId: timingPointId,
                        } as any)
                    }
                    className="flex items-center hover:text-red-600 cursor-pointer"
                >
                    <Icon size={0.75} path={mdiClockEditOutline} />
                    <span className="ml-1">change</span>
                </span>
            )}
            {result == null && (
                <span
                    onClick={() =>
                        openEditDialog({
                            bibNumber: splitTimeResult.bibNumber,
                            time: 0,
                            timingPointId: timingPointId,
                        } as any)
                    }
                    className="flex items-center hover:text-red-600 cursor-pointer"
                >
                    <Icon size={0.75} path={mdiClockPlusOutline} />
                    <span className="ml-1">change</span>
                </span>
            )}
            {result?.manual == true && (
                <span
                    onClick={() =>
                        openResetDialog({
                            bibNumber: splitTimeResult.bibNumber,
                            time: result?.time,
                            timingPointId: timingPointId,
                        } as any)
                    }
                    className="flex items-center ml-2 hover:text-red-600 cursor-pointer"
                >
                    <Icon size={0.75} path={mdiReload} />
                    <span className="ml-1">revert</span>
                </span>
            )}
        </div>
    );
};

const SplitTimes = () => {
    const raceId = useCurrentRaceId();
    const { data: splitTimes, refetch: refetchSplitTimes } = trpc.splitTime.splitTimes.useQuery({ raceId: raceId! });
    const { data: timingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: raceId! },
        {
            initialData: [],
        }
    );
    const { data: timingPointsOrder } = trpc.timingPoint.timingPointsOrder.useQuery({ raceId: raceId! }, { initialData: [] });
    const { data: race } = trpc.race.race.useQuery({ raceId: raceId! });
    const updateSplitTimeMutation = trpc.splitTime.update.useMutation();
    const revertSplitTimeMuttaion = trpc.splitTime.revert.useMutation();

    const openEditDialog = async (editedSplitTime: SplitTime) => {
        const splitTime = await Demodal.open<EditedSplitTime>(NiceModal, {
            title: "Edit split time",
            component: SplitTimeEdit,
            props: {
                editedSplitTime,
                raceId,
                raceDate: race?.date?.getTime(),
            },
        });

        if (splitTime) {
            await updateSplitTimeMutation.mutateAsync({ ...splitTime, raceId: raceId! });
            refetchSplitTimes();
        }
    };

    const openRevertDialog = async (editedSplitTime: RevertedSplitTime) => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Revert manual split time`,
            component: Confirmation,
            props: {
                message: `You are trying to revert manual split time changes. Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await revertSplitTimeMuttaion.mutateAsync(editedSplitTime);
            refetchSplitTimes();
        }
    };

    const columns: Column<SplitTime, unknown>[] = [
        { key: "bibNumber", name: "Bib", width: 10 },
        { key: "player.name", name: "Name", formatter: p => <span>{p.row.name}</span> },
        { key: "player.lastName", name: "Last Name", formatter: p => <span>{p.row.lastName}</span> },
        ...timingPointsOrder
            .map(id => timingPoints.find(tp => tp.id === id)!)!
            .map(tp => ({
                key: tp.name,
                name: tp.name,
                formatter: (p: any) => (
                    <SplitTimeResult
                        openEditDialog={openEditDialog}
                        openResetDialog={openRevertDialog}
                        splitTimeResult={p.row}
                        timingPointId={tp.id}
                    />
                ),
            })),
    ];

    return (
        <>
            {/* <div className="flex bg-white p-8 rounded-lg shadow-md flex-col h-full"></div> */}
            <div className="flex bg-white flex-col h-full">
                {splitTimes && (
                    <DataGrid
                        className="rdg-light h-full"
                        defaultColumnOptions={{
                            sortable: false,
                            resizable: true,
                        }}
                        columns={columns}
                        rows={splitTimes}
                    />
                )}
            </div>
        </>
    );
};

export default SplitTimes;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
