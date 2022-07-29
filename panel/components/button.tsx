import { HTMLProps } from "react";

type ButtonProps = HTMLProps<HTMLButtonElement> & {};

export const Button = ({ children, className, ...props }: ButtonProps) => {
    return (
        <button
            {...props}
            type="button"
            className={`flex items-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
        >
            {children}
        </button>
    );
};
