import {
    mdiViewDashboardEditOutline,
    mdiTimetable,
    mdiAlarm,
    mdiNumeric,
    mdiAccountGroup,
    mdiAccountCogOutline,
    mdiTimerCogOutline,
    mdiCog,
    mdiToolboxOutline,
} from "@mdi/js";
import { useTranslations } from "next-intl";
import { Menu } from "./menu";

export const RaceMenu = ({
    raceId,
    totalPlayers,
    totalRegistrations,
}: {
    raceId: string;
    totalPlayers: number;
    totalRegistrations: number;
}) => {
    const t = useTranslations();

    const generalMenuGroup = {
        name: t("menuOptions.general.title"),
        icon: mdiAlarm,
        color: "bg-[#c2e59c]",
        to: "/:raceId",
        items: [
            {
                text: t("menuOptions.general.index"),
                icon: mdiViewDashboardEditOutline,
                to: "/:raceId",
                color: "text-blue-700",
                bg: "bg-blue-100",
            },
            {
                text: t("menuOptions.general.bibNumbers"),
                icon: mdiNumeric,
                to: "/:raceId/bib-numbers",
                color: "text-blue-700",
                bg: "bg-blue-100",
            },
            {
                text: t("menuOptions.general.players"),
                icon: mdiAccountGroup,
                to: "/:raceId/players",
                color: "text-blue-700",
                bg: "bg-blue-100",
                badgeCount: totalPlayers,
            },
            {
                text: t("menuOptions.general.registrations"),
                icon: mdiAccountGroup,
                to: "/:raceId/player-registrations",
                color: "text-blue-700",
                bg: "bg-blue-100",
                badgeCount: totalRegistrations,
            },
            {
                text: t("menuOptions.general.classifications"),
                icon: mdiAccountCogOutline,
                to: "/:raceId/classifications",
                color: "text-blue-700",
                bg: "bg-blue-100",
            },
        ],
    };

    const timeMeasurementMenuGroup = {
        name: t("menuOptions.timeMeasurement.title"),
        icon: mdiAlarm,
        color: "bg-[#c2e59c]",
        to: "/:raceId",
        items: [
            {
                text: t("menuOptions.timeMeasurement.tools"),
                icon: mdiToolboxOutline,
                to: "/:raceId/tools",
                color: "text-blue-700",
                bg: "bg-blue-100",
            },
            {
                text: t("menuOptions.timeMeasurement.timingPoints"),
                icon: mdiTimerCogOutline,
                to: "/:raceId/timing-points",
                color: "text-blue-700",
                bg: "bg-blue-100",
            },
            {
                text: t("menuOptions.timeMeasurement.splitTimes"),
                icon: mdiAlarm,
                to: "/:raceId/split-times",
                color: "text-blue-700",
                bg: "bg-blue-100",
            },
            {
                text: t("menuOptions.timeMeasurement.results"),
                icon: mdiTimetable,
                to: "/:raceId/results",
                color: "text-blue-700",
                bg: "bg-blue-100",
            },
        ],
    };
    const managementMenuGroup = {
        name: t("menuOptions.management.title"),
        icon: mdiAlarm,
        color: "bg-[#c2e59c]",
        to: "/:raceId",
        items: [
            {
                text: t("menuOptions.management.settings"),
                icon: mdiCog,
                to: "/:raceId/settings",
                color: "text-blue-700",
                bg: "bg-blue-100",
            },
        ],
    };

    return <Menu raceId={raceId} groups={[generalMenuGroup, timeMeasurementMenuGroup, managementMenuGroup]} />;
};
