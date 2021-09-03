type StatusProps = { timeKeeperName: string };
export const Status = ({ timeKeeperName }: StatusProps) => (
    <div className="px-5 w-screen flex-shrink-0 flex items-center bg-white font-semibold text-black border h-10">
        {timeKeeperName}
    </div>
);
