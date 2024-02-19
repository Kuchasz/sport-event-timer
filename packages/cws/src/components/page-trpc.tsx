import type { PropsWithChildren } from "hono/jsx";
import { ResultsRow } from "./results-row";
import { getTrpcData } from "./api_trpc";

type Post = {
    id: number;
    title: string;
};

export async function PageTrpc({ title }: PropsWithChildren<Post>) {
    const results = await getTrpcData();

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
                        result={result as any}
                        i={i}></ResultsRow>
                ))}
            </tbody>
        </table>
    );
}
