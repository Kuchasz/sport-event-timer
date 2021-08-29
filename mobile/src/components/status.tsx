type StatusProps = { measurementPoint: string };
export const Status = ({ measurementPoint }: StatusProps) => (
    <div className="px-5 w-screen flex-shrink-0 flex items-center bg-white font-semibold text-black border h-16">
        {measurementPoint}
    </div>
);
