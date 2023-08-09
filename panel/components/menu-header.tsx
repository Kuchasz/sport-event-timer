import classNames from "classnames";

export const MenuHeader = (n: { text: string }) => (
    <div className={classNames("uppercase pt-10 px-8 text-gray-300 font-semibold flex items-center text-xs")}>{n.text}</div>
);
