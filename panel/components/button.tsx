import { ButtonHTMLAttributes, DetailedHTMLProps} from "react";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { outline?: boolean };

export const Button = ({ outline, children, className, ...props }: ButtonProps) => {
    return (
        <button
            type="button"
            {...props}
            className={`flex items-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
        >
            {children}
        </button>
    );
};
