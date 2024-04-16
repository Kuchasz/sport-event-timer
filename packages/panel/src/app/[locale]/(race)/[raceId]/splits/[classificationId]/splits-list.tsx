"use client";

import { mdiDrag, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Button } from "src/components/button";
import { SectionHeader } from "src/components/page-headers";
import { PoorDataTable, PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorInput } from "src/components/poor-input";
import { PoorSelect } from "src/components/poor-select";
import { Label } from "src/form";
import type { AppRouterOutputs } from "src/trpc";
import { trpc } from "src/trpc-core";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type Split = AppRouterOutputs["split"]["splits"][0];

const DropTarget = ({ onDrop, moveMode }: { onDrop: () => void; moveMode: number }) => (
    <div
        onClick={onDrop}
        className={classNames(
            "text-2xs col-span-5 flex cursor-pointer justify-center overflow-hidden rounded-md bg-gray-100 font-semibold uppercase text-gray-700 transition-all hover:bg-gray-50",
            moveMode ? "h-auto px-2 py-1" : "h-0",
        )}>
        drop element here
    </div>
);

const SplitButton = ({ onClick, icon }: { onClick: () => void; icon: string }) => {
    return (
        <div className="flex cursor-pointer items-center self-center rounded-full p-2 hover:bg-gray-100" onClick={onClick}>
            <Icon size={0.8} path={icon} />
        </div>
    );
};

const SplitRow = ({
    split,
    onSplitChange,
    timingPoints,
    moveMode,
    onEnableMoveMode,
    onDeleteSplit,
}: {
    split: Split;
    onSplitChange: (split: Split) => void;
    timingPoints: TimingPoint[];
    moveMode: number;
    onEnableMoveMode: (id: number) => void;
    onDeleteSplit: (id: number) => void;
}) => {
    return (
        <div
            className={classNames(
                "col-span-5 grid grid-cols-subgrid transition-opacity",
                moveMode && moveMode !== split.id && "pointer-events-none opacity-25",
            )}>
            <SplitButton onClick={() => onEnableMoveMode(split.id)} icon={mdiDrag} />
            <PoorInput value={split.name} onChange={e => onSplitChange({ ...split, name: e.target.value })}></PoorInput>
            <PoorSelect
                initialValue={split.timingPointId}
                items={timingPoints}
                placeholder="choose timing point"
                nameKey="name"
                valueKey="id"
                onChange={e => onSplitChange({ ...split, timingPointId: e.target.value })}></PoorSelect>
            <PoorInput value={split.name} onChange={e => onSplitChange({ ...split, name: e.target.value })}></PoorInput>
            <SplitButton onClick={() => onDeleteSplit(split.id)} icon={mdiTrashCanOutline} />
        </div>
    );
};

type SplitsProps = {
    classificationId: number;
    classificationName: string;
    timingPoints: TimingPoint[];
    raceId: number;
    splits: Split[];
    splitsOrder: number[];
};

export const SplitsList = ({ timingPoints, classificationId, classificationName, raceId, splits, splitsOrder }: SplitsProps) => {
    const [newSplits, setNewSplits] = useState<Split[]>(splits);
    const [newSplitsOrder, setNewSplitsOrder] = useState<number[]>(splitsOrder);
    const [moveMode, setMoveMode] = useState<number>(0);
    const updateSplitsMutation = trpc.split.updateSplits.useMutation();

    const t = useTranslations();

    const splitsInOrder = newSplitsOrder.map(split => newSplits.find(s => split === s.id)!);

    const addSplit = () => {
        const minId = Math.min(...newSplits.map(tp => tp.id));
        const id = (minId > 0 ? 0 : minId) - 2;
        setNewSplits([
            ...newSplits,
            {
                id,
                name: "Split",
                timingPointId: timingPoints[0].id,
                raceId,
                classificationId,
            },
        ]);
        setNewSplitsOrder([...newSplitsOrder, id]);
    };

    const handleSaveChanges = async () => {
        await updateSplitsMutation.mutateAsync({ classificationId, raceId, splits: newSplits, order: newSplitsOrder });
    };

    const handleMoveMode = (id: number) => {
        if (moveMode === id) {
            setMoveMode(0);
            return;
        }

        setMoveMode(id);
    };

    const handleDeleteSplit = (id: number) => {
        setNewSplits(newSplits.filter(s => s.id !== id));
        setNewSplitsOrder(newSplitsOrder.filter(s => s !== id));
    };

    const moveSplitToIndex = (dropIndex: number, splitId: number) => {
        setMoveMode(0);

        const newOrder = newSplitsOrder.filter(s => s !== splitId);
        newOrder.splice(dropIndex, 0, splitId);
        setNewSplitsOrder(newOrder);
    };

    const handleSplitChange = (split: Split) => {
        const index = newSplits.findIndex(s => s.id === split.id);
        const newSplitsCopy = [...newSplits];
        newSplitsCopy[index] = split;
        setNewSplits(newSplitsCopy);
    };

    const cols: PoorDataTableColumn<Split>[] = [
        { field: "name", headerName: "Name", sortable: false },
        {
            field: "timingPointId",
            headerName: "TimingPoint",
            sortable: false,
        },
        {
            field: "name",
            headerName: "Distance",
            sortable: false,
        },
        {
            field: "name",
            allowShrink: true,
            headerName: "",
            sortable: false,
            cellRenderer: () => <SplitButton onClick={() => {}} icon={mdiTrashCanOutline} />,
        },
    ];

    return (
        <div>
            <SectionHeader title={classificationName} />

            <PoorDataTable<Split>
                hideColumnsChooser
                hidePaging
                gridName="time-penalties"
                columns={cols}
                data={splitsInOrder ?? []}
                getRowId={p => p.id}></PoorDataTable>

            <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: "min-content 1fr 1fr 1fr min-content" }}>
                <div></div>
                <Label>Name</Label>
                <Label>Timing Point</Label>
                <Label>Distance</Label>
                <Label></Label>
                {splitsInOrder.map((s, index) => (
                    <React.Fragment key={s.id}>
                        <DropTarget onDrop={() => moveSplitToIndex(index, moveMode)} moveMode={moveMode} />
                        <SplitRow
                            split={s}
                            onSplitChange={handleSplitChange}
                            timingPoints={timingPoints}
                            moveMode={moveMode}
                            onEnableMoveMode={handleMoveMode}
                            onDeleteSplit={handleDeleteSplit}
                        />
                        {index === splitsInOrder.length - 1 && (
                            <DropTarget onDrop={() => moveSplitToIndex(index + 1, moveMode)} moveMode={moveMode} />
                        )}
                    </React.Fragment>
                ))}
                <div className="col-span-4 flex items-center justify-end"></div>
                <SplitButton icon={mdiPlus} onClick={addSplit} />
            </div>
            <div className="mt-4 flex">
                <Button outline>{t("shared.cancel")}</Button>
                <Button onClick={handleSaveChanges} loading={updateSplitsMutation.isLoading} className="ml-2" type="submit">
                    {t("shared.save")}
                </Button>
            </div>
        </div>
    );
};
