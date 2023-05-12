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
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import { useCallback, useRef } from "react";
import { getGridColumnStateAtom } from "states/grid-states";
import { useAtom } from "jotai";

type SplitTime = AppRouterOutputs["splitTime"]["splitTimes"][0];
type RevertedSplitTime = AppRouterInputs["splitTime"]["revert"];
type EditedSplitTime = AppRouterInputs["splitTime"]["update"];

type SplitTimeResultTypes = {
    openEditDialog: (params: SplitTime) => Promise<void>;
    openResetDialog: (params: RevertedSplitTime) => Promise<void>;
    splitTimeResult: {
        times: { [timingPointId: number]: { time: number; manual: boolean } };
        bibNumber: string | null;
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
                    {/* <span className="ml-1">change</span> */}
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
                    {/* <span className="ml-1">change</span> */}
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
                    {/* <span className="ml-1">revert</span> */}
                </span>
            )}
        </div>
    );
};

const SplitTimes = () => {
    const raceId = useCurrentRaceId();
    const { data: splitTimes, refetch } = trpc.splitTime.splitTimes.useQuery({ raceId: raceId! });
    const { data: timingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: raceId! },
        {
            initialData: [],
        }
    );
    const { data: timingPointsOrder } = trpc.timingPoint.timingPointsOrder.useQuery({ raceId: raceId! }, { initialData: [] });
    const { data: race } = trpc.race.race.useQuery({ raceId: raceId! });
    const gridRef = useRef<AgGridReact<SplitTime>>(null);
    const updateSplitTimeMutation = trpc.splitTime.update.useMutation();
    const revertSplitTimeMuttaion = trpc.splitTime.revert.useMutation();

    const defaultColumns: ColDef<SplitTime>[] = [
        { field: "bibNumber", headerName: "Bib", sortable: true, sort: 'asc', width: 100, comparator: (valueA, valueB) => valueA - valueB },
        { field: "player.name", resizable: true, headerName: "Name", sortable: true, filter: true, cellRenderer: (p: { data: SplitTime }) => <span>{p.data.name}</span> },
        { field: "player.lastName", resizable: true, headerName: "Last Name", sortable: true, filter: true, cellRenderer: (p: { data: SplitTime }) => <span>{p.data.lastName}</span> },
        ...timingPointsOrder
            .map(id => timingPoints.find(tp => tp.id === id)!)!
            .map(tp => ({
                field: tp.name,
                headerName: tp.name,
                resizable: true, 
                cellRenderer: (p: { data: SplitTime }) => (
                    <SplitTimeResult
                        openEditDialog={openEditDialog}
                        openResetDialog={openRevertDialog}
                        splitTimeResult={p.data}
                        timingPointId={tp.id}
                    />
                ),
            })),
    ];

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

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
            refetch();
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
            refetch();
        }
    };



    return (
        <>
            {/* <div className="flex bg-white p-8 rounded-lg shadow-md flex-col h-full"></div> */}
            <div className="ag-theme-material flex bg-white flex-col h-full">
                {splitTimes && (
                    <AgGridReact<SplitTime>
                        ref={gridRef}
                        context={{ refetch }}
                        suppressCellFocus={true}
                        suppressAnimationFrame={true}
                        columnDefs={defaultColumns}
                        rowData={splitTimes}
                        onFirstDataRendered={onFirstDataRendered}
                        onGridSizeChanged={onFirstDataRendered}
                    ></AgGridReact>
                )}
            </div>
        </>
    );
};

export default SplitTimes;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
