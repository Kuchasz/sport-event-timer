import { Gender } from "@set/timer/dist/model";

export const GenderIcon = ({ gender }: { gender: Gender }) =>
    gender === "male" ? (
        <div className="flex h-full items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-center font-bold text-white">M</div>
        </div>
    ) : gender === "female" ? (
        <div className="flex h-full items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-center font-bold text-white">F</div>
        </div>
    ) : (
        <div className="flex h-full items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-center font-bold text-white"></div>
        </div>
    );
