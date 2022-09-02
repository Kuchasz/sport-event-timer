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
        className="mx-0.5 text-orange-600 bg-orange-100 flex items-center rounded-xl px-3 py-2 "
    >
        {icon && <Icon path={icon} size={1}  />}
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
