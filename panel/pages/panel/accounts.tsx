import DataGrid, { Column, SortColumn } from "react-data-grid";
import { AppRouterOutputs } from "trpc";
import { trpc } from "../../connection";

import { useState } from "react";

type Account = AppRouterOutputs["account"]["accounts"][0];

const Accounts = () => {
    const { data: accounts } = trpc.account.accounts.useQuery();
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const columns: Column<Account, unknown>[] = [{ key: "email", name: "Email" }];

    return (
        <>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                {accounts && (
                    <DataGrid
                        className="rdg-light h-full"
                        sortColumns={sortColumns}
                        defaultColumnOptions={{
                            sortable: true,
                            resizable: true,
                        }}
                        onSortColumnsChange={setSortColumns}
                        columns={columns}
                        rows={accounts}
                    />
                )}
            </div>
        </>
    );
};

export default Accounts;

export { getSecuredServerSideProps as getServerSideProps } from "../../auth";
