import { Gender } from "@set/timer/dist/model";
import { formatGap, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import { trpc } from "connection";
import Head from "next/head";
import { useRouter } from "next/router";

const Gender = ({ gender }: { gender: Gender }) => <div>{gender.slice(0, 1)}</div>;

const Result = () => {
    const {
        query: { raceId },
    } = useRouter();
    const { data: race } = trpc.race.basicInfo.useQuery({ raceId: parseInt(raceId! as string) }, { enabled: !!raceId });
    const { data: results, dataUpdatedAt } = trpc.result.results.useQuery(
        { raceId: parseInt(raceId! as string) },
        { enabled: !!raceId, refetchInterval: 10_000 }
    );

    const openCategories = [...new Set<string>(results?.filter(r => r.openCategory).map(r => r.openCategory!.name))];
    const ageCategoriesExist = results?.some(r => !!r.ageCategory);

    return (
        <>
            <Head>
                <title>Results</title>
            </Head>
            <div className="flex flex-col items-center">
                <div className="max-w-[800px] flex my-8 px-4 flex-col">
                    <h2 className="font-semibold uppercase text-3xl">{race?.name}</h2>
                    <h3>{race?.date?.toLocaleDateString()}</h3>
                    <div className="mt-2">
                        <span>Results refresh automatically each 10 seconds.</span>
                        <span className="ml-2">Last update: {new Date(dataUpdatedAt).toLocaleTimeString("pl")}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mx-auto">
                <div className="flex flex-col">
                    <div className="w-full">
                        <div className="border-b border-gray-200 shadow">
                            <table className="divide-y divide-gray-300 ">
                                <thead className="top-0 sticky bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-xs text-gray-500">#</th>
                                        <th className="px-4 py-2 text-xs text-gray-500">Bib</th>
                                        <th className="px-4 py-2 text-xs text-left text-gray-500">Name</th>
                                        <th className="px-4 py-2 text-xs text-left text-gray-500">Team</th>
                                        {openCategories.map(c => (
                                            <th key={c} className="px-4 py-2 text-xs text-gray-500">
                                                {c}
                                            </th>
                                        ))}
                                        {ageCategoriesExist && <th className="px-4 py-2 text-xs text-gray-500">Cat.</th>}
                                        <th className="px-4 py-2 text-xs text-gray-500">Result</th>
                                        <th className="px-4 py-2 text-xs text-gray-500">Gap</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-300">
                                    {results &&
                                        results.map((s, i) => (
                                            <tr key={i} className="whitespace-nowrap">
                                                <td className="px-4 py-2 text-center text-xs">{i + 1}</td>
                                                <td className="px-4 py-2 text-center text-xs font-semibold">{s.bibNumber}</td>
                                                <td className="px-4 font-semibold py-2 text-xs">
                                                    {s.name} {s.lastName}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-ellipsis">{s.team ?? ""}</td>
                                                {openCategories.map(c => (
                                                    <td key={c} className="px-4 text-center py-2 text-xs">
                                                        {s.openCategory?.name === c && s.openCategoryPlace}
                                                    </td>
                                                ))}
                                                {ageCategoriesExist && (
                                                    <td className="px-4 py-2 text-center text-xs">
                                                        {s.ageCategory && `${s.ageCategory.name} / ${s.ageCategoryPlace}`}
                                                    </td>
                                                )}
                                                <td className="px-4 font-semibold text-right font-mono py-2 text-xs">
                                                    {formatTimeWithMilliSecUTC(s.result)}
                                                </td>
                                                <td className="px-4 text-right font-mono py-2 text-xs">{formatGap(s.gap)}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Result;
