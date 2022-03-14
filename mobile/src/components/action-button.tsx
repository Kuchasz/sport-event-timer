import Icon from "@mdi/react";

export const PrimaryActionButton = ({
    onClick,
    icon,
    contents
}: {
    onClick: () => void;
    icon?: string;
    contents?: JSX.Element;
}) => (
    <button
        onClick={onClick}
        className="mx-0.5 bg-gradient-to-r from-orange-500 to-red-500 flex items-center rounded-md px-2 py-1 text-white"
    >
        {icon && <Icon path={icon} size={1} color="white" />}
        {contents}
    </button>
);

export const ActionButton = ({
    onClick,
    icon,
    contents
}: {
    onClick: () => void;
    icon?: string;
    contents?: JSX.Element;
}) => (
    <button onClick={onClick} className="mx-0.5 bg-zinc-600 flex items-center rounded-md px-2 py-1 text-white">
        {icon && <Icon path={icon} size={1} color="white" />}
        {contents}
    </button>
);
