import {
    mdiHomeOutline,
    mdiViewDashboardEditOutline,
    mdiBikeFast,
    mdiBriefcaseOutline,
    mdiTimetable,
    mdiAccount
} from "@mdi/js";
import { useTranslations } from "next-intl";
import { Menu } from "./menu";

export const IndexMenu = () => {
    const t = useTranslations();
    const generalMenuGroup = {
        name: t("menuOptions.general.title"),
        icon: mdiHomeOutline,
        color: "bg-[#64b3f4]",
        to: "/",
        items: [
            {
                text: t("menuOptions.general.dashboard"),
                icon: mdiViewDashboardEditOutline,
                to: "/",
                color: "text-yellow-700",
                bg: "bg-yellow-100",
            },
            {
                text: t("menuOptions.general.races"),
                icon: mdiBikeFast,
                to: "/my-races",
                color: "text-red-700",
                bg: "bg-red-50",
            },
        ],
    };

    const adminMenuGroup = {
        name: t("menuOptions.admin.title"),
        icon: mdiBriefcaseOutline,
        color: "bg-orange-500",
        to: "/admin",
        items: [
            {
                text: t("menuOptions.admin.dashboard"),
                icon: mdiViewDashboardEditOutline,
                to: "/admin",
                color: "text-yellow-700",
                bg: "bg-yellow-50",
            },
            {
                text: t("menuOptions.admin.races"),
                icon: mdiBikeFast,
                to: "/admin/races",
                color: "text-green-700",
                bg: "bg-green-50",
            },
            {
                text: t("menuOptions.admin.hello"),
                icon: mdiTimetable,
                to: "/admin/hello",
                color: "text-red-700",
                bg: "bg-red-50",
            },
            {
                text: t("menuOptions.admin.accounts"),
                icon: mdiAccount,
                to: "/admin/accounts",
                color: "text-pink-700",
                bg: "bg-pink-50",
            },
        ],
    };

    return <Menu groups={[generalMenuGroup, adminMenuGroup]} />;
};
