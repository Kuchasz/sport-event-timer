import Icon from "@mdi/react";
import { mdiClockTimeFourOutline } from "@mdi/js";

export const DateAdded = ({ date }: { date: Date }) => (
    <div className="flex items-center">
        <Icon className="text-orange-500" size={1} path={mdiClockTimeFourOutline}></Icon>
        <span className="ml-2 font-semibold">{date.toLocaleDateString()}</span>
    </div>
);
