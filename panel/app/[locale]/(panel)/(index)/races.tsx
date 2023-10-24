"use client";

import Icon from "@mdi/react";
import { Demodal } from "demodal";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../../trpc-core";
import {
    mdiArrowRightThick,
    mdiCalendarEditOutline,
    mdiCalendarOutline,
    mdiClockOutline,
    mdiLockOpenVariantOutline,
    mdiLockOutline,
    mdiMapMarkerOutline,
    mdiOpenInNew,
    mdiPlus,
    mdiRestore,
    mdiTrashCan,
} from "@mdi/js";
import { NiceModal } from "components/modal";
import { RaceCreate } from "components/panel/race/race-create";
import { useState } from "react";
import classNames from "classnames";
import { PageHeader } from "components/page-header";
import { useLocale, useTranslations } from "next-intl";
import { isPast, isTodayOrLater } from "@set/utils/dist/datetime";
import { sort, sortDesc } from "@set/utils/dist/array";
import Link from "next/link";
import { PoorActions } from "components/poor-actions";
import { Confirmation } from "components/confirmation";
import { RaceEdit } from "components/panel/race/race-edit";
import { sportKinds } from "@set/utils/dist/sport-kind";

type Race = AppRouterOutputs["race"]["races"][0];
type CreatedRace = AppRouterInputs["race"]["add"];
type EditedRace = AppRouterInputs["race"]["update"];

const RegistrationEnabled = ({ race }: { race: Race }) => {
    return (
        <span
            className={classNames("flex h-full items-center", {
                ["font-semibold text-green-600"]: race.registrationEnabled,
                ["text-red-600"]: !race.registrationEnabled,
            })}
        >
            {race.registrationEnabled ? <Icon size={1} path={mdiLockOpenVariantOutline} /> : <Icon size={1} path={mdiLockOutline} />}
        </span>
    );
};

const Registrations = ({ race }: { race: Race }) => {
    return (
        <span className={classNames("flex h-full items-center")}>
            <span className="text-lg font-semibold">{race.registeredPlayers}</span>{" "}
            <span className="text-sm text-gray-500">
                {race.playersLimit && (
                    <span>
                        <span className="mx-1">/</span>
                        <span>{race.playersLimit}</span>
                    </span>
                )}
            </span>
        </span>
    );
};

const RaceFilterKind = ({ onSelect, isActive, name }: { onSelect: () => void; isActive: boolean; name: string }) => (
    <div
        onClick={onSelect}
        className={classNames("mx-0.5 cursor-default rounded-lg px-4", {
            ["bg-white"]: isActive,
            ["cursor-pointer hover:bg-gray-50"]: !isActive,
        })}
    >
        {name}
    </div>
);

type RaceFilterType = "all" | "upcoming" | "past";

const RaceFilter = ({ filter, setFilter }: { filter: RaceFilterType; setFilter: (filter: RaceFilterType) => void }) => {
    const t = useTranslations();
    return (
        <div className="flex items-center rounded-lg bg-gray-100 px-0.5 py-1 text-sm">
            <RaceFilterKind onSelect={() => setFilter("all")} isActive={filter === "all"} name={t("pages.races.filter.all")} />
            <RaceFilterKind
                onSelect={() => setFilter("upcoming")}
                isActive={filter === "upcoming"}
                name={t("pages.races.filter.upcoming")}
            />
            <RaceFilterKind onSelect={() => setFilter("past")} isActive={filter === "past"} name={t("pages.races.filter.past")} />
        </div>
    );
};

type RacesProps = {
    initialData: AppRouterOutputs["race"]["races"];
};

