import type { HTMLProps } from "react";

type InputProps = HTMLProps<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => {
    return (
        <div className="rounded-md">
            <input
                {...props}
                style={{ height: "38px" }}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
            />
        </div>
    );
};
