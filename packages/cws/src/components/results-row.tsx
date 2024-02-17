import { formatGap } from "@set/utils/dist/datetime";
import { cx } from "classix";

export type Result = {
    bibNumber: string;
    name: string;
    lastName: string;
    openCategoryPlace: number;
    openCategory: {
        name: string;
    };
    ageCategory: {
        name: string;
    };
    ageCategoryPlace: number;
    invalidState: string;
    gap: number;
};

export const ResultsRow = ({
    i,
    result,
    displayDetails,
    openCategoriesExist,
    highlightOpenCategories,
    ageCategoriesExist,
}: {
    i: number;
    result: Result;
    displayDetails: boolean;
    openCategoriesExist: boolean;
    highlightOpenCategories: boolean;
    ageCategoriesExist: boolean;
}) => (
    <tr className={cx("cursor-pointer whitespace-nowrap", i % 2 === 1 && "bg-white", i % 2 === 0 && "bg-gray-100")}>
        <td className="px-1 py-2.5 text-center text-xs font-bold">{i + 1}</td>
        <td className="px-1 py-2.5 text-xs font-semibold uppercase">
            <span className="mr-1 font-semibold text-gray-500">{result.bibNumber}</span>
            {result.name.slice(0, 1)}. {result.lastName}
        </td>
        {openCategoriesExist && (
            <td className="flex flex-col items-center px-1 py-2.5 text-center text-xs">
                <div
                    className={cx(
                        "text-center",
                        highlightOpenCategories &&
                            !result.openCategoryPlace &&
                            result.openCategoryPlace <= 3 &&
                            "flex h-5 w-5 items-center justify-center rounded-md font-bold text-white",
                        highlightOpenCategories && result.openCategoryPlace === 3 && "bg-orange-300",
                        highlightOpenCategories && result.openCategoryPlace === 2 && "bg-gray-300",
                        highlightOpenCategories && result.openCategoryPlace === 1 && "bg-yellow-300",
                    )}>
                    {result.openCategory && `${result.openCategoryPlace}`}
                </div>
            </td>
        )}

        {ageCategoriesExist && (
            <td className="px-1 py-2.5 text-center text-xs">
                {result.ageCategory && (
                    <span className="flex justify-between">
                        {result.ageCategory.name}
                        <p className="mx-0.5">/</p>
                        <p className="font-bold">{result.ageCategoryPlace}</p>
                    </span>
                )}
            </td>
        )}

        <td className={cx("px-1 py-2.5 text-center text-xs font-semibold uppercase", !result.invalidState && "text-right")}>
            {result.invalidState ? result.invalidState : !result.invalidState && formatGap(result.gap)}
        </td>
        <td className="pl-1 pr-2 text-gray-400">
            <span className={cx("mdi", displayDetails ? "mdi-chevron-down" : "mdi-chevron-right")}></span>
        </td>
    </tr>
);
