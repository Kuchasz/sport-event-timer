import type { PropsWithChildren } from "hono/jsx";
import { ResultsRow, type Result } from "./results-row";
import { createRange } from "@set/utils/dist/array";

const results: Result[] = createRange({ from: 1, to: 150 }).map(i => ({
    name: `Name ${i}`,
    lastName: `Last Name ${i}`,
    bibNumber: `Bib ${i}`,
    openCategory: { name: `Open Category ${i}` },
    ageCategory: { name: `Age Category ${i}` },
    openCategoryPlace: i % 3 === 0 ? 1 : i % 2 === 0 ? 2 : i % 5 === 0 ? 3 : 0,
    ageCategoryPlace: i % 5 === 0 ? 1 : i % 3 === 0 ? 2 : i % 2 === 0 ? 3 : 0,
    gap: i * 1000,
    invalidState: i % 7 === 0 ? "DNF" : i % 11 === 0 ? "DSQ" : "",
}));

type Post = {
    id: number;
    title: string;
};

export function Page({ title }: PropsWithChildren<Post>) {
    return (
        <table className="w-full divide-y divide-gray-300">
            <thead className="sticky top-0 bg-white">
                <tr className="bg-orange-500 text-white">
                    <th className="px-2 text-left uppercase" colSpan={6}>
                        {title}
                    </th>
                </tr>
                <tr>
                    <th className="w-12 px-1 py-2 text-xs text-gray-800">place</th>
                    <th className="px-1 py-2 text-left text-xs text-gray-800">player</th>

                    <th className="px-1 py-2 text-xs text-gray-800">open</th>

                    <th className="px-1 py-2 text-xs text-gray-800">category</th>

                    <th className="py-2 text-right text-xs text-gray-800">gap</th>
                    <th></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-none bg-white">
                {results.map((result, i) => (
                    <ResultsRow
                        highlightOpenCategories={true}
                        ageCategoriesExist={true}
                        openCategoriesExist={true}
                        displayDetails={false}
                        result={result}
                        i={i}></ResultsRow>
                ))}
            </tbody>
        </table>
    );
}
