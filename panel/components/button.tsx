import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { outline?: boolean };

export const Button = ({ outline, children, className, ...props }: ButtonProps) => {
    const visuals = outline ? "border-1 border-blue-600 hover:bg-blue-100" : "bg-blue-100 focus-visible:ring-blue-500 hover:bg-blue-200";
    return (
        <button
            type="button"
            {...props}
            className={
                `flex items-center justify-center rounded-md border text-blue-900 border-transparent px-4 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 ${visuals} ${className}`}>
            {children}
        </button>
    );
};
