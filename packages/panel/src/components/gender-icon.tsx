import { mdiGenderFemale, mdiGenderMale } from "@mdi/js";
import Icon from "@mdi/react";
import type { Gender } from "src/modules/shared/models";
import { useTranslations } from "use-intl";

export const OldGenderIcon = ({ gender }: { gender: Gender }) => {
    const t = useTranslations("shared.genders");
    return gender === "male" ? (
        <div className="flex h-full items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-center font-bold text-white">
                {t(gender).charAt(0)}
            </div>
        </div>
    ) : gender === "female" ? (
        <div className="flex h-full items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-center font-bold text-white">
                {t(gender).charAt(0)}
            </div>
        </div>
    ) : (
        <div className="flex h-full items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-center font-bold text-white"></div>
        </div>
    );
};

export const GenderIcon = ({ gender }: { gender: Gender }) => {
    const t = useTranslations("shared.genders");
    return gender === "male" ? (
        <div className="flex h-full items-center">
            <Icon className="text-gray-500" size={0.8} path={mdiGenderMale}></Icon>
            <div className="ml-1">{t(gender)}</div>
        </div>
    ) : gender === "female" ? (
        <div className="flex h-full items-center">
            <Icon className="text-gray-500" size={0.8} path={mdiGenderFemale}></Icon>
            <div className="ml-1">{t(gender)}</div>
        </div>
    ) : (
        <div className="flex h-full items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-center font-bold text-white"></div>
        </div>
    );
};
