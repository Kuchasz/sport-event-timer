"use client";

import { mdiArrowRight, mdiDrag, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Button } from "src/components/button";
import { SectionHeader } from "src/components/page-headers";
import { PoorInput } from "src/components/poor-input";
import { PoorSelect } from "src/components/poor-select";
import type { AppRouterOutputs } from "src/trpc";
import { trpc } from "src/trpc-core";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type Split = AppRouterOutputs["split"]["splits"][0];

const SplitButton = ({ className, onClick, icon }: { className?: string; onClick: () => void; icon: string }) => {
    return (
        <div
            className={classNames("inline-flex cursor-pointer items-center self-center rounded-full p-2 hover:bg-gray-100", className)}
            onClick={onClick}>
            <Icon size={0.8} path={icon} />
        </div>
    );
};

const TableSplitRow = ({
    split,
    onSplitChange,
    timingPoints,
    moveMode,
    onEnableMoveMode,
    onTriggerMove,
    onDeleteSplit,
}: {
    split: Split;
    onSplitChange: (split: Split) => void;
    timingPoints: TimingPoint[];
    moveMode: number;
    onEnableMoveMode: (id: number) => void;
    onTriggerMove: (id: number) => void;
    onDeleteSplit: (id: number) => void;
}) => {
    return (
        // <div
        //     className={classNames(
        //         "col-span-5 grid grid-cols-subgrid transition-opacity",
        //         moveMode && moveMode !== split.id && "pointer-events-none opacity-25",
        //     )}>
        <tr className={classNames("border-b")}>
            {/* <div className="absolute top-0 flex h-full items-center bg-red-500">awdawdaadawdadwadwadwawd</div> */}
            <td className="relative w-auto pl-2">
                {moveMode && moveMode !== split.id ? (
                    <SplitButton onClick={() => onTriggerMove(split.id)} icon={mdiArrowRight} />
                ) : (
                    <SplitButton onClick={() => onEnableMoveMode(split.id)} icon={mdiDrag} />
                )}
            </td>
            <td
                className={classNames(
                    "w-1/3 p-2 transition-opacity",
                    moveMode && moveMode !== split.id && "pointer-events-none opacity-15",
                )}>
                <PoorInput value={split.name} onChange={e => onSplitChange({ ...split, name: e.target.value })}></PoorInput>
            </td>
            <td
                className={classNames(
                    "w-1/3 p-2 transition-opacity",
                    moveMode && moveMode !== split.id && "pointer-events-none opacity-15",
                )}>
                <PoorSelect
                    initialValue={split.timingPointId}
                    items={timingPoints}
                    placeholder="choose timing point"
                    nameKey="name"
                    valueKey="id"
                    onChange={e => onSplitChange({ ...split, timingPointId: e.target.value })}></PoorSelect>
            </td>
            <td
                className={classNames(
                    "w-1/3 p-2 transition-opacity",
                    moveMode && moveMode !== split.id && "pointer-events-none opacity-15",
                )}>
                <PoorInput value={split.name} onChange={e => onSplitChange({ ...split, name: e.target.value })}></PoorInput>
            </td>
            <td
                className={classNames(
                    "w-auto pr-2 transition-opacity",
                    moveMode && moveMode !== split.id && "pointer-events-none opacity-15",
                )}>
                <SplitButton onClick={() => onDeleteSplit(split.id)} icon={mdiTrashCanOutline} />
            </td>
        </tr>
        // </div>
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

const PoorTableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="m-2 select-none whitespace-nowrap bg-white px-2 py-3">{children}</th>
);

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

    const handleTriggerMove = (id: number) => {
        const splitId = moveMode;
        const dropIndex = newSplitsOrder.indexOf(id);

        moveSplitToIndex(dropIndex, splitId);
    };

    const handleSplitChange = (split: Split) => {
        const index = newSplits.findIndex(s => s.id === split.id);
        const newSplitsCopy = [...newSplits];
        newSplitsCopy[index] = split;
        setNewSplits(newSplitsCopy);
    };

    return (
        <div>
            <SectionHeader title={classificationName} />
            <Button onClick={addSplit} outline>
                <Icon size={0.8} path={mdiPlus} />
                <span className="ml-2">Add split</span>
            </Button>
            <div className="my-4 border">
                <table className="min-w-full bg-white">
                    <thead className="text-left text-xs">
                        <tr className="border-b">
                            <th className="m-2 w-auto select-none whitespace-nowrap bg-white px-2 py-3"></th>
                            <PoorTableHeader>Name</PoorTableHeader>
                            <PoorTableHeader>Timing Point</PoorTableHeader>
                            <PoorTableHeader>Distance</PoorTableHeader>
                            <PoorTableHeader> </PoorTableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {splitsInOrder.map(s => (
                            <TableSplitRow
                                key={s.id}
                                split={s}
                                onSplitChange={handleSplitChange}
                                timingPoints={timingPoints}
                                moveMode={moveMode}
                                onTriggerMove={handleTriggerMove}
                                onEnableMoveMode={handleMoveMode}
                                onDeleteSplit={handleDeleteSplit}
                            />
                        ))}
                    </tbody>
                </table>
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
