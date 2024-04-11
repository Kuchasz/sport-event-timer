"use client";

import { mdiDrag, mdiFileDocumentArrowRightOutline, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "src/components/button";
import { PageHeader, SectionHeader } from "src/components/page-headers";
import { TimingPointCreate } from "src/components/panel/timing-point/timing-point-create";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorInput } from "src/components/poor-input";
import { PoorModal } from "src/components/poor-modal";
import { PoorSelect } from "src/components/poor-select";
import { FormCard, Label } from "src/form";
import type { AppRouterOutputs } from "src/trpc";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type Split = AppRouterOutputs["split"]["splits"][0];

const DropTarget = ({ onDrop, moveMode }: { onDrop: () => void; moveMode: number }) => (
    <div
        onClick={onDrop}
        className={classNames(
            "text-2xs col-span-4 cursor-pointer overflow-hidden bg-orange-300 uppercase text-orange-700 transition-all hover:bg-orange-100",
            moveMode ? "h-auto px-2 py-1" : "h-0",
        )}>
        drop element here
    </div>
);

// const TimingPointsOrder = ({
//     initialTimingPointsInOrder,
//     onTimingPointsOrderChange,
// }: {
//     initialTimingPointsInOrder: Split[];
//     onTimingPointsOrderChange: (times: Split[]) => void;
// }) => {
//     const dropElements = useRef<(HTMLDivElement | null)[]>([]);
//     const elementsHolder = useRef<HTMLDivElement | null>(null);
//     const [dragStarted, setDragStarted] = useState(false);
//     const [dropTarget, setDropTarget] = useState<number | null>(null);
//     const [dragTarget, setDragTarget] = useState<number | null>(null);

//     const [timesInOrder, setTimesInOrder] = useState<Split[]>(initialTimingPointsInOrder);

//     const onDragEnter = (idx: number) => (_event: React.DragEvent<HTMLDivElement>) => {
//         _event.preventDefault();
//         setDropTarget(idx);
//     };
//     const onDragOver = (_idx: number) => (_event: React.DragEvent<HTMLDivElement>) => {
//         _event.dataTransfer.dropEffect = "move";
//         _event.preventDefault();
//     };
//     const onDragLeave = (_event: React.DragEvent<HTMLDivElement>) => {
//         setDropTarget(null);
//     };

//     const onDragStart = (idx: number) => (_event: React.DragEvent<HTMLDivElement>) => {
//         setDragStarted(true);
//         setDragTarget(idx);

//         const crt = _event.currentTarget.cloneNode(true) as HTMLDivElement;
//         crt.style.position = "absolute";
//         crt.style.top = "-1000px";
//         document.body.appendChild(crt);
//         _event.dataTransfer.setDragImage(crt, 0, 0);
//         setTimeout(() => document.body.removeChild(crt));
//     };

//     const onDragEnd = (_event: React.DragEvent<HTMLDivElement>) => {
//         setDragStarted(false);
//         setDragTarget(null);
//     };

//     const onDrop = (idx: number) => (_event: React.DragEvent<HTMLDivElement>) => {
//         const newTimesInOrder = [...timesInOrder];
//         const draggedElement = newTimesInOrder.splice(dragTarget!, 1)[0];

//         const dropIndex = idx > dragTarget! ? idx - 1 : idx;

//         newTimesInOrder.splice(dropIndex, 0, draggedElement);
//         setTimesInOrder(newTimesInOrder);
//         onTimingPointsOrderChange(newTimesInOrder);

//         setDropTarget(null);
//         setDragTarget(null);
//     };

