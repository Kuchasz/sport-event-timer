import { HTMLProps } from "react";

type TextareaProps = HTMLProps<HTMLTextAreaElement> & {};

export const TextArea = ({ className, ...props }: TextareaProps) => {
    return (
        <div className="rounded-md">
            <textarea
                {...props}
                className={`mt-1 block py-2 w-full px-4 text-sm border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
            />
        </div>
    );
};
