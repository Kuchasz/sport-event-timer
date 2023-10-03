import {
    mdiViewDashboardEditOutline, mdiTimetable, mdiAlarm,
    mdiNumeric,
    mdiAccountGroup,
    mdiAccountCogOutline,
    mdiTimerCogOutline,
    mdiCog
} from "@mdi/js";
import { useTranslations } from "next-intl";
import { Menu } from "./menu";

export const RaceMenu = () => {
    const t = useTranslations();

    const raceMenuGroup = {
        name: t("menuOptions.race.title"),
        icon: mdiAlarm,
        color: "bg-[#c2e59c]",
        to: "/:raceId",
        items: [
            {
                text: t("menuOptions.race.index"),
                icon: mdiViewDashboardEditOutline,
                to: "/:raceId",
                color: "text-yellow-700",
                bg: "bg-yellow-50",
            },
            {
                text: t("menuOptions.race.bibNumbers"),
                icon: mdiNumeric,
                to: "/:raceId/bib-numbers",
                color: "text-green-700",
                bg: "bg-green-50",
            },
            {
                text: t("menuOptions.race.players"),
                icon: mdiAccountGroup,
                to: "/:raceId/players",
                color: "text-pink-700",
                bg: "bg-pink-50",
            },
            {
                text: t("menuOptions.race.registrations"),
                icon: mdiAccountGroup,
                to: "/:raceId/player-registrations",
                color: "text-yellow-700",
                bg: "bg-yellow-50",
            },
            {
                text: t("menuOptions.race.classifications"),
                icon: mdiAccountCogOutline,
                to: "/:raceId/classifications",
                color: "text-purple-700",
                bg: "bg-purple-50",
            },
            {
                text: t("menuOptions.race.timingPoints"),
                icon: mdiTimerCogOutline,
                to: "/:raceId/timing-points",
                color: "text-lime-700",
                bg: "bg-lime-50",
            },
            {
                text: t("menuOptions.race.splitTimes"),
                icon: mdiAlarm,
                to: "/:raceId/split-times",
                color: "text-red-700",
                bg: "bg-red-50",
            },
            {
                text: t("menuOptions.race.results"),
                icon: mdiTimetable,
                to: "/:raceId/results",
                color: "text-blue-700",
                bg: "bg-blue-50",
            },
            {
                text: t("menuOptions.race.settings"),
                icon: mdiCog,
                to: "/:raceId/settings",
                color: "text-orange-700",
                bg: "bg-orange-50",
            },
        ],
    };

    return <Menu groups={[raceMenuGroup]} />;
};
