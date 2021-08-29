type StatusProps = {measurementPoint: string};
export const Status = ({measurementPoint}:StatusProps) => 
    <div className="px-5 w-screen flex items-center bg-white font-semibold text-black border h-10">{measurementPoint}</div>