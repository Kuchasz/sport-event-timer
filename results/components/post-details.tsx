import { DateAdded } from "./date-added";

export const PostDetails = ({ date, author }: { date: Date; author: string }) => (
    <div className="uppercase flex my-2 text-sm items-center font-semibold">
        <span>{author}</span>
        <span style={{ width: "2px", height: "20px" }} className="inline-block mx-4 bg-gray-300"></span>
        <DateAdded date={date} />
    </div>
);
