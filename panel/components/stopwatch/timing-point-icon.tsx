import { Icon } from "@mdi/react";
import { getTimingPointIcon } from "../../utils";

export const TimingPointIcon = ({ isFirst, isLast }: { isFirst: boolean; isLast: boolean }) => (
    <Icon className="text-gray-600" size={1.2} path={getTimingPointIcon(isFirst, isLast)} />
);