//     return (
//         <div className="relative" ref={elementsHolder}>
//             {timesInOrder.map((tio, index) => (
//                 <div className="relative" key={`${tio.id}.${tio.split}`}>
//                     <DropTarget
//                         onDragEnter={onDragEnter(index)}
//                         onDragOver={onDragOver(index)}
//                         onDragLeave={onDragLeave}
//                         onDrop={onDrop(index)}
//                         dropTarget={dropTarget}
//                         index={index}
//                         dragStarted={dragStarted}
//                     />
//                     <div
//                         draggable
//                         onDragStart={onDragStart(index)}
//                         onDragEnd={onDragEnd}
//                         ref={el => (dropElements.current[index] = el)}
//                         key={`${tio.id}.${tio.split}`}
//                         className={classNames(
//                             "my-2 flex w-80 cursor-grab select-none items-center rounded-md border bg-white p-2.5 shadow-sm",
//                             dragTarget === index && "opacity-50",
//                         )}>
//                         <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">{index + 1}</div>
//                         <div className="mx-2">
//                             <div className="text-sm font-semibold">{tio.name}</div>
//                             <div className="text-2xs font-semibold text-gray-500">{tio.description ?? "Some default description"}</div>
//                         </div>
//                         <div className="flex-grow"></div>
//                         {tio.laps ? <div className="shrink-0 text-xs font-semibold">SPLIT: {tio.split + 1}</div> : null}
//                         <Icon className="ml-1 shrink-0" size={1} path={mdiDrag}></Icon>
//                     </div>
//                     {index === timesInOrder.length - 1 && (
//                         <DropTarget
//                             onDragEnter={onDragEnter(index + 1)}
//                             onDragOver={onDragOver(index + 1)}
//                             onDragLeave={onDragLeave}
//                             onDrop={onDrop(index + 1)}
//                             dropTarget={dropTarget}
//                             index={index + 1}
//                             dragStarted={dragStarted}
//                         />
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// };

const SplitRow = ({
    s,
    timingPoints,
    onEnableMoveMode,
}: {
    s: Split;
    timingPoints: TimingPoint[];
    onEnableMoveMode: (id: number) => void;
}) => {
    return (
        <>
            <PoorInput value={s.name} onChange={() => {}}></PoorInput>
            <PoorSelect
                initialValue={s.timingPointId}
                items={timingPoints}
                placeholder="choose timing point"
                nameKey="name"
                valueKey="id"
                onChange={() => {}}></PoorSelect>
            <PoorInput value={s.name} onChange={() => {}}></PoorInput>
            <div className="flex items-center">
                <Button kind="delete" small outline>
                    <Icon size={0.8} path={mdiTrashCanOutline} />
                    <span className="mx-2">Delete</span>
                </Button>
                <Button onClick={() => onEnableMoveMode(s.id)} small outline className="ml-2">
                    <Icon size={0.8} path={mdiDrag} />
                    <span className="mx-2">Move</span>
                </Button>
            </div>
        </>
    );
};
type SplitsProps = {
    classificationId: number;
    timingPoints: TimingPoint[];
    raceId: number;
    splits: Split[];
    splitsOrder: number[];
};

const Splits = ({ timingPoints, classificationId, raceId, splits, splitsOrder }: SplitsProps) => {
    const [newSplits, setNewSplits] = useState<Split[]>(splits);
    const [newSplitsOrder, setNewSplitsOrder] = useState<number[]>(splitsOrder);
    const [moveMode, setMoveMode] = useState<number>(0);

    const t = useTranslations();

    const splitsInOrder = newSplitsOrder.map(split => newSplits.find(s => split === s.id)!);

    const addSplit = () => {
        const id = -newSplits.length;
        setNewSplits([
            ...newSplits,
            {
                id,
                name: "New split",
                timingPointId: timingPoints[0].id,
                raceId,
                classificationId,
            },
        ]);
        setNewSplitsOrder([...newSplitsOrder, id]);
    };

    const handleDrop = (dropIndex: number, splitId: number) => {
        alert(`dropIndex: ${dropIndex}, splitId: ${splitId}`);
    };

    return (
        <FormCard title="lorem ipsum polelum">
            <div className="">
                <Button onClick={addSplit} outline>
                    <Icon size={0.8} path={mdiPlus} />
                    <span className="ml-2">Add split</span>
                </Button>
                <div className="mt-4 grid grid-cols-4 gap-2">
                    <Label>Name</Label>
                    <Label>Timing Point</Label>
                    <Label>Distance</Label>
                    <Label>Actions</Label>
                    {splitsInOrder.map((s, index) => (
                        <>
                            <DropTarget onDrop={() => handleDrop(index, moveMode)} moveMode={moveMode} />
                            <SplitRow s={s} timingPoints={timingPoints} onEnableMoveMode={id => setMoveMode(id)} />
                            {index === splitsInOrder.length - 1 && (
                                <DropTarget onDrop={() => handleDrop(index + 1, moveMode)} moveMode={moveMode} />
                            )}
                        </>
                    ))}
                </div>
                <div className="mt-4 flex">
                    <Button outline>{t("shared.cancel")}</Button>
                    <Button className="ml-2" type="submit">
                        {t("shared.save")}
                    </Button>
                </div>
            </div>
        </FormCard>
    );
};

