import { Icon } from "@mdi/react";
import { getTimingPointIcon } from "../../utils";

export const TimingPointIcon = ({ isFirst, isLast }: { isFirst: boolean; isLast: boolean }) => (
    <Icon size={0.8} path={getTimingPointIcon(isFirst, isLast)} />
);
