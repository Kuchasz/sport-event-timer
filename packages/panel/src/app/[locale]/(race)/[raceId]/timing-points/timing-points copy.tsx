// "use client";

// import { mdiChevronRight, mdiPlus } from "@mdi/js";
// import Icon from "@mdi/react";
// import { createRange } from "@set/utils/dist/array";
// import classNames from "classnames";
// import { type Route } from "next";
// import { useTranslations } from "next-intl";
// import Head from "next/head";
// import Link from "next/link";
// import React, { useEffect, useRef } from "react";
// import { PageHeader } from "src/components/page-headers";
// import { TimingPointCreate } from "src/components/panel/timing-point/timing-point-create";
// import { PoorModal } from "src/components/poor-modal";
// import type { AppRouterOutputs } from "src/trpc";
// import { getTimingPointIcon } from "src/utils";
// import { useCurrentRaceId } from "../../../../../hooks";
// import { trpc } from "../../../../../trpc-core";

// type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoint"];

// const TimingPointCard = ({
//     onCreate,
//     index,
//     raceId,
//     timingPoint,
//     isFirst,
//     isLast,
// }: {
//     onCreate: () => void;
//     index: number;
//     raceId: number;
//     isFirst: boolean;
//     isLast: boolean;
//     timingPoint: TimingPoint;
// }) => {
//     const t = useTranslations();

//     return (
//         <div className="flex flex-col">
//             {!isFirst && (
//                 <div className="flex flex-col items-center">
//                     <PoorModal
//                         onResolve={onCreate}
//                         title={t("pages.timingPoints.create.title")}
//                         component={TimingPointCreate}
//                         componentProps={{ raceId: raceId, index, onReject: () => {} }}>
//                         <button className="my-1 flex w-full cursor-pointer items-center self-center rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-600">
//                             <Icon path={mdiPlus} size={0.7} />
//                             <span className="ml-1.5">{t("pages.timingPoints.create.button")}</span>
//                         </button>
//                     </PoorModal>
//                 </div>
//             )}

//             <div>
//                 <div className="my-1 flex w-full items-center rounded-3xl bg-gray-100 p-1">
//                     <div className={classNames("flex rounded-lg px-6 py-4")}>
//                         <div
//                             className={classNames(`mr-4 self-center rounded-2xl bg-gray-300 p-3 text-white`, {
//                                 ["rotate-90"]: !isLast,
//                             })}>
//                             <Icon path={getTimingPointIcon(isFirst, isLast)} size={0.8} />
//                         </div>
//                         <div className="flex flex-col">
//                             <h4 className={classNames("text-md font-bold")}>{timingPoint.name}</h4>
//                             <span className={classNames("text-sm text-gray-400")}>
//                                 {timingPoint.description ?? "Timing point where time should be registered"}
//                             </span>
//                         </div>
//                     </div>
//                     <div className="flex-grow"></div>
//                     <Link
//                         className="mr-4 rounded-full p-1 hover:bg-white"
//                         href={`/${timingPoint.raceId}/timing-points/${timingPoint.id}` as Route}>
//                         <Icon path={mdiChevronRight} size={1}></Icon>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const getCollision = (
//     dragElement: HTMLDivElement,
//     dropElement: HTMLDivElement,
//     dropElements: (HTMLDivElement | null)[],
//     dropElementsRects: (DOMRect | null)[],
// ): "lower" | "higher" | "none" | "self" => {
//     if (dragElement === dropElement) return "self";

//     const dropElementIndex = dropElements.indexOf(dropElement);
//     const dragElementIndex = dropElements.indexOf(dragElement);

//     const dragRect = dragElement.getBoundingClientRect();
//     const dropRect = dropElementsRects[dropElementIndex]!;
//     const dragElementRect = dropElementsRects[dragElementIndex]!;

//     const horizontalOverlap = !(dragRect.right < dropRect.left || dragRect.left > dropRect.right);
//     const dropRectCenter = dropRect.top + dropRect.height / 2;

//     const edge = dragElementRect.top - dragRect.top > 0 ? dragRect.top : dragRect.bottom;

