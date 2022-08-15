import { formatTimeWithMilliSecUTC } from "@set/shared/dist";
import { useRouter } from "next/router";
import { InferQueryOutput, trpc } from "trpc";

const Result = () => {
    const {
        query: { raceId },
    } = useRouter();
    const { data: results } = trpc.useQuery(["result.results", { raceId: parseInt(raceId! as string) }]);

    return (
        <div className="container flex justify-center mx-auto">
            <div className="flex flex-col">
                <div className="w-full">
                    <div className="border-b border-gray-200 shadow">
                        <table className="divide-y divide-gray-300 ">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-2 text-xs text-gray-500">#</th>
                                    <th className="px-6 py-2 text-xs text-gray-500">Bib</th>
                                    <th className="px-6 py-2 text-xs text-gray-500">Name</th>
                                    <th className="px-6 py-2 text-xs text-gray-500">Last Name</th>
                                    <th className="px-6 py-2 text-xs text-gray-500">Team</th>
                                    <th className="px-6 py-2 text-xs text-gray-500">Gender</th>
                                    <th className="px-6 py-2 text-xs text-gray-500">Result</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-300">
                                {results &&
                                    results.map((s, i) => (
                                        <tr className="whitespace-nowrap">
                                            <td className="px-6 py-4">{i + 1}</td>
                                            <td className="px-6 py-4">{s.bibNumber}</td>
                                            <td className="px-6 py-4">{s.name}</td>
                                            <td className="px-6 py-4">{s.lastName}</td>
                                            <td className="px-6 py-4">{s.team ?? ""}</td>
                                            <td className="px-6 py-4">{s.gender}</td>
                                            <td className="px-6 py-4">{formatTimeWithMilliSecUTC(s.result)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
