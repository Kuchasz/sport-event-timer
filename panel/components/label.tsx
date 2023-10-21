import type { HTMLProps } from "react";

type LabelProps = HTMLProps<HTMLLabelElement>;

export const Label = ({ children, className, ...props }: LabelProps) => {
    return (
        <label {...props} className={`block text-xs font-medium text-gray-700 ${className}`}>
            {children}
        </label>
    );
};
