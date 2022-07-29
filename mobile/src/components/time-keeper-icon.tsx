import { Icon } from "@mdi/react";
import { mdiFlagCheckered, mdiRayStartArrow, mdiRayVertex } from "@mdi/js";

const getIcon = (isFirst: boolean, isLast: boolean) => {
    return isFirst ? mdiRayStartArrow : isLast ? mdiFlagCheckered : mdiRayVertex;
};

export const TimeKeeperIcon = ({ isFirst, isLast }: { isFirst: boolean; isLast: boolean }) => (
    <Icon size={1} path={getIcon(isFirst, isLast)} />
);
