import classNames from "classnames";
import type { HTMLProps } from "react";

type InputProps = HTMLProps<HTMLInputElement>;

export const Input = ({ className, height, width, ...props }: InputProps) => {
    return (
        <input
            {...props}
            style={{ height: height ?? "38px", width: width ?? "100%" }}
            className={classNames(
                "block w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                className,
            )}
        />
    );
};
