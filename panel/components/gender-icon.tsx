import { Gender } from "@set/timer/dist/model";

export const GenderIcon = ({ gender }: { gender: Gender }) =>
    gender === "male" ? (
        <div className="h-full flex items-center">
            <div className="flex items-center justify-center bg-blue-500 h-7 w-7 text-center text-white rounded-full font-bold">M</div>
        </div>
    ) : (
        <div className="h-full flex items-center">
            <div className="flex items-center justify-center bg-red-500 h-7 w-7 text-center text-white rounded-full font-bold">F</div>
        </div>
    );