//     const potentialResult = dropRectCenter > edge ? "lower" : "higher";

//     return horizontalOverlap ? potentialResult : "none";
// };

// type TimingPointWithLap = TimingPoint & { lap: number };

// const TimingPointsOrder = ({ timesInOrder }: { timesInOrder: TimingPointWithLap[] }) => {
//     const dragStartX = useRef<number>(0);
//     const dragStartY = useRef<number>(0);
//     const initialDragElementRect = useRef<DOMRect | null>(null);
//     const dragElement = useRef<HTMLDivElement | null>(null);
//     const dropElement = useRef<HTMLDivElement | null>(null);
//     const dropElements = useRef<(HTMLDivElement | null)[]>([]);
//     const initialElementsRects = useRef<(DOMRect | null)[]>([]);
//     const elementsHolder = useRef<HTMLDivElement | null>(null);
//     const dragElementPlaceholder = useRef<HTMLDivElement | null>(null);
//     const timingPointsInOrder = useRef<TimingPointWithLap[]>(timesInOrder);

//     const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, targetElement: HTMLDivElement | null) => {
//         if (!targetElement) return;
//         dragElement.current = targetElement;
//         initialDragElementRect.current = targetElement.getBoundingClientRect();
//         dragStartX.current = e.clientX;
//         dragStartY.current = e.clientY;
//         timingPointsInOrder.current = timesInOrder;

//         const targetElementIndex = dropElements.current.indexOf(targetElement);
//         initialElementsRects.current = dropElements.current.map(el => el?.getBoundingClientRect() ?? null);

//         dragElementPlaceholder.current!.style.height = `${initialDragElementRect.current.height}px`;
//         dragElementPlaceholder.current!.style.width = `${initialDragElementRect.current.width}px`;

//         dropElements.current.forEach(el => (el!.style.transition = "none"));

//         dropElements.current
//             .slice(targetElementIndex + 1)
//             .forEach(el => (el!.style.transform = `translate(0px, ${initialDragElementRect.current!.height + 8}px)`));

//         targetElement.classList.replace("cursor-grab", "cursor-grabbing");
//         targetElement.style.position = "fixed";
//         targetElement.style.top = `${initialDragElementRect.current.top}px`;
//         targetElement.style.left = `${initialDragElementRect.current.left}px`;
//         targetElement.style.zIndex = "1000";
//         targetElement.style.transition = "none";
//     };

//     const handlePointerUp = (_e: React.PointerEvent<HTMLDivElement>, targetElement: HTMLDivElement | null) => {
//         if (!targetElement) return;

//         dragElement.current = null;
//         dropElement.current = null;
//         initialElementsRects.current = [];
//         dragStartX.current = 0;
//         dragStartY.current = 0;

//         targetElement.style.height = "auto";

//         dropElements.current.forEach(el => (el!.style.transform = `translate(0px, 0px)`));
//         dropElements.current.forEach(el => (el!.style.transition = "none"));

//         targetElement.classList.replace("cursor-grabbing", "cursor-grab");
//         targetElement.style.position = "relative";
//         targetElement.style.top = `0px`;
//         targetElement.style.left = `0px`;
//         targetElement.style.zIndex = "auto";
//         targetElement.style.transition = "transform 0.2s";
//         targetElement.style.transform = `translate(0px, 0px)`;

//         dragElementPlaceholder.current!.style.height = `0px`;
//         dragElementPlaceholder.current!.style.width = `0px`;
//     };

//     const handlePointerMove = (e: PointerEvent) => {
//         if (!dragElement.current || !initialDragElementRect.current || !dragStartX.current || !dragStartY.current) return;

//         const deltaX = e.clientX - dragStartX.current;
//         const deltaY = e.clientY - dragStartY.current;

//         const collisions = dropElements.current.map(element => ({
//             element,
//             collision: getCollision(dragElement.current!, element!, dropElements.current, initialElementsRects.current),
//         }));

//         const currentDropCollision =
//             deltaY > 0 ? collisions.filter(c => c.collision === "higher").at(-1) : collisions.filter(c => c.collision === "lower").at(0);

//         const currentDropElement = currentDropCollision?.element;

