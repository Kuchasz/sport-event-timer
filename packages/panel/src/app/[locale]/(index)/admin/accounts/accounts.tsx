"use client";

import { PageHeader } from "src/components/page-headers";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import type { AppRouterOutputs } from "src/trpc";
import { trpc } from "../../../../../trpc-core";

type Account = AppRouterOutputs["user"]["accounts"][0];

const defaultColumns: PoorDataTableColumn<Account>[] = [{ field: "email", headerName: "Email", sortable: true }];

export const Accounts = () => {
    const { data: accounts } = trpc.user.accounts.useQuery(undefined, { initialData: [] });

    return (
        <>
            <PageHeader title="Accounts" description="Manage accounts having access to the races" />
            <div className="flex-grow overflow-hidden">
                <PoorDataTable gridName="accounts" columns={defaultColumns} getRowId={item => item.email!} data={accounts}></PoorDataTable>
            </div>
        </>
    );
};
