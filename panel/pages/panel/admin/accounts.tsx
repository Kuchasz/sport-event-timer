import DataGrid, { Column, SortColumn } from "react-data-grid";
import { AppRouterOutputs } from "trpc";
import { trpc } from "../../../connection";

type Account = AppRouterOutputs["account"]["accounts"][0];

const Accounts = () => {
    const { data: accounts } = trpc.account.accounts.useQuery();

    const columns: Column<Account, unknown>[] = [{ key: "email", name: "Email" }];

    return (
        <>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                {accounts && (
                    <DataGrid
                        className="rdg-light h-full"
                        defaultColumnOptions={{
                            sortable: false,
                            resizable: true,
                        }}
                        columns={columns}
                        rows={accounts}
                    />
                )}
            </div>
        </>
    );
};

export default Accounts;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