//         if (currentDropElement && currentDropElement !== dropElement.current) {
//             collisions
//                 .filter(c => c.collision !== "self" && c.collision !== "none")
//                 .forEach(c => {
//                     c.element!.style.transition = "transform 0.2s";
//                     if (c.collision === "higher") c.element!.style.transform = `translate(0px, 0px)`;
//                     if (c.collision === "lower")
//                         c.element!.style.transform = `translate(0px, ${initialDragElementRect.current!.height + 8}px)`;
//                 });

//             dropElement.current = currentDropElement;
//         }

//         if (collisions.some(c => c.collision === "none")) {
//             console.log("awdawd");
//             collisions
//                 .filter(c => c.collision === "none")
//                 .forEach(c => {
//                     c.element!.style.transition = "transform 0.2s";
//                     c.element!.style.transform = `translate(0px, 0px)`;
//                 });
//         }

//         dragElement.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
//     };

//     useEffect(() => {
//         window.addEventListener("pointermove", handlePointerMove);

//         return () => {
//             window.removeEventListener("pointermove", handlePointerMove);
//         };
//     }, []);

//     return (
//         <div className="relative bg-pink-100 p-8" ref={elementsHolder}>
//             {timesInOrder.map((tio, index) => (
//                 <React.Fragment key={`${tio.id}.${tio.lap}`}>
//                     <div
//                         ref={el => (dropElements.current[index] = el)}
//                         onPointerDown={e => handlePointerDown(e, dropElements.current[index])}
//                         onPointerUp={e => handlePointerUp(e, dropElements.current[index])}
//                         key={`${tio.id}.${tio.lap}`}
//                         className={classNames(
//                             "relative mb-2 flex w-64 cursor-grab select-none items-center rounded-md border-2 bg-gray-100 px-3 py-1.5",
//                         )}>
//                         <div className="size-8 shrink-0 rounded-full bg-orange-500"></div>
//                         <div className="ml-3">
//                             <div className="text-sm font-semibold">
//                                 {tio.name} ... {tio.lap}
//                             </div>
//                             <div className="text-xs">{tio.description ?? "Some default description"}</div>
//                         </div>
//                         <div className="flex-grow"></div>
//                     </div>
//                 </React.Fragment>
//             ))}
//             <div className="mb-2" ref={dragElementPlaceholder}></div>
//         </div>
//     );
// };

// export const TimingPoints = () => {
//     const raceId = useCurrentRaceId();
//     const { data: timingPoints, refetch: refetchTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
//         { raceId: raceId },
//         { initialData: [] },
//     );
//     const t = useTranslations();

//     const { data: timingPointsOrder, refetch: refetchOrder } = trpc.timingPoint.timingPointsOrder.useQuery(
//         { raceId: raceId },
//         {
//             initialData: [],
//         },
//     );

//     const sortedTimingPoints = timingPointsOrder.map(point => timingPoints.find(tp => point === tp.id)!);

//     const timesInOrder = timingPoints.flatMap(tp => createRange({ from: 0, to: tp.laps }).map(lap => ({ ...tp, lap })));

//     return (
//         <>
//             <Head>
//                 <title>{t("pages.timingPoints.header.title")}</title>
//             </Head>
//             <div className="border-1 flex h-full flex-col border-solid border-gray-600">
//                 <PageHeader title={t("pages.timingPoints.header.title")} description={t("pages.timingPoints.header.description")} />
//                 <div className="flex">
//                     <div className="hidden w-full max-w-md ">
//                         {sortedTimingPoints?.map((e, index) => (
//                             <TimingPointCard
//                                 key={e.id}
//                                 index={index}
//                                 raceId={raceId}
//                                 onCreate={() => {
//                                     void refetchTimingPoints();
//                                     void refetchOrder();
//                                 }}
//                                 timingPoint={e}
//                                 isFirst={index === 0}
//                                 isLast={index === sortedTimingPoints.length - 1}
//                             />
//                         ))}
//                     </div>
//                 </div>
//                 <div>
//                     <TimingPointsOrder timesInOrder={timesInOrder} />
//                 </div>
//             </div>
//         </>
//     );
// };
