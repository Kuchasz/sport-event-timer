import { Icon } from "@mdi/react";
import { mdiFlagCheckered, mdiRayStartArrow, mdiRayVertex } from "@mdi/js";
import { TimeKeeperType } from "@set/timer/model";

const getIconFromType = (type: TimeKeeperType) => {
    switch (type) {
        case "start":
            return mdiRayStartArrow;
        case "checkpoint":
            return mdiRayVertex;
        case "end":
            return mdiFlagCheckered;
        default:
            throw new Error("Not handled time keeper type");
    }
};

export const TimeKeeperIcon = ({ type }: { type: TimeKeeperType }) => <Icon size={1} path={getIconFromType(type)} />;
