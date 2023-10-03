import { HTMLProps } from "react";

type InputProps = HTMLProps<HTMLInputElement> & {};

export const Input = ({ className, ...props }: InputProps) => {
    return (
        <div className="rounded-md">
            <input
                {...props}
                style={{ height: "38px" }}
                className={`mt-1 block py-2 w-full px-4 text-sm border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
            />
        </div>
    );
};