export const Races = ({ initialData }: RacesProps) => {
    const { data: races, refetch } = trpc.race.races.useQuery(undefined, { initialData });
    const wipeRaceMutation = trpc.action.wipe.useMutation();
    const deleteRaceMutation = trpc.race.delete.useMutation();
    const setRegistrationStatusMutation = trpc.race.setRegistrationStatus.useMutation();
    const locale = useLocale();
    // const gridRef = useRef<AgGridReact<Race>>(null);

    const sportKindTranslations = useTranslations("shared.sportKinds");
    const t = useTranslations();

    const turnOffRegistrationAction = {
        name: t("pages.registration.turnOffPopup.title"),
        description: t("pages.registration.turnOffPopup.description"),
        iconPath: mdiLockOutline,
        execute: async (race: Race) => {
            await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: false });
            void refetch();
        },
    };

    const turnOnRegistrationAction = {
        name: t("pages.registration.turnOnPopup.title"),
        description: t("pages.registration.turnOnPopup.description"),
        iconPath: mdiLockOpenVariantOutline,
        execute: async (race: Race) => {
            await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: true });
            void refetch();
        },
    };

    const myRacesActions = [
        {
            name: t("pages.races.editRacePopup.title"),
            description: t("pages.races.editRacePopup.description"),
            iconPath: mdiCalendarEditOutline,
            execute: async (editedRace: Race) => {
                const race = await Demodal.open<EditedRace>(NiceModal, {
                    title: t("pages.races.editRacePopup.title"),
                    component: RaceEdit,
                    props: {
                        editedRace,
                    },
                });

                if (race) {
                    void refetch();
                }
            },
        },
        {
            name: t("pages.races.wipeStopwatchPopup.title"),
            description: t("pages.races.wipeStopwatchPopup.description"),
            iconPath: mdiRestore,
            execute: async (race: Race) => {
                const confirmed = await Demodal.open<boolean>(NiceModal, {
                    title: t("pages.races.wipeStopwatchPopup.confirmation.title"),
                    component: Confirmation,
                    props: {
                        message: t("pages.races.wipeStopwatchPopup.confirmation.text", { raceName: race.name }),
                    },
                });

                if (confirmed) {
                    await wipeRaceMutation.mutateAsync({ raceId: race.id });
                    void refetch();
                }
            },
        },
        {
            name: t("pages.races.deleteRacePopup.title"),
            description: t("pages.races.deleteRacePopup.description"),
            iconPath: mdiTrashCan,
            execute: async (race: Race) => {
                const confirmed = await Demodal.open<boolean>(NiceModal, {
                    title: t("pages.races.deleteRacePopup.confirmation.title"),
                    component: Confirmation,
                    props: {
                        message: t("pages.races.deleteRacePopup.confirmation.text", { raceName: race.name }),
                    },
                });

                if (confirmed) {
                    await deleteRaceMutation.mutateAsync({ raceId: race.id });
                    void refetch();
                }
            },
        },
    ];

    const getShortcut = (name: string) => name.slice(0, 2).toUpperCase();

    const [filter, setFilter] = useState<RaceFilterType>("all");

    const openCreateDialog = async () => {
        const race = await Demodal.open<CreatedRace>(NiceModal, {
            title: t("pages.races.createRace.title"),
            component: RaceCreate,
            props: {},
        });

        if (race) {
            void refetch();
        }
    };

    const futureRaces = races.filter(r => isTodayOrLater(r.date));
    const ascSortedFutureRaces = sort(futureRaces, f => f.date.getTime());

    const pastRaces = races.filter(r => isPast(r.date));
    const descSortedPastRaces = sortDesc(pastRaces, r => r.date.getTime());

    const upcomingRaces = ascSortedFutureRaces.slice(0, 3);
    const allRaces = [...ascSortedFutureRaces, ...descSortedPastRaces].filter(r =>
        filter === "all" ? true : filter === "past" ? isPast(r.date) : filter === "upcoming" ? isTodayOrLater(r.date) : false,
    );

    const sportKindNames = new Map(sportKinds.map(sk => [sk, sportKindTranslations(sk)]));

    /* <Head>
                <title>{t("pages.races.header.title")}</title>
            </Head> */

    return (
        <div className="border-1 relative flex h-full flex-col border-solid border-gray-600">
            <div className="flex flex-col items-center py-8">
                <div className="w-[768px]">
                    <PageHeader
                        title={t("pages.races.upcomingRaces.header.title")}
                        description={t("pages.races.upcomingRaces.header.description")}
                    />
                    {/* <div className="mb-4 inline-flex">
                            <Button outline onClick={openCreateDialog}>
                                <Icon size={0.8} path={mdiPlus} />
                                <span className="ml-2">{t("pages.races.addRace")}</span>
                            </Button>
                        </div> */}
                    <div className={classNames("mt-6 flex flex-wrap gap-6", { ["justify-between"]: upcomingRaces.length === 3 })}>
                        <div
                            onClick={openCreateDialog}
                            className="flex w-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg text-gray-900 shadow-lg transition-transform duration-300 ease-in-out will-change-transform hover:-translate-y-1"
                        >
                            <button className="flex h-14 w-14 items-center justify-center rounded-md bg-gray-100 font-medium">
                                <Icon size={1.2} path={mdiPlus} />
                            </button>
                            <span className="mt-4 text-sm font-semibold">{t("pages.races.addRace")}</span>
                        </div>
                        {upcomingRaces.map(r => (
                            <Link
                                key={r.id}
                                href={`/${r.id}`}
                                className="h-64 w-40 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out will-change-transform hover:-translate-y-1"
                            >
                                <div className="flex h-44 w-full flex-col items-center justify-center gap-2 bg-gray-800 text-white">
                                    <div className="text-6xl">{getShortcut(r.name)}</div>
                                    <div className="text-xs font-semibold text-gray-400">{r.date.toLocaleDateString(locale)}</div>
                                </div>
                                <div className="p-4 ">
                                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold">{r.name}</div>
                                    <div className="line-clamp-2 overflow-hidden text-ellipsis text-xs text-gray-500">{r.description}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center bg-gray-50 py-8">
                <div className="w-[768px]">
                    <div className="flex items-center justify-between">
                        <PageHeader
                            title={t("pages.races.list.header.title", { number: allRaces.length })}
                            description={t("pages.races.list.header.description")}
                        />
                        <RaceFilter filter={filter} setFilter={setFilter} />
                    </div>
                    <div className="flex flex-col gap-2">
                        {allRaces.map(r => (
                            <div key={r.id} className="flex items-center rounded-md bg-white px-8 py-6 shadow-lg">
                                {/* <div className="w-20 h-20 bg-gray-100 rounded-full font-semibold flex flex-col justify-center items-center">
                                        <div className="text-2xs font-semibold text-gray-400">
                                            {monthForLocale(r.date.getMonth(), "short", "pl-PL").toUpperCase()}
                                        </div>
                                        <div className="text-2xl">{r.date.getDate().toString().padStart(2, "0")}</div>
                                    </div> */}

                                <div>
                                    {/* <div className="flex">
                                        <Icon path={mdiClockOutline} size={1} />
                                        <span className="ml-1">{r.date.toLocaleDateString(locale)}</span>
                                    </div> */}
                                </div>

                                {/* <div className="mr-8 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-gray-100 font-semibold">
                                    <div className="flex gap-0.5 text-lg">
                                        <div>{r.date.getDate().toString().padStart(2, "0")}</div>
                                        <span></span>
                                        <div>{monthForLocale(r.date.getMonth(), "short", "pl-PL").toUpperCase()}</div>
                                    </div>
                                    <div className="flex gap-0.5 text-xs">
                                        <div className="flex">{r.date.getFullYear()}</div>
                                    </div>
                                </div> */}
                                <div className="flex w-72 flex-col">
                                    <div className="flex items-center">
                                        <div className="flex text-xs">
                                            <Icon className="text-gray-500" path={mdiCalendarOutline} size={0.6} />
                                            <span className="ml-1 font-semibold">{r.date.toLocaleDateString(locale)}</span>
                                        </div>
                                        <div className="ml-4 flex text-xs">
                                            <Icon className="text-gray-500" path={mdiMapMarkerOutline} size={0.6} />
                                            <span className="ml-1 whitespace-nowrap font-semibold">{r.location}</span>
                                        </div>
                                        <div className="ml-4 flex text-xs">
                                            <Icon className="text-gray-500" path={mdiArrowRightThick} size={0.6} />
                                            <span className="ml-1 whitespace-nowrap font-semibold">{sportKindNames.get(r.sportKind)}</span>
                                        </div>
                                    </div>
                                    {/* <div>
                                            <span>{r.date.getDate().toString().padStart(2, "0")} </span>
                                            <span>{capitalizeFirstLetter(monthForLocale(r.date.getMonth(), "long", "pl-PL"))} </span>
                                            <span>{r.date.getFullYear().toString()} </span>
                                            <span className="mx-1">•</span>
                                            <span>{timeOnlyFormatTimeNoSec(r.date.getTime())}</span>
                                        </div> */}
                                    {/* <div className="text-xs font-semibold text-gray-500 text-ellipsis">Cycling</div> */}
                                    <div className="py-2 text-sm font-semibold">{r.name}</div>
                                    <div className="text-ellipsis text-xs text-gray-500">{r.description}</div>
                                </div>
                                <div className="flex grow flex-col items-center">
                                    <div className="flex flex-col">
                                        <div className="flex flex-col">
                                            <div className="text-xs font-semibold uppercase text-gray-400">
                                                {t("pages.races.registration")}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Registrations race={r} /> <RegistrationEnabled race={r} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <PoorActions
                                        item={r}
                                        actions={
                                            r.registrationEnabled
                                                ? [turnOffRegistrationAction, ...myRacesActions]
                                                : [turnOnRegistrationAction, ...myRacesActions]
                                        }
                                    />
                                </div>

                                <Link
                                    className="group inline-flex items-center rounded-full px-3 py-2 text-base font-medium hover:bg-gray-100 hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                    href={`/${r.id}`}
                                >
                                    {/* <Button outline> */}
                                    <Icon size={0.8} path={mdiOpenInNew} />
                                    {/* <span className="ml-2">{t("pages.races.manage")}</span> */}
                                    {/* </Button> */}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
