import { Icon } from "@mdi/react";
import { getTimingPointIcon } from "../../utils";

export const TimeKeeperIcon = ({ isFirst, isLast }: { isFirst: boolean; isLast: boolean }) => (
    <Icon size={1} path={getTimingPointIcon(isFirst, isLast)} />
);
