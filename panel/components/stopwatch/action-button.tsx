import Icon from "@mdi/react";
import classNames from "classnames";

export const PrimaryActionButton = ({
    onClick,
    icon,
    contents,
    disabled,
}: {
    onClick: () => void;
    icon?: string;
    contents?: JSX.Element;
    disabled?: boolean;
}) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className="active:animate-pushIn mx-0.5 flex items-center rounded-xl bg-orange-100 px-3 py-2 text-orange-600 disabled:bg-zinc-100 disabled:text-zinc-600 ">
        {icon && <Icon path={icon} size={0.8} />}
        {contents}
    </button>
);

export const ActionButton = ({
    onClick,
    icon,
    contents,
    alert = false,
}: {
    onClick: () => void;
    icon?: string;
    contents?: JSX.Element;
    alert?: boolean;
}) => (
    <button
        onClick={onClick}
        className={classNames("active:animate-pushIn mx-0.5 flex items-center rounded-xl px-3 py-2", {
            ["bg-red-600 text-white"]: alert,
            ["bg-zinc-100"]: !alert,
        })}>
        {icon && <Icon path={icon} size={0.8} />}
        {contents}
    </button>
);
