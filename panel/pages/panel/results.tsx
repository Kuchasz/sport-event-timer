import DataGrid, { Column, SortColumn } from "react-data-grid";

import { formatTimeWithMilliSec, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import { AppRouterTypes } from "trpc";
import { trpc } from "../../connection";

import { useCurrentRaceId } from "../../hooks";
import { useState } from "react";

type Result = AppRouterTypes["result"]["results"]["output"][0];

const Results = () => {
    const raceId = useCurrentRaceId();
    const { data: results } = trpc.result.results.useQuery({ raceId: raceId! });
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const columns: Column<Result, unknown>[] = [
        { key: "bibNumber", name: "Bib", width: 10 },
        { key: "player.name", name: "Name", formatter: p => <span>{p.row.name}</span> },
        { key: "player.lastName", name: "Last Name", formatter: p => <span>{p.row.lastName}</span> },
        { key: "start", name: "Start", formatter: p => <span>{formatTimeWithMilliSec(p.row.start)}</span> },
        { key: "finish", name: "Finish", formatter: p => <span>{formatTimeWithMilliSec(p.row.finish)}</span> },
        { key: "result", name: "Result", formatter: p => <span>{formatTimeWithMilliSecUTC(p.row.result)}</span> }
    ];

    return (
        <>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                {/* <div className="mb-4 inline-flex">
                    <Button onClick={() => {}}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div> */}
                {results && (
                    <DataGrid className='rdg-light h-full'
                        sortColumns={sortColumns}
                        defaultColumnOptions={{
                            sortable: true,
                            resizable: true
                        }}
                        onSortColumnsChange={setSortColumns}
                        columns={columns}
                        rows={results}
                    />
                )}
            </div>
        </>
    );
};

export default Results;
