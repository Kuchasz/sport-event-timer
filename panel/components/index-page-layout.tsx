import { Meta } from "./meta";
import { AgGridProvider } from "./ag-grid-provider";
import { IndexStatus } from "./index-status";

type Props = {
    children: React.ReactNode;
};

export const IndexPageLayout = ({ children }: Props) => {
    return (
        <>
            <Meta />
            <div className="h-full relative">
                <div className="will-change-transform h-full w-full flex">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <main className="flex flex-col items-center grow h-full overflow-y-auto">
                            <IndexStatus />
                            <div className="w-full flex flex-col flex-grow">
                                <AgGridProvider>{children}</AgGridProvider>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};
