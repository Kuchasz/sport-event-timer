"use client";

import { PageHeader } from "components/page-header";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../../trpc-core";

type Account = AppRouterOutputs["user"]["accounts"][0];

const defaultColumns: PoorDataTableColumn<Account>[] = [{ field: "email", headerName: "Email", sortable: true }];

export const Accounts = () => {
    const { data: accounts } = trpc.user.accounts.useQuery(undefined, { initialData: [] });

    return (
        <>
            <PageHeader title="Accounts" description="Manage accounts having access to the races" />
            <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                <PoorDataTable gridName="accounts" columns={defaultColumns} getRowId={item => item.email!} data={accounts}></PoorDataTable>
            </div>
        </>
    );
};
