import { HTMLProps } from "react";

type TextareaProps = HTMLProps<HTMLTextAreaElement> & {};

export const TextArea = ({ className, ...props }: TextareaProps) => {
    return (
        <div className="rounded-md">
            <textarea
                {...props}
                className={`mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
            />
        </div>
    );
};
