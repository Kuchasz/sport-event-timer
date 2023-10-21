import classNames from "classnames";

export const MenuHeader = (n: { text: string }) => (
    <div className={classNames("flex items-center px-8 pt-10 text-xs font-semibold uppercase text-gray-300")}>{n.text}</div>
);
