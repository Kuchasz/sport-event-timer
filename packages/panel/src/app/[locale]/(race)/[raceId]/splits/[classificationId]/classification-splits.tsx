"use client";

import { mdiArrowRight, mdiDrag, mdiMagnify, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { PoorButton } from "src/components/poor-button";
import { SectionHeader } from "src/components/page-headers";
import { SidePage } from "src/components/pages";
import { PoorInput } from "src/components/poor-input";
import { PoorSelect } from "src/components/poor-select";
import { type AppRouterOutputs } from "src/trpc";
import { trpc } from "src/trpc-core";
import { Classifications } from "../../../../../../components/classifications";
import { PoorNumberInput } from "src/components/poor-number-input";

type Classification = AppRouterOutputs["classification"]["classification"];
type ClassificationListItem = AppRouterOutputs["classification"]["classifications"][0];
type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type Split = AppRouterOutputs["split"]["splits"][0];
type SplitsOrder = AppRouterOutputs["split"]["splitsOrder"];

export const ClassificationSplits = ({
    classification,
    raceId,
    timingPoints,
    initialSplitsOrder,
    initialSplits,
    initialClassifications,
}: {
    raceId: number;
    classification: Classification;
    timingPoints: TimingPoint[];
    initialSplitsOrder: SplitsOrder;
    initialSplits: Split[];
    initialClassifications: ClassificationListItem[];
}) => {
    const { data: splits } = trpc.split.splits.useQuery(
        { raceId: Number(raceId), classificationId: classification.id },
        { initialData: initialSplits },
    );
    const { data: splitsOrder } = trpc.split.splitsOrder.useQuery(
        { raceId: Number(raceId), classificationId: classification.id },
        { initialData: initialSplitsOrder },
    );
    const { data: classifications, refetch } = trpc.classification.classifications.useQuery(
        { raceId: Number(raceId) },
        { initialData: initialClassifications },
    );

    return (
        <SidePage
            side={
                <Classifications
                    navigationPath="splits"
                    raceId={String(raceId)}
                    classificationId={String(classification.id)}
                    classifications={classifications}
                />
            }
            content={
                <SplitsList
                    onSplitsListUpdated={refetch}
                    raceId={Number(raceId)}
                    classificationId={classification.id}
                    classificationName={classification.name}
                    splitsOrder={splitsOrder}
                    splits={splits}
                    timingPoints={timingPoints}
                />
            }></SidePage>
    );
};

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
        <tr className={classNames("border-b")}>
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
                <PoorNumberInput
                    placeholder="distance from start (meters)"
                    value={split.distanceFromStart}
                    onChange={e => onSplitChange({ ...split, distanceFromStart: e.target.value })}
                />
            </td>
            <td
                className={classNames(
                    "w-auto pr-2 transition-opacity",
                    moveMode && moveMode !== split.id && "pointer-events-none opacity-15",
                )}>
                <SplitButton onClick={() => onDeleteSplit(split.id)} icon={mdiTrashCanOutline} />
            </td>
        </tr>
    );
};

type SplitsListProps = {
    classificationId: number;
    classificationName: string;
    timingPoints: TimingPoint[];
    raceId: number;
    splits: Split[];
    splitsOrder: number[];
    onSplitsListUpdated: () => void;
};

const PoorTableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="m-2 select-none whitespace-nowrap bg-white px-2 py-3">{children}</th>
);

export const SplitsList = ({
    timingPoints,
    classificationId,
    classificationName,
    raceId,
    splits,
    splitsOrder,
    onSplitsListUpdated,
}: SplitsListProps) => {
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
                distanceFromStart: 0,
                classificationId,
            },
        ]);
        setNewSplitsOrder([...newSplitsOrder, id]);
    };

    const handleSaveChanges = async () => {
        await updateSplitsMutation.mutateAsync({ classificationId, raceId, splits: newSplits, order: newSplitsOrder });
        onSplitsListUpdated();
    };

    const handleRejectChanges = () => {
        setNewSplits(splits);
        setNewSplitsOrder(splitsOrder);
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
            <PoorButton onClick={addSplit} outline>
                <Icon size={0.8} path={mdiPlus} />
                <span className="ml-2">{t("pages.splits.classificationSplits.addSplit")}</span>
            </PoorButton>
            <div className="my-4 border">
                <table className="min-w-full bg-white">
                    <thead className="text-left text-xs">
                        <tr className="border-b">
                            <th className="m-2 w-auto select-none whitespace-nowrap bg-white px-2 py-3"></th>
                            <PoorTableHeader>{t("pages.splits.classificationSplits.grid.columns.name")}</PoorTableHeader>
                            <PoorTableHeader>{t("pages.splits.classificationSplits.grid.columns.timingPoint")}</PoorTableHeader>
                            <PoorTableHeader>{t("pages.splits.classificationSplits.grid.columns.distance")}</PoorTableHeader>
                            <PoorTableHeader> </PoorTableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {splitsInOrder.length > 0 ? (
                            splitsInOrder.map(s => (
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>
                                    <div className="flex items-center justify-center p-8 text-sm">
                                        <Icon className="mx-2" path={mdiMagnify} size={1}></Icon>
                                        <span>{t("shared.dataTable.noRowsToShow")}</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex">
                <PoorButton onClick={handleRejectChanges} outline>
                    {t("shared.cancel")}
                </PoorButton>
                <PoorButton onClick={handleSaveChanges} loading={updateSplitsMutation.isLoading} className="ml-2" type="submit">
                    {t("shared.save")}
                </PoorButton>
            </div>
        </div>
    );
};
