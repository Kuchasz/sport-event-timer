import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { outline?: boolean };

export const Button = ({ outline, children, className, ...props }: ButtonProps) => {
    const visuals = outline ? "bg-blue-100 text-blue-900 hover:bg-blue-200" : "bg-blue-500 text-white focus-visible:ring-blue-500 hover:bg-blue-600";
    return (
        <button
            type="button"
            {...props}
            className={
                `flex items-center justify-center rounded-full border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 ${visuals} ${className}`}>
            {children}
        </button>
    );
};