export const TimingPoints = () => {
    const raceId = useCurrentRaceId();
    const { data: timingPoints, refetch: refetchTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: raceId },
        { initialData: [] },
    );
    const { data: classifications } = trpc.classification.classifications.useQuery({ raceId: raceId }, { initialData: [] });

    const [classificationId, setClassificationId] = useState<number>();
    const t = useTranslations();
    const router = useRouter();

    const { data: splitsOrder, refetch: refetchOrder } = trpc.split.splitsOrder.useQuery(
        { raceId: raceId, classificationId: classificationId! },
        {
            enabled: !!classificationId,
            initialData: [],
        },
    );

    const { data: splits, refetch: refetchSplits } = trpc.split.splits.useQuery(
        { raceId: raceId, classificationId: classificationId! },
        {
            enabled: !!classificationId,
            initialData: [],
        },
    );

    // const updateOrderMutation = trpc.split.updateOrder.useMutation();

    const cols: PoorDataTableColumn<TimingPoint>[] = [
        { field: "name", headerName: t("pages.timingPoints.sections.grid.columns.name"), sortable: true },
        {
            field: "abbrev",
            headerName: t("pages.timingPoints.sections.grid.columns.shortName"),
        },
        {
            field: "type",
            headerName: t("pages.timingPoints.sections.grid.columns.type"),
        },
        {
            field: "splits",
            headerName: t("pages.timingPoints.sections.grid.columns.splits"),
        },
        {
            field: "numberOfAccessUrls",
            headerName: t("pages.timingPoints.sections.grid.columns.numberOfAccessUrls"),
        },
        {
            field: "id",
            headerName: t("pages.timingPoints.sections.grid.columns.actions"),
            sortable: false,
            cellRenderer: d => (
                <Button onClick={() => router.push(`/${raceId}/timing-points/${d.id}`)} small outline>
                    <Icon size={0.8} path={mdiFileDocumentArrowRightOutline} />
                    <span className="ml-2">{t("shared.details")}</span>
                </Button>
            ),
        },
    ];

    // const splitsInOrder = mapWithCount(
    //     sortedTimingPoints,
    //     s => s.id,
    //     (tp, split) => ({ ...tp, split }),
    // );

    // const onTimingPointsOrderChange = async (_timingPoints: Split[]) => {
    //     await updateOrderMutation.mutateAsync({ raceId, order: timingPoints.map(t => t.id) });
    //     onTimingPointCreated();
    // };

    const onTimingPointCreated = () => {
        void refetchTimingPoints();
        // void refetchOrder();
    };

    return (
        <>
            <Head>
                <title>{t("pages.timingPoints.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.timingPoints.header.title")} description={t("pages.timingPoints.header.description")} />
                <div className="mt-8">
                    <SectionHeader
                        title={t("pages.timingPoints.sections.grid.header.title")}
                        description={t("pages.timingPoints.sections.grid.header.description")}
                    />
                    <div className="p-2"></div>
                    <PoorModal
                        onResolve={onTimingPointCreated}
                        title={t("pages.timingPoints.create.title")}
                        component={TimingPointCreate}
                        componentProps={{ raceId: raceId, index: 0, onReject: () => {} }}>
                        <Button outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.timingPoints.create.button")}</span>
                        </Button>
                    </PoorModal>
                    <div className="p-2"></div>
                    <PoorDataTable columns={cols} hideColumnsChooser getRowId={d => d.id} gridName="timing-points" data={timingPoints} />
                </div>
                <div className="py-8">
                    <SectionHeader
                        title={t("pages.timingPoints.sections.order.header.title")}
                        description={t("pages.timingPoints.sections.order.header.description")}
                    />
                    <div className="my-2">
                        <PoorSelect
                            initialValue={classificationId}
                            items={classifications}
                            placeholder={t("pages.players.form.classification.placeholder")}
                            nameKey="name"
                            valueKey="id"
                            onChange={e => setClassificationId(e.target.value)}></PoorSelect>
                    </div>
                    {splitsOrder.length > 0 ? (
                        <Splits
                            classificationId={classificationId!}
                            timingPoints={timingPoints}
                            raceId={raceId}
                            splits={splits}
                            splitsOrder={splitsOrder}
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
};
