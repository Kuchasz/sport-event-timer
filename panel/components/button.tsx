import { HTMLProps } from "react";

type ButtonColor = "blue" | "red" | "orange" | "yellow" | "zinc" | "pink" | "gray";

type ButtonProps = HTMLProps<HTMLButtonElement> & {
    color?: ButtonColor;
};

const defaultColor: ButtonColor = "blue";

export const Button = ({ color: desiredColor, children, className, ...props }: ButtonProps) => {
    const color = desiredColor ?? defaultColor;
    return (
        <button
            {...props}
            type="button"
            className={`flex items-center justify-center rounded-md border border-transparent bg-${color}-100 px-4 py-2 text-sm font-medium text-${color}-900 hover:bg-${color}-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-${color}-500 focus-visible:ring-offset-2 ${className}`}
        >
            {children}
        </button>
    );
};
