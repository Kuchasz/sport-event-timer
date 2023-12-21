import classNames from "classnames";
import type { HTMLProps } from "react";

type LabelProps = HTMLProps<HTMLLabelElement>;

export const Label = ({ children, className, ...props }: LabelProps) => {
    return (
        <label {...props} className={classNames("block w-full text-xs font-medium leading-loose text-gray-700", className)}>
            {children}
        </label>
    );
};
