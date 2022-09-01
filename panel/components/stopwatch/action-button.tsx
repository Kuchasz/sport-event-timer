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
        className="mx-0.5 bg-gradient-to-r from-orange-500 to-red-500 flex items-center rounded-xl px-3 py-2 text-white"
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
    <button onClick={onClick} className="mx-0.5 bg-zinc-100 flex items-center rounded-xl px-3 py-2">
        {icon && <Icon path={icon} size={1} />}
        {contents}
    </button>
);
