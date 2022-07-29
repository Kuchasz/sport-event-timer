import DataGrid, { Column, SortColumn } from "react-data-grid";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Confirmation } from "../components/confirmation";
import { Demodal } from "demodal";
import { formatTimeWithMilliSec } from "@set/shared/dist";
import { InferMutationInput, InferQueryOutput, trpc } from "../trpc";
import {
    mdiAccountCogOutline,
    mdiAccountMultiplePlus,
    mdiAutorenew,
    mdiClockEdit,
    mdiClockEditOutline,
    mdiClockPlusOutline,
    mdiNoteEditOutline,
    mdiPlus,
    mdiReload,
    mdiTrashCan,
    mdiUpdate
    } from "@mdi/js";
import { milisecondsToTimeString } from "../utils";
import { NiceModal } from "components/modal";
import { RaceCreate } from "components/race-create";
import { RaceEdit } from "components/race-edit";
import { SplitTimeCreate } from "../components/split-time-create";
import { SplitTimeEdit } from "../components/split-time-edit";
import { useCurrentRaceId } from "use-current-race-id";
import { useMemo, useState } from "react";

type SplitTime = InferQueryOutput<"split-time.split-times">[0];
type RevertedSplitTime = InferMutationInput<"split-time.revert">;
type EditedSplitTime = InferMutationInput<"split-time.update">;

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
                            timingPointId: timingPointId
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
                            timingPointId: timingPointId
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
                            timingPointId: timingPointId
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
    const { data: splitTimes, refetch: refetchSplitTimes } = trpc.useQuery([
        "split-time.split-times",
        { raceId: raceId! }
    ]);
    const { data: timingPoints, refetch: refetchTimingPoints } = trpc.useQuery(
        ["timing-point.timingPoints", { raceId: raceId! }],
        { initialData: [] }
    );
    const { data: race } = trpc.useQuery(["race.race", { raceId }]);
    const updateSplitTimeMutation = trpc.useMutation(["split-time.update"]);
    const revertSplitTimeMuttaion = trpc.useMutation(["split-time.revert"]);
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const openEditDialog = async (editedSplitTime: SplitTime) => {
        const splitTime = await Demodal.open<EditedSplitTime>(NiceModal, {
            title: "Edit split time",
            component: SplitTimeEdit,
            props: {
                editedSplitTime,
                raceId,
                raceDate: race?.date?.getTime()
            }
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
                message: `You are trying to revert manual split time changes. Do you want to proceed?`
            }
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
        ...timingPoints!.map(tp => ({
            key: tp.name,
            name: tp.name,
            formatter: p => (
                <SplitTimeResult
                    openEditDialog={openEditDialog}
                    openResetDialog={openRevertDialog}
                    splitTimeResult={p.row}
                    timingPointId={tp.id}
                />
            )
        }))
    ];

    return (
        <>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={() => {}}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div>
                {splitTimes && (
                    <DataGrid
                        sortColumns={sortColumns}
                        className="h-full"
                        defaultColumnOptions={{
                            sortable: true,
                            resizable: true
                        }}
                        onSortColumnsChange={setSortColumns}
                        columns={columns}
                        rows={splitTimes}
                    />
                )}
            </div>
        </>
    );
};

export default SplitTimes;
